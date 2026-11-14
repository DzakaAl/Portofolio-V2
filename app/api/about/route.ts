import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { serializeAbout } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const about = await prisma.about.findFirst({ orderBy: { id: 'asc' } });
  return ok(serializeAbout(about));
}

export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const body = await req.json().catch(() => ({}));
  const description = typeof body.description === 'string' ? body.description : '';
  if (!description.trim()) {
    return validationError({ description: ['The description field is required.'] });
  }
  const imageUrl =
    body.image_url === undefined ? undefined : (body.image_url as string | null);

  const existing = await prisma.about.findFirst({ orderBy: { id: 'asc' } });
  const now = new Date();
  const about = existing
    ? await prisma.about.update({
        where: { id: existing.id },
        data: {
          description,
          ...(imageUrl === undefined ? {} : { imageUrl }),
          updatedAt: now,
        },
      })
    : await prisma.about.create({
        data: { description, imageUrl: imageUrl ?? null, createdAt: now, updatedAt: now },
      });

  return ok(serializeAbout(about), 'About Me updated successfully');
}
