import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { randomBytes } from 'crypto';

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

  const filename = `${randomBytes(20).toString('hex')}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

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
