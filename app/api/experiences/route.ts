import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { serializeExperience } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await prisma.experience.findMany({ orderBy: { order: 'asc' } });
  return ok(items.map(serializeExperience));
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const body = await req.json().catch(() => ({}));
  const errors: Record<string, string[]> = {};
  for (const f of ['period', 'role', 'org', 'description']) {
    if (typeof body[f] !== 'string' || !body[f].trim()) errors[f] = [`The ${f} field is required.`];
  }
  if (Object.keys(errors).length) return validationError(errors);

  const item = await prisma.experience.create({
    data: {
      period: body.period,
      role: body.role,
      org: body.org,
      description: body.description,
      order: Number.isInteger(body.order) ? body.order : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return ok(serializeExperience(item), 'Experience created successfully');
}
