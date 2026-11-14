import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail } from '@/lib/server/http';
import { serializeTranslation } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number((await params).id);
  const existing = await prisma.translation.findUnique({ where: { id } });
  if (!existing) return fail('Translation not found', 404);

  const body = await req.json().catch(() => ({}));
  const translatedText =
    typeof body.translated_text === 'string' ? body.translated_text : null;

  const updated = await prisma.translation.update({
    where: { id },
    data: { translatedText, updatedAt: new Date() },
  });
  return ok(serializeTranslation(updated), 'Translation updated successfully');
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number((await params).id);
  const existing = await prisma.translation.findUnique({ where: { id } });
  if (!existing) return fail('Translation not found', 404);

  await prisma.translation.delete({ where: { id } });
  return ok(null, 'Translation deleted successfully');
}
