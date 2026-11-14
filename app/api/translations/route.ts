import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { serializeTranslation } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const md5 = (s: string) => createHash('md5').update(s).digest('hex');

// Public: EN -> ID map of entries that already have a translation.
export async function GET() {
  const rows = await prisma.translation.findMany({
    where: { locale: 'id', translatedText: { not: null } },
  });
  const map: Record<string, string> = {};
  for (const r of rows) {
    if (r.translatedText != null) map[r.sourceText] = r.translatedText;
  }
  return ok(map);
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const body = await req.json().catch(() => ({}));
  const sourceText = typeof body.source_text === 'string' ? body.source_text : '';
  if (!sourceText) {
    return validationError({ source_text: ['The source text field is required.'] });
  }
  const translatedText =
    typeof body.translated_text === 'string' ? body.translated_text : null;
  const locale = typeof body.locale === 'string' ? body.locale : 'id';
  const hash = md5(sourceText);

  const translation = await prisma.translation.upsert({
    where: { sourceHash: hash },
    update: { sourceText, translatedText, locale, updatedAt: new Date() },
    create: {
      sourceText,
      sourceHash: hash,
      translatedText,
      locale,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return ok(serializeTranslation(translation), 'Translation saved successfully');
}
