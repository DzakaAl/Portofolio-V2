import type { NextRequest } from 'next/server';
import { ensureApp, readManifest, RUN_PREFIX } from '@/lib/server/app-runtime';

/**
 * Reverse proxy for hosted server builds (Laravel / full-stack Next.js):
 * /run/<app>/<path> → the app's own process on a localhost port (started on demand).
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ app: string; path?: string[] }> };

const HOP = new Set([
  'connection', 'keep-alive', 'transfer-encoding', 'upgrade', 'proxy-connection', 'te', 'trailer',
  'content-encoding', 'content-length', 'x-frame-options',
]);
const TEXT = /^(text\/html|text\/css|text\/x-component|application\/(javascript|json)|text\/javascript)/i;

async function handle(req: NextRequest, ctx: Ctx) {
  const { app, path = [] } = await ctx.params;
  const manifest = /^[a-z0-9-]{1,60}$/.test(app) ? await readManifest(app) : null;
  if (!manifest) return new Response('App tidak ditemukan', { status: 404 });

  let port: number;
  try {
    port = await ensureApp(app, manifest);
  } catch (e) {
    return new Response(`Gagal menjalankan app: ${(e as Error).message}`, { status: 502 });
  }

  const prefix = `${RUN_PREFIX}${app}`;
  const rest = path.map(encodeURIComponent).join('/');
  // Laravel & Next builds with basePath=/run/<app> expect the full path; others get it stripped.
  const upstreamPath = manifest.basePath ? `${prefix}/${rest}` : `/${rest}`;
  const target = `http://127.0.0.1:${port}${upstreamPath}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  for (const h of HOP) headers.delete(h);
  headers.delete('accept-encoding');
  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || '';
  headers.set('x-forwarded-host', host);
  headers.set('x-forwarded-proto', req.headers.get('x-forwarded-proto') || req.nextUrl.protocol.replace(':', ''));
  headers.set('x-forwarded-prefix', prefix);

  let upstream: Response;
  try {
    upstream = await fetch(target, {
      method: req.method,
      headers,
      body: req.method === 'GET' || req.method === 'HEAD' ? undefined : req.body,
      redirect: 'manual',
      // @ts-expect-error — required by Node fetch for streamed request bodies
      duplex: 'half',
    });
  } catch (e) {
    return new Response(`App tidak merespons: ${(e as Error).message}`, { status: 502 });
  }

  const out = new Headers();
  upstream.headers.forEach((v, k) => {
    if (!HOP.has(k) && k !== 'set-cookie') out.set(k, v);
  });
  for (const c of upstream.headers.getSetCookie()) out.append('set-cookie', c);

  const loc = upstream.headers.get('location');
  if (loc) {
    let l = loc.replace(/^https?:\/\/127\.0\.0\.1:\d+/, '');
    if (!manifest.basePath && l.startsWith('/') && !l.startsWith('//') && !l.startsWith(prefix + '/')) l = prefix + l;
    out.set('location', l);
  }

  const type = upstream.headers.get('content-type') || '';
  if (manifest.basePath || !TEXT.test(type) || req.method === 'HEAD') {
    return new Response(upstream.body, { status: upstream.status, headers: out });
  }

  // App built without basePath: point root-absolute asset/link URLs back under the prefix.
  let body = await upstream.text();
  body = body.replace(/(["'`(=,\s\\])\/_next\//g, `$1${prefix}/_next/`);
  if (/html/i.test(type)) {
    body = body.replace(
      /(\s(?:href|src|action|poster)=["'])\/(?!\/|_next\/)/gi,
      (_m, lead: string) => `${lead}${prefix}/`,
    );
  }
  return new Response(body, { status: upstream.status, headers: out });
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
export const OPTIONS = handle;
