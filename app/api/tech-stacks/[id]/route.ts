import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail } from '@/lib/server/http';
import { serializeTechStack } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number((await params).id);
  const stack = await prisma.techStack.findUnique({ where: { id } });
  if (!stack) return fail('Tech stack not found', 404);

  const body = await req.json().catch(() => ({}));
  const data: Record<string, unknown> = { updatedAt: new Date() };
  if (typeof body.title === 'string') data.title = body.title;
  if (typeof body.alt === 'string') data.alt = body.alt;
  if (typeof body.src === 'string') data.src = body.src;
  if (body.order !== undefined && body.order !== null) data.order = Number(body.order);

  const updated = await prisma.techStack.update({ where: { id }, data });
  return ok(serializeTechStack(updated), 'Tech stack updated successfully');
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number((await params).id);
  const stack = await prisma.techStack.findUnique({ where: { id } });
  if (!stack) return fail('Tech stack not found', 404);

  await prisma.techStack.delete({ where: { id } });
  return ok(null, 'Tech stack deleted successfully');
}
