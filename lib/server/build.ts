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

/** Make absolute asset paths ("/assets/x.js") relative so the build works from a sub-folder. */
function relativizeHtml(html: string): string {
  return html.replace(/(\s(?:src|href)=["'])\/(?!\/)/gi, '$1./');
}

export async function saveProjectBuild(file: File, slugHint: string): Promise<string> {
  if (!file.name.toLowerCase().endsWith('.zip')) {
    throw new Error('File build harus berupa .zip (isi folder dist/build/out).');
  }
  if (file.size > MAX_BYTES) throw new Error('Ukuran file build maksimal 100MB.');

  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
  } catch {
    throw new Error('File zip rusak atau tidak bisa dibaca.');
  }

  // Sanitize paths (no zip-slip) and drop OS junk.
  const files: Array<[string, Uint8Array]> = [];
  for (const [name, data] of Object.entries(entries)) {
    if (name.endsWith('/')) continue;
    const clean = path.posix.normalize(name.replace(/\\/g, '/'));
    if (clean.startsWith('..') || clean.startsWith('/') || clean.includes('/../')) {
      throw new Error(`Path tidak valid di dalam zip: ${name}`);
    }
    if (clean.startsWith('__MACOSX/') || clean.endsWith('.DS_Store')) continue;
    files.push([clean, data]);
  }

  // Entry point = the shallowest index.html (handles zips that wrap a dist/ folder).
  const index = files
    .map(([n]) => n)
    .filter((n) => n === 'index.html' || n.endsWith('/index.html'))
    .sort((a, b) => a.split('/').length - b.split('/').length)[0];
  if (!index) throw new Error('index.html tidak ditemukan di dalam zip.');

  const base = slugHint.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 40) || 'project';
  const dirName = `${base}-${randomBytes(4).toString('hex')}`;
  const dir = path.join(ROOT, dirName);
  const indexDir = path.posix.dirname(index);

  for (const [name, data] of files) {
    const target = path.join(dir, name);
    if (!target.startsWith(dir + path.sep)) continue;
    await mkdir(path.dirname(target), { recursive: true });
    const isHtml = name.endsWith('.html') && path.posix.dirname(name) === indexDir;
    await writeFile(target, isHtml ? relativizeHtml(Buffer.from(data).toString('utf8')) : data);
  }

  return `${PUBLIC_PREFIX}${dirName}/${index}`;
}

/** Delete a hosted build folder if `link` points to one. Safe to call with any link. */
export async function removeProjectBuild(link: string | null | undefined): Promise<void> {
  if (!link || !link.startsWith(PUBLIC_PREFIX)) return;
  const dirName = link.slice(PUBLIC_PREFIX.length).split('/')[0];
  if (!dirName || dirName.includes('..')) return;
  await rm(path.join(ROOT, dirName), { recursive: true, force: true }).catch(() => {});
}
