import type { NextRequest } from 'next/server';
import { parseTags, toBool } from '@/lib/server/http';
import type { BuildEntry } from '@/lib/server/build';

export type ProjectInput = {
  raw: Record<string, unknown>;
  has: (key: string) => boolean;
  imageFile: File | null;
  buildFile: File | null;
  buildFolder: BuildEntry[] | null;
  method?: string; // _method spoof for multipart PUT
};

/** Read a project request body from JSON or multipart/form-data uniformly. */
export async function readProjectInput(req: NextRequest): Promise<ProjectInput> {
  const contentType = req.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const raw: Record<string, unknown> = {};
    let imageFile: File | null = null;
    let buildFile: File | null = null;
    const folderFiles: File[] = [];
    for (const [key, value] of form.entries()) {
      if (value instanceof File) {
        if (key === 'image_file' && value.size > 0) imageFile = value;
        if (key === 'build_file' && value.size > 0) buildFile = value;
        if (key === 'build_files') folderFiles.push(value);
      } else {
        raw[key] = value;
      }
    }
    const paths = form.getAll('build_paths').map(String);
    const buildFolder = folderFiles.length
      ? folderFiles.map((file, i) => ({ path: paths[i] || file.name, file }))
      : null;
    return {
      raw,
      has: (k) => k in raw,
      imageFile,
      buildFile,
      buildFolder,
      method: typeof raw._method === 'string' ? raw._method.toUpperCase() : undefined,
    };
  }

  const json = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  return { raw: json, has: (k) => k in json, imageFile: null, buildFile: null, buildFolder: null };
}

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  const rand = Math.floor(100 + Math.random() * 900);
  return `${base || 'project'}-${rand}`;
}

export { parseTags, toBool };
