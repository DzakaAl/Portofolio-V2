import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';
import sharp from 'sharp';

const ALLOWED = new Set(['jpeg', 'jpg', 'png', 'gif', 'webp', 'svg']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB, matching old validation

// Served by nginx (prod) / Next public (dev) at /storage/projects/<file>.
const PUBLIC_SUBDIR = path.join('storage', 'projects');

function extFromName(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot >= 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/**
 * Persist an uploaded project image and return its public URL path
 * (e.g. "/storage/projects/ab12cd34.jpg"). Throws on invalid type/size.
 */
export async function saveProjectImage(file: File): Promise<string> {
  const ext = extFromName(file.name) || 'png';
  if (!ALLOWED.has(ext)) {
    throw new Error('Format gambar tidak didukung (jpeg, png, jpg, gif, webp, svg).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Ukuran gambar maksimal 5MB.');
  }

  const dir = path.join(process.cwd(), 'public', PUBLIC_SUBDIR);
  await mkdir(dir, { recursive: true });

  // Raster uploads are stored as WebP (smaller, consistent); svg/gif are kept as-is.
  const raw = Buffer.from(await file.arrayBuffer());
  const toWebp = ext !== 'svg' && ext !== 'gif';
  const filename = `${randomBytes(20).toString('hex')}.${toWebp ? 'webp' : ext}`;
  const buffer = toWebp ? await sharp(raw).rotate().webp({ quality: 88 }).toBuffer() : raw;
  await writeFile(path.join(dir, filename), buffer);
  if (toWebp) await writeWallVariant(buffer, path.join(dir, filename.replace(/\.webp$/, '-wall.webp'))).catch(() => {});

  return `/storage/projects/${filename}`;
}

/** Persist an uploaded certificate image, return "/certs/<file>". */
export async function saveCertImage(file: File): Promise<string> {
  const ext = (file.name.split('.').pop() || 'png').toLowerCase();
  if (!ALLOWED.has(ext)) {
    throw new Error('Format gambar tidak didukung (jpeg, png, jpg, gif, webp, svg).');
  }
  if (file.size > MAX_BYTES) {
    throw new Error('Ukuran gambar maksimal 5MB.');
  }
  const dir = path.join(process.cwd(), 'public', 'certs');
  await mkdir(dir, { recursive: true });
  const filename = `${randomBytes(20).toString('hex')}.${ext}`;
  await writeFile(path.join(dir, filename), Buffer.from(await file.arrayBuffer()));
  return `/certs/${filename}`;
}

/**
 * Writes "<name>-wall.webp": same image with the (near-uniform) backdrop connected to the
 * edges made transparent, so mock-ups float on dark surfaces (Hero, project wall).
 */
async function writeWallVariant(webp: Buffer, outFile: string): Promise<void> {
  const { data, info } = await sharp(webp).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const TOL = 14;
  const seen = new Uint8Array(w * h);
  const stack: number[] = [];
  const seed = (x: number, y: number) => {
    const i = y * w + x;
    if (!seen[i]) { seen[i] = 1; stack.push(i); }
  };
  [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1], [w >> 1, 0], [w >> 1, h - 1]].forEach(([x, y]) => seed(x, y));
  const refs = stack.map((i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]);
  const near = (i: number) =>
    refs.some((r) => Math.abs(data[i * 4] - r[0]) <= TOL && Math.abs(data[i * 4 + 1] - r[1]) <= TOL && Math.abs(data[i * 4 + 2] - r[2]) <= TOL);
  const cleared: number[] = [];
  while (stack.length) {
    const i = stack.pop()!;
    if (!near(i)) continue;
    cleared.push(i);
    const x = i % w, y = (i / w) | 0;
    if (x > 0) seed(x - 1, y);
    if (x < w - 1) seed(x + 1, y);
    if (y > 0) seed(x, y - 1);
    if (y < h - 1) seed(x, y + 1);
  }
  for (const i of cleared) data[i * 4 + 3] = 0;
  await sharp(data, { raw: { width: w, height: h, channels: 4 } }).webp({ quality: 90 }).toFile(outFile);
}
