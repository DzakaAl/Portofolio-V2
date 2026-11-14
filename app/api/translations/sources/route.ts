import type { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { prisma } from '@/lib/db';
import { ok, fail } from '@/lib/server/http';
import { serializeTranslation } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const md5 = (s: string) => createHash('md5').update(s).digest('hex');

// Admin: collect every content text (Abouts, Projects & Experiences) into the translations
// table so the admin can fill in the Indonesian translations.
export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const sources: string[] = [];
  const abouts = await prisma.about.findMany();
  for (const a of abouts) {
    if (a.description?.trim()) sources.push(a.description);
  }
  const projects = await prisma.project.findMany();
  for (const p of projects) {
    if (p.title?.trim()) sources.push(p.title);
    if (p.description?.trim()) sources.push(p.description);
  }

  const experiences = await prisma.experience.findMany();
  for (const e of experiences) {
    for (const v of [e.period, e.role, e.org, e.description]) if (v?.trim()) sources.push(v);
  }

  const certificates = await prisma.certificate.findMany();
  for (const c of certificates) {
    for (const v of [c.title, c.issuer]) if (v?.trim()) sources.push(v);
  }

  const unique = Array.from(new Set(sources));
  let created = 0;
  for (const text of unique) {
    const hash = md5(text);
    const exists = await prisma.translation.findUnique({ where: { sourceHash: hash } });
    if (!exists) {
      await prisma.translation.create({
        data: {
          sourceText: text,
          sourceHash: hash,
          translatedText: null,
          locale: 'id',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      created++;
    }
  }

  // Untranslated first, then oldest first.
  const all = await prisma.translation.findMany({
    orderBy: [{ translatedText: { sort: 'asc', nulls: 'first' } }, { id: 'asc' }],
  });
  return ok(all.map(serializeTranslation), `${created} source text(s) collected`);
}
