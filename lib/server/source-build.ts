import { execFile } from 'child_process';
import { access, readFile, readdir, mkdir, writeFile, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { promisify } from 'util';

/**
 * Source uploads: a raw project folder (no node_modules / vendor / build output)
 * is installed & built on the server, the same way you would by hand:
 *   composer.json → composer install --no-dev
 *   package.json  → <pm> install && <pm> run build   (pm picked from the lockfile)
 */

const exec = promisify(execFile);
const exists = (p: string) => access(p).then(() => true, () => false);
const INSTALL_TIMEOUT = 10 * 60 * 1000;
const BUILD_TIMEOUT = 15 * 60 * 1000;

type Files = Array<[string, Uint8Array]>;
type Pkg = { scripts?: Record<string, string>; dependencies?: Record<string, string>; devDependencies?: Record<string, string> };

/** Never trust dependency/VCS folders shipped from another machine (Next standalone output excepted). */
export const SKIP_DIR = { test: (p: string) => /(^|\/)(\.git|node_modules)\//.test(p) && !p.includes('.next/standalone/') };

async function readPkg(dir: string): Promise<Pkg | null> {
  try {
    return JSON.parse(await readFile(path.join(dir, 'package.json'), 'utf8')) as Pkg;
  } catch {
    return null;
  }
}

function cleanEnv(extra?: Record<string, string>): Record<string, string | undefined> {
  const e: Record<string, string | undefined> = { ...process.env, CI: '1', ...extra };
  if (!extra?.NODE_ENV) delete e.NODE_ENV; // else devDependencies get skipped
  delete e.DATABASE_URL;
  delete e.NODE_OPTIONS;
  return e;
}

async function sh(cmd: string, args: string[], cwd: string, timeout: number, env?: Record<string, string>) {
  try {
    await exec(cmd, args, {
      cwd,
      timeout,
      maxBuffer: 64 * 1024 * 1024,
      env: cleanEnv(env) as NodeJS.ProcessEnv,
    });
  } catch (e) {
    const err = e as { code?: string; stderr?: string; stdout?: string; message: string };
    if (err.code === 'ENOENT') throw new Error(`"${cmd}" tidak terpasang di server.`);
    const tail = (err.stderr || err.stdout || err.message).trim().split('\n').slice(-8).join('\n');
    throw new Error(`Gagal menjalankan "${cmd} ${args.join(' ')}":\n${tail}`);
  }
}

/** Package manager by lockfile, falling back to npm when that tool isn't installed. */
async function pm(dir: string): Promise<{ bin: string; install: string[] }> {
  const pick = async (bin: string, install: string[]) =>
    (await exec(bin, ['--version']).then(() => true, () => false)) ? { bin, install } : null;
  if (await exists(path.join(dir, 'pnpm-lock.yaml'))) { const r = await pick('pnpm', ['install', '--frozen-lockfile=false']); if (r) return r; }
  if (await exists(path.join(dir, 'yarn.lock'))) { const r = await pick('yarn', ['install']); if (r) return r; }
  if ((await exists(path.join(dir, 'bun.lockb'))) || (await exists(path.join(dir, 'bun.lock')))) { const r = await pick('bun', ['install']); if (r) return r; }
  return { bin: 'npm', install: (await exists(path.join(dir, 'package-lock.json'))) ? ['ci', '--include=dev'] : ['install', '--include=dev'] };
}

/** composer install (if needed) + JS install/build (if needed), in place. */
export async function buildInPlace(dir: string, opts: { skipJsBuildIf?: string; env?: Record<string, string> } = {}) {
  if ((await exists(path.join(dir, 'composer.json'))) && !(await exists(path.join(dir, 'vendor', 'autoload.php')))) {
    await sh('composer', ['install', '--no-dev', '--optimize-autoloader', '--no-interaction', '--no-progress'], dir, INSTALL_TIMEOUT);
  }
  const pkg = await readPkg(dir);
  if (!pkg) return;
  const needsBuild = !!pkg.scripts?.build && !(opts.skipJsBuildIf && (await exists(path.join(dir, opts.skipJsBuildIf))));
  const needsModules = needsBuild || !(await exists(path.join(dir, 'node_modules')));
  if (!needsModules) return;
  const { bin, install } = await pm(dir);
  await sh(bin, install, dir, INSTALL_TIMEOUT, opts.env);
  if (needsBuild) await sh(bin, ['run', 'build'], dir, BUILD_TIMEOUT, { NODE_ENV: 'production', ...opts.env });
}

export function hasNextDep(files: Files, root: string): boolean {
  const f = files.find(([n]) => n === `${root}package.json`);
  if (!f) return false;
  try {
    const p = JSON.parse(Buffer.from(f[1]).toString('utf8')) as Pkg;
    return !!(p.dependencies?.next || p.devDependencies?.next);
  } catch {
    return false;
  }
}

async function walk(dir: string, base = ''): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(path.join(dir, base), { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) { if (e.name !== 'node_modules' && e.name !== '.git') out.push(...(await walk(dir, rel))); }
    else if (e.isFile()) out.push(rel);
  }
  return out;
}

/**
 * Static front-end source (Vite, CRA, Vue, Astro…): if the upload has a package.json
 * with a build script and no built output yet, build it in a temp dir and return
 * only the output folder's files. Otherwise returns the input unchanged.
 */
export async function buildStaticSource(files: Files): Promise<Files> {
  const pkgFile = files
    .map(([n]) => n)
    .filter((n) => n === 'package.json' || n.endsWith('/package.json'))
    .sort((a, b) => a.split('/').length - b.split('/').length)[0];
  if (!pkgFile) return files;
  const root = pkgFile.slice(0, -'package.json'.length);
  let pkg: Pkg;
  try {
    pkg = JSON.parse(Buffer.from(files.find(([n]) => n === pkgFile)![1]).toString('utf8'));
  } catch {
    return files;
  }
  if (!pkg.scripts?.build) return files;
  const OUT = ['dist', 'build', 'out', 'public'];
  if (OUT.slice(0, 3).some((d) => files.some(([n]) => n === `${root}${d}/index.html`))) return files; // already built

  const tmp = path.join(os.tmpdir(), `portfolio-src-${Date.now().toString(36)}`);
  try {
    for (const [n, data] of files) {
      if (!n.startsWith(root)) continue;
      const target = path.join(tmp, n.slice(root.length));
      if (!target.startsWith(tmp + path.sep)) continue;
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, data);
    }
    // Relative asset paths so the build works from /storage/builds/<dir>/.
    await buildInPlace(tmp, { env: { PUBLIC_URL: '.', BASE_URL: './' } });

    for (const d of OUT) {
      const outDir = path.join(tmp, d);
      if (!(await exists(path.join(outDir, 'index.html')))) continue;
      const result: Files = [];
      for (const rel of await walk(outDir)) result.push([rel, new Uint8Array(await readFile(path.join(outDir, rel)))]);
      return result;
    }
    throw new Error('Build selesai, tapi index.html tidak ditemukan di dist/, build/, atau out/.');
  } finally {
    await rm(tmp, { recursive: true, force: true }).catch(() => {});
  }
}
