import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { ok, fail } from '@/lib/server/http';
import { serializeExperience } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number((await params).id);
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) return fail('Experience not found', 404);

  const body = await req.json().catch(() => ({}));
  const data: Prisma.ExperienceUpdateInput = { updatedAt: new Date() };
  for (const f of ['period', 'role', 'org', 'description'] as const) {
    if (typeof body[f] === 'string') data[f] = body[f];
  }
  if (body.order !== undefined && body.order !== null) data.order = Number(body.order);

  const updated = await prisma.experience.update({ where: { id }, data });
  return ok(serializeExperience(updated), 'Experience updated successfully');
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  const id = Number((await params).id);
  const existing = await prisma.experience.findUnique({ where: { id } });
  if (!existing) return fail('Experience not found', 404);
  await prisma.experience.delete({ where: { id } });
  return ok(null, 'Experience deleted successfully');
}
