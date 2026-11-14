import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { serializeCertificate } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';
import { readProjectInput } from '@/lib/server/project-input';
import { saveCertImage } from '@/lib/server/upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await prisma.certificate.findMany({ orderBy: { order: 'asc' } });
  return ok(items.map(serializeCertificate));
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const input = await readProjectInput(req);
  const title = typeof input.raw.title === 'string' ? input.raw.title : '';
  const issuer = typeof input.raw.issuer === 'string' ? input.raw.issuer : '';
  const year = typeof input.raw.year === 'string' ? input.raw.year : '';

  const errors: Record<string, string[]> = {};
  if (!title.trim()) errors.title = ['The title field is required.'];
  if (!issuer.trim()) errors.issuer = ['The issuer field is required.'];
  if (!year.trim()) errors.year = ['The year field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  let image = typeof input.raw.image === 'string' ? input.raw.image : '';
  if (input.imageFile) {
    try {
      image = await saveCertImage(input.imageFile);
    } catch (e) {
      return validationError({ image_file: [(e as Error).message] });
    }
  }
  if (!image) return validationError({ image: ['The image field is required.'] });

  const item = await prisma.certificate.create({
    data: {
      title,
      issuer,
      year,
      image,
      link: typeof input.raw.link === 'string' ? input.raw.link : null,
      order: input.raw.order != null ? Number(input.raw.order) : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return ok(serializeCertificate(item), 'Certificate created successfully');
}
