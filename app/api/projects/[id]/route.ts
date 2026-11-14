import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { ok, fail, validationError, countWords } from '@/lib/server/http';
import { serializeProject } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';
import { readProjectInput, parseTags, toBool } from '@/lib/server/project-input';
import { saveProjectImage } from '@/lib/server/upload';
import { saveProjectBuild, removeProjectBuild } from '@/lib/server/build';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

async function updateProject(req: NextRequest, idStr: string) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number(idStr);
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return fail('Project not found', 404);

  const input = await readProjectInput(req);
  const data: Prisma.ProjectUpdateInput = { updatedAt: new Date() };

  if (input.has('title')) {
    const title = String(input.raw.title ?? '');
    if (!title.trim()) return validationError({ title: ['The title field is required.'] });
    data.title = title;
  }
  if (input.has('description')) {
    const description = String(input.raw.description ?? '');
    if (!description.trim())
      return validationError({ description: ['The description field is required.'] });
    if (countWords(description) > 70)
      return validationError({ description: ['Deskripsi project maksimal 70 kata.'] });
    data.description = description;
  }
  if (input.buildFile) {
    try {
      data.link = await saveProjectBuild(input.buildFile, project.slug);
    } catch (e) {
      return validationError({ build_file: [(e as Error).message] });
    }
  } else if (input.has('link')) data.link = (input.raw.link as string) || null;
  if (input.has('order')) data.order = Number(input.raw.order);
  if (input.has('featured')) data.featured = toBool(input.raw.featured);
  if (input.has('show_preview')) data.showPreview = toBool(input.raw.show_preview);
  if (input.has('tags')) data.tags = parseTags(input.raw.tags);

  if (input.imageFile) {
    try {
      data.image = await saveProjectImage(input.imageFile);
    } catch (e) {
      return validationError({ image_file: [(e as Error).message] });
    }
  } else if (input.has('image') && String(input.raw.image ?? '').trim()) {
    data.image = String(input.raw.image);
  }

  const updated = await prisma.project.update({ where: { id }, data });
  // Old hosted build replaced/unlinked → clean up its folder
  if (project.link !== updated.link) await removeProjectBuild(project.link);
  return ok(serializeProject(updated), 'Project updated successfully');
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  return updateProject(req, (await params).id);
}

// Multipart updates arrive as POST + _method=PUT (Laravel method spoofing).
export async function POST(req: NextRequest, { params }: Ctx) {
  return updateProject(req, (await params).id);
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  const id = Number((await params).id);
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) return fail('Project not found', 404);
  await prisma.project.delete({ where: { id } });
  await removeProjectBuild(project.link);
  return ok(null, 'Project deleted successfully');
}
