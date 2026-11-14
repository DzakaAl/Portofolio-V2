import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { serializeTechStack } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const stacks = await prisma.techStack.findMany({ orderBy: { order: 'asc' } });
  return ok(stacks.map(serializeTechStack));
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const body = await req.json().catch(() => ({}));
  const errors: Record<string, string[]> = {};
  if (typeof body.title !== 'string' || !body.title.trim())
    errors.title = ['The title field is required.'];
  if (typeof body.alt !== 'string' || !body.alt.trim())
    errors.alt = ['The alt field is required.'];
  if (typeof body.src !== 'string' || !body.src.trim())
    errors.src = ['The src field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  const stack = await prisma.techStack.create({
    data: {
      title: body.title,
      alt: body.alt,
      src: body.src,
      order: Number.isInteger(body.order) ? body.order : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return ok(serializeTechStack(stack), 'Tech stack created successfully');
}
