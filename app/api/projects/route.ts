import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail, validationError, countWords } from '@/lib/server/http';
import { serializeProject } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';
import { readProjectInput, slugify, parseTags, toBool } from '@/lib/server/project-input';
import { saveProjectImage } from '@/lib/server/upload';
import { saveProjectBuild } from '@/lib/server/build';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

export async function GET(req: NextRequest) {
  const featured = req.nextUrl.searchParams.get('featured');
  const where =
    featured === null ? {} : { featured: toBool(featured) };
  const projects = await prisma.project.findMany({
    where,
    orderBy: { order: 'asc' },
  });
  return ok(projects.map(serializeProject));
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const input = await readProjectInput(req);
  const title = typeof input.raw.title === 'string' ? input.raw.title : '';
  const description =
    typeof input.raw.description === 'string' ? input.raw.description : '';

  const errors: Record<string, string[]> = {};
  if (!title.trim()) errors.title = ['The title field is required.'];
  if (!description.trim()) errors.description = ['The description field is required.'];
  else if (countWords(description) > 70)
    errors.description = ['Deskripsi project maksimal 70 kata.'];
  if (Object.keys(errors).length) return validationError(errors);

  let imageUrl = typeof input.raw.image === 'string' ? input.raw.image : '';
  if (input.imageFile) {
    try {
      imageUrl = await saveProjectImage(input.imageFile);
    } catch (e) {
      return validationError({ image_file: [(e as Error).message] });
    }
  }

  let link = typeof input.raw.link === 'string' && input.raw.link.trim() ? input.raw.link : null;
  if (input.buildFile || input.buildFolder) {
    try {
      link = await saveProjectBuild((input.buildFolder ?? input.buildFile)!, title);
    } catch (e) {
      return validationError({ build_file: [(e as Error).message] });
    }
  }

  const project = await prisma.project.create({
    data: {
      slug: slugify(title),
      title,
      description,
      tags: parseTags(input.raw.tags),
      image: imageUrl || FALLBACK_IMAGE,
      link,
      featured: toBool(input.raw.featured),
      showPreview: input.has('show_preview') ? toBool(input.raw.show_preview) : true,
      order: input.raw.order != null ? Number(input.raw.order) : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return ok(serializeProject(project), 'Project created successfully');
}
