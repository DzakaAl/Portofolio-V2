import { spawn, execFile, type ChildProcess } from 'child_process';
import { mkdir, writeFile, rm, readFile, cp, symlink, access, copyFile, unlink } from 'fs/promises';
import net from 'net';
import path from 'path';
import { promisify } from 'util';
import { buildInPlace, hasNextDep } from '@/lib/server/source-build';

/**
 * Hosted *server* builds (Laravel + React/Inertia, full-stack Next.js).
 *
 * Uploaded apps are extracted OUTSIDE public/ (they may hold .env / source) to
 * HOSTED_APPS_DIR/<name>/ and served at /run/<name>/… by the proxy route
 * app/run/[app]/[[...path]]/route.ts. Each app is started on demand on a free
 * localhost port and stopped again after IDLE_MS without traffic, so a small VPS
 * isn't kept busy by every portfolio project at once.
 */

export type AppKind = 'laravel' | 'next';
type Manifest = { kind: AppKind; cwd: string; basePath: boolean };

export const RUN_PREFIX = '/run/';
const MANIFEST = '.portfolio-app.json';
const IDLE_MS = 10 * 60 * 1000;
const START_TIMEOUT_MS = 45_000;

export const APPS_ROOT =
  process.env.HOSTED_APPS_DIR || path.resolve(process.cwd(), '..', 'portfolio-hosted-apps');

const run = promisify(execFile);
const exists = (p: string) => access(p).then(() => true, () => false);

export function appDir(name: string) {
  if (!/^[a-z0-9-]{1,60}$/.test(name)) throw new Error('Nama app tidak valid');
  return path.join(APPS_ROOT, name);
}

/* ───────────────────────── detection & install ───────────────────────── */

type Files = Array<[string, Uint8Array]>;

/** Shallowest folder containing `marker`, or null. */
function rootOf(files: Files, marker: string): string | null {
  const hit = files
    .map(([n]) => n)
    .filter((n) => n === marker || n.endsWith('/' + marker))
    .sort((a, b) => a.split('/').length - b.split('/').length)[0];
  if (hit === undefined) return null;
  return hit.slice(0, hit.length - marker.length);
}

export function detectServerApp(files: Files): { kind: AppKind; root: string } | null {
  const names = new Set(files.map(([n]) => n));
  const laravel = rootOf(files, 'artisan');
  if (laravel !== null && names.has(`${laravel}public/index.php`)) return { kind: 'laravel', root: laravel };
  const next = rootOf(files, '.next/BUILD_ID') ?? rootOf(files, '.next/standalone/server.js');
  if (next !== null) return { kind: 'next', root: next };
  // Next.js source (not built yet): package.json depending on next
  const pkg = rootOf(files, 'package.json');
  if (pkg !== null && hasNextDep(files, pkg)) return { kind: 'next', root: pkg };
  return null;
}

/** Next.js basePath baked into the build ('' when none). */
function nextBasePath(files: Files, root: string): string {
  const f = files.find(([n]) => n === `${root}.next/routes-manifest.json`);
  if (!f) return '';
  try {
    return String(JSON.parse(Buffer.from(f[1]).toString('utf8')).basePath || '');
  } catch {
    return '';
  }
}

async function diskBasePath(dir: string): Promise<string> {
  try {
    return String(JSON.parse(await readFile(path.join(dir, '.next', 'routes-manifest.json'), 'utf8')).basePath || '');
  } catch {
    return '';
  }
}

/**
 * Pick the folder name. A Next build made with `basePath: '/run/<name>'` gets exactly
 * that name, so its client-side routing works untouched.
 */
export function serverAppName(files: Files, slugHint: string): string {
  const d = detectServerApp(files);
  if (d?.kind === 'next') {
    const m = nextBasePath(files, d.root).match(/^\/run\/([a-z0-9-]{1,60})$/);
    if (m) return m[1];
  }
  return slugHint.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'app';
}

export async function installServerApp(files: Files, name: string): Promise<string> {
  const detected = detectServerApp(files)!;
  const { kind, root } = detected;
  const dir = appDir(name);

  await stopApp(name);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });

  for (const [n, data] of files) {
    if (!n.startsWith(root)) continue;
    const target = path.join(dir, n.slice(root.length));
    if (!target.startsWith(dir + path.sep)) continue;
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, data, { mode: n.endsWith('artisan') ? 0o755 : 0o644 });
  }

  // Source upload → install deps & build on the server (no-op when already built).
  const prefix = `${RUN_PREFIX}${name}`;
  await buildInPlace(dir, {
    skipJsBuildIf: kind === 'laravel' ? 'public/build/manifest.json' : '.next/BUILD_ID',
    env: { PORTFOLIO_PREFIX: prefix, NEXT_PUBLIC_BASE_PATH: prefix },
  });

  let manifest: Manifest;
  if (kind === 'laravel') manifest = await prepareLaravel(dir, name);
  else manifest = await prepareNext(dir, name, await diskBasePath(dir));

  await writeFile(path.join(dir, MANIFEST), JSON.stringify(manifest));
  return `${RUN_PREFIX}${name}/`;
}

async function prepareLaravel(dir: string, name: string): Promise<Manifest> {
  if (!(await exists(path.join(dir, 'vendor', 'autoload.php')))) {
    throw new Error('vendor/autoload.php tidak ada setelah composer install.');
  }
  // Cached config/routes would pin the build machine's paths & APP_URL.
  for (const f of ['config.php', 'routes-v7.php', 'routes.php', 'packages.php', 'services.php']) {
    await unlink(path.join(dir, 'bootstrap', 'cache', f)).catch(() => {});
  }
  for (const d of ['storage/framework/cache/data', 'storage/framework/sessions', 'storage/framework/views', 'storage/logs', 'bootstrap/cache']) {
    await mkdir(path.join(dir, d), { recursive: true });
  }
  // Dev-server marker would make @vite point at localhost:5173.
  await unlink(path.join(dir, 'public', 'hot')).catch(() => {});

  if (!(await exists(path.join(dir, '.env')))) {
    if (await exists(path.join(dir, '.env.example'))) await copyFile(path.join(dir, '.env.example'), path.join(dir, '.env'));
    else await writeFile(path.join(dir, '.env'), 'APP_ENV=production\nAPP_DEBUG=false\nDB_CONNECTION=sqlite\nSESSION_DRIVER=file\nCACHE_STORE=file\n');
  }
  const env = await readFile(path.join(dir, '.env'), 'utf8');
  if (!/^APP_KEY=\S+/m.test(env)) {
    await run('php', ['artisan', 'key:generate', '--force'], { cwd: dir, timeout: 30_000 }).catch(() => {});
  }
  if (/^DB_CONNECTION=sqlite/m.test(env) || !/^DB_CONNECTION=/m.test(env)) {
    const db = path.join(dir, 'database', 'database.sqlite');
    if (!(await exists(db))) {
      await mkdir(path.dirname(db), { recursive: true });
      await writeFile(db, '');
      await run('php', ['artisan', 'migrate', '--force', '--seed'], { cwd: dir, timeout: 120_000 }).catch(() => {});
    }
  }

  // Docroot where /run/<name>/… maps onto public/, so php -S serves static files
  // directly and Laravel sees itself mounted under the prefix (correct url()/asset()).
  await mkdir(path.join(dir, '.docroot', 'run'), { recursive: true });
  await symlink(path.join(dir, 'public'), path.join(dir, '.docroot', 'run', name)).catch(() => {});
  await writeFile(
    path.join(dir, '.portfolio-router.php'),
    `<?php
$prefix = getenv('PORTFOLIO_PREFIX');
$public = __DIR__ . '/public';
$uri = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$rel = substr($uri, strlen($prefix)) ?: '/';
if ($rel !== '/' && is_file($public . $rel) && !str_ends_with($rel, '.php')) return false;
if (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https') { $_SERVER['HTTPS'] = 'on'; $_SERVER['SERVER_PORT'] = 443; }
if (!empty($_SERVER['HTTP_X_FORWARDED_HOST'])) $_SERVER['HTTP_HOST'] = $_SERVER['HTTP_X_FORWARDED_HOST'];
$_SERVER['SCRIPT_FILENAME'] = $public . '/index.php';
$_SERVER['SCRIPT_NAME'] = $prefix . '/index.php';
$_SERVER['PHP_SELF'] = $prefix . '/index.php';
$_SERVER['DOCUMENT_ROOT'] = $public;
chdir($public);
require $public . '/index.php';
`,
  );
  return { kind: 'laravel', cwd: '.', basePath: true };
}

async function prepareNext(dir: string, name: string, basePath: string): Promise<Manifest> {
  const hasBase = basePath === `${RUN_PREFIX}${name}`;
  const standalone = path.join(dir, '.next', 'standalone');
  if (await exists(path.join(standalone, 'server.js'))) {
    // `output: 'standalone'` doesn't copy static assets / public — do it for the user.
    if (await exists(path.join(dir, '.next', 'static')))
      await cp(path.join(dir, '.next', 'static'), path.join(standalone, '.next', 'static'), { recursive: true });
    if (await exists(path.join(dir, 'public')))
      await cp(path.join(dir, 'public'), path.join(standalone, 'public'), { recursive: true });
    return { kind: 'next', cwd: '.next/standalone', basePath: hasBase };
  }
  if (await exists(path.join(dir, 'server.js'))) return { kind: 'next', cwd: '.', basePath: hasBase };
  if (!(await exists(path.join(dir, 'node_modules', 'next', 'dist', 'bin', 'next')))) {
    throw new Error('Build Next.js gagal: .next/ atau node_modules/next tidak ditemukan.');
  }
  return { kind: 'next', cwd: '.', basePath: hasBase };
}

/* ───────────────────────────── processes ───────────────────────────── */

type Proc = { port: number; child: ChildProcess; ready: Promise<void>; lastHit: number };
const g = globalThis as unknown as { __hostedApps?: Map<string, Proc>; __hostedReaper?: NodeJS.Timeout };
const procs = (g.__hostedApps ??= new Map());

g.__hostedReaper ??= setInterval(() => {
  const now = Date.now();
  for (const [name, p] of procs) if (now - p.lastHit > IDLE_MS) void stopApp(name);
}, 60_000).unref();

function freePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const s = net.createServer();
    s.unref();
    s.on('error', reject);
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address() as net.AddressInfo;
      s.close(() => resolve(port));
    });
  });
}

function waitForPort(port: number, child: ChildProcess): Promise<void> {
  const deadline = Date.now() + START_TIMEOUT_MS;
  return new Promise((resolve, reject) => {
    const tryOnce = () => {
      if (child.exitCode !== null) return reject(new Error(`App berhenti saat start (exit ${child.exitCode})`));
      const sock = net.connect(port, '127.0.0.1');
      sock.once('connect', () => { sock.destroy(); resolve(); });
      sock.once('error', () => {
        sock.destroy();
        if (Date.now() > deadline) reject(new Error('App tidak merespons (timeout start)'));
        else setTimeout(tryOnce, 300);
      });
    };
    tryOnce();
  });
}

export async function readManifest(name: string): Promise<Manifest | null> {
  try {
    return JSON.parse(await readFile(path.join(appDir(name), MANIFEST), 'utf8')) as Manifest;
  } catch {
    return null;
  }
}

/** Ensure the app is running; returns its port. */
export async function ensureApp(name: string, m: Manifest): Promise<number> {
  const existing = procs.get(name);
  if (existing && existing.child.exitCode === null) {
    existing.lastHit = Date.now();
    await existing.ready;
    return existing.port;
  }

  const dir = appDir(name);
  const cwd = path.join(dir, m.cwd);
  const port = await freePort();
  const prefix = `${RUN_PREFIX}${name}`;
  const env: NodeJS.ProcessEnv = { ...process.env, PORT: String(port), HOSTNAME: '127.0.0.1', PORTFOLIO_PREFIX: prefix };
  // Don't leak this site's own secrets into hosted apps.
  delete env.DATABASE_URL;
  delete env.NODE_OPTIONS;

  let child: ChildProcess;
  if (m.kind === 'laravel') {
    child = spawn('php', ['-S', `127.0.0.1:${port}`, '-t', path.join(dir, '.docroot'), path.join(dir, '.portfolio-router.php')], {
      cwd: dir, env, stdio: 'ignore',
    });
  } else if (await exists(path.join(cwd, 'server.js'))) {
    child = spawn(process.execPath, ['server.js'], { cwd, env: { ...env, NODE_ENV: 'production' }, stdio: 'ignore' });
  } else {
    child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
      cwd, env: { ...env, NODE_ENV: 'production' }, stdio: 'ignore',
    });
  }
  child.on('exit', () => { if (procs.get(name)?.child === child) procs.delete(name); });

  const proc: Proc = { port, child, lastHit: Date.now(), ready: waitForPort(port, child) };
  procs.set(name, proc);
  try {
    await proc.ready;
  } catch (e) {
    child.kill('SIGKILL');
    procs.delete(name);
    throw e;
  }
  return port;
}

export async function stopApp(name: string) {
  const p = procs.get(name);
  if (!p) return;
  procs.delete(name);
  p.child.kill('SIGTERM');
  setTimeout(() => { if (p.child.exitCode === null) p.child.kill('SIGKILL'); }, 5000).unref();
}

export async function removeServerApp(link: string | null | undefined) {
  if (!link || !link.startsWith(RUN_PREFIX)) return;
  const name = link.slice(RUN_PREFIX.length).split(/[/?#]/)[0];
  try {
    await stopApp(name);
    await rm(appDir(name), { recursive: true, force: true });
  } catch { /* invalid name */ }
}
