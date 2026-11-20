import { mkdir, writeFile, rm } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import { unzipSync } from 'fflate';

/**
 * Hosted project builds: a .zip of a static build output (Vite `dist/`,
 * CRA `build/`, Next `out/`, plain HTML…) is extracted to
 * public/storage/builds/<dir>/ and served at /storage/builds/<dir>/…,
 * so the preview modal can iframe it like any live URL.
 */

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB zip
const PUBLIC_PREFIX = '/storage/builds/';
const ROOT = path.join(process.cwd(), 'public', 'storage', 'builds');

const TEXT_EXT = /\.(html?|css|js|mjs|json|svg|webmanifest)$/i;
const MAX_TEXT_REWRITE = 5 * 1024 * 1024;

/** A file of an uploaded build folder, with its path relative to the picked folder. */
export type BuildEntry = { path: string; file: File };

/**
 * Builds are served from /storage/builds/<dir>/ instead of the domain root, so
 * root-absolute references ("/assets/x.js", url(/img/a.png), "/logo.svg" inside
 * JS) would 404. Rewrite every quoted/url()/attr reference that points at a file
 * that actually exists in the build to its real served location.
 */
function rewriteAbsoluteRefs(text: string, known: Set<string>, servedBase: string): string {
  // Top-level folders of the build (e.g. "_next", "assets"): runtime-built URLs such as
  // webpack's public path ("/_next/") are never a complete file name, so match the folder.
  const dirs = [...new Set([...known].filter((k) => k.includes('/')).map((k) => k.split('/')[0]))];
  const dirRe = dirs.length
    ? new RegExp(`(["'\`(=])/(${dirs.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})/`, 'g')
    : null;
  let out = text.replace(/(["'`(=])\/(?!\/)([^"'`)\s<>?#]+)/g, (m, lead: string, rel: string) => {
    let decoded = rel;
    try { decoded = decodeURIComponent(rel); } catch { /* keep raw */ }
    return known.has(decoded) ? `${lead}${servedBase}${rel}` : m;
  });
  if (dirRe) out = out.replace(dirRe, (_m, lead: string, dir: string) => `${lead}${servedBase}${dir}/`);
  return out;
}

/**
 * History-mode SPAs (Vue/React Router) read location.pathname to pick a route, but
 * inside a sub-folder that path matches nothing → blank page showing only the layout
 * (e.g. the footer). Pin relative URLs with <base> and present the app a root path.
 */
function injectSpaShim(html: string, servedBase: string): string {
  const shim =
    `<base href="${servedBase}"><script>try{history.replaceState(null,'','/')}catch(e){}</script>`;
  return /<head[^>]*>/i.test(html)
    ? html.replace(/<head[^>]*>/i, (m) => m + shim)
    : shim + html;
}

function cleanPath(name: string): string | null {
  const clean = path.posix.normalize(name.replace(/\\/g, '/'));
  if (clean.startsWith('..') || clean.startsWith('/') || clean.includes('/../')) {
    throw new Error(`Path tidak valid: ${name}`);
  }
  if (clean.startsWith('__MACOSX/') || clean.endsWith('.DS_Store')) return null;
  return clean;
}

export async function saveProjectBuild(
  source: File | BuildEntry[],
  slugHint: string,
): Promise<string> {
  const files: Array<[string, Uint8Array]> = [];

  if (Array.isArray(source)) {
    // Folder upload (webkitdirectory): drop the picked folder's own name from the paths.
    let total = 0;
    for (const { path: rawPath, file } of source) {
      total += file.size;
      if (total > MAX_BYTES) throw new Error('Ukuran folder build maksimal 100MB.');
      const parts = rawPath.replace(/\\/g, '/').split('/');
      const clean = cleanPath(parts.length > 1 ? parts.slice(1).join('/') : rawPath);
      if (clean) files.push([clean, new Uint8Array(await file.arrayBuffer())]);
    }
    if (!files.length) throw new Error('Folder build kosong.');
  } else {
    if (!source.name.toLowerCase().endsWith('.zip')) {
      throw new Error('File build harus berupa .zip atau folder (isi folder dist/build/out).');
    }
    if (source.size > MAX_BYTES) throw new Error('Ukuran file build maksimal 100MB.');
    let entries: Record<string, Uint8Array>;
    try {
      entries = unzipSync(new Uint8Array(await source.arrayBuffer()));
    } catch {
      throw new Error('File zip rusak atau tidak bisa dibaca.');
    }
    for (const [name, data] of Object.entries(entries)) {
      if (name.endsWith('/')) continue;
      const clean = cleanPath(name);
      if (clean) files.push([clean, data]);
    }
  }

  // Entry point = the shallowest index.html (handles builds that wrap a dist/ folder).
  const index = files
    .map(([n]) => n)
    .filter((n) => n === 'index.html' || n.endsWith('/index.html'))
    .sort((a, b) => a.split('/').length - b.split('/').length)[0];
  if (!index) throw new Error('index.html tidak ditemukan di dalam build.');

  const base = slugHint.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 40) || 'project';
  const dirName = `${base}-${randomBytes(4).toString('hex')}`;
  const dir = path.join(ROOT, dirName);
  const indexDir = path.posix.dirname(index);
  const prefix = indexDir === '.' ? '' : `${indexDir}/`;

  // Files addressable from the site root, relative to the entry's folder.
  const known = new Set<string>();
  for (const [name] of files) if (name.startsWith(prefix)) known.add(name.slice(prefix.length));
  const servedBase = `${PUBLIC_PREFIX}${dirName}/${prefix}`;

  for (const [name, data] of files) {
    const target = path.join(dir, name);
    if (!target.startsWith(dir + path.sep)) continue;
    await mkdir(path.dirname(target), { recursive: true });
    const rewrite = TEXT_EXT.test(name) && data.byteLength <= MAX_TEXT_REWRITE;
    let out: Uint8Array | string = data;
    if (rewrite) {
      out = rewriteAbsoluteRefs(Buffer.from(data).toString('utf8'), known, servedBase);
      if (name === index) out = injectSpaShim(out, servedBase);
    }
    await writeFile(target, out);
  }

  // ?v= busts any stale browser copy of the entry page after re-uploads
  return `${PUBLIC_PREFIX}${dirName}/${index}?v=${Date.now().toString(36)}`;
}

/** Delete a hosted build folder if `link` points to one. Safe to call with any link. */
export async function removeProjectBuild(link: string | null | undefined): Promise<void> {
  if (!link || !link.startsWith(PUBLIC_PREFIX)) return;
  const dirName = link.slice(PUBLIC_PREFIX.length).split('/')[0];
  if (!dirName || dirName.includes('..')) return;
  await rm(path.join(ROOT, dirName), { recursive: true, force: true }).catch(() => {});
}
