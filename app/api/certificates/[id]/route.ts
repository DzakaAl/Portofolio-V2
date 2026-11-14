import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { serializeCertificate } from '@/lib/server/serialize';
import { authenticate } from '@/lib/server/auth';
import { readProjectInput } from '@/lib/server/project-input';
import { saveCertImage } from '@/lib/server/upload';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

async function updateCertificate(req: NextRequest, idStr: string) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);

  const id = Number(idStr);
  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing) return fail('Certificate not found', 404);

  const input = await readProjectInput(req);
  const data: Prisma.CertificateUpdateInput = { updatedAt: new Date() };
  for (const f of ['title', 'issuer', 'year'] as const) {
    if (input.has(f)) {
      const v = String(input.raw[f] ?? '');
      if (!v.trim()) return validationError({ [f]: [`The ${f} field is required.`] });
      data[f] = v;
    }
  }
  if (input.has('link')) data.link = (input.raw.link as string) || null;
  if (input.has('order')) data.order = Number(input.raw.order);

  if (input.imageFile) {
    try {
      data.image = await saveCertImage(input.imageFile);
    } catch (e) {
      return validationError({ image_file: [(e as Error).message] });
    }
  } else if (input.has('image') && String(input.raw.image ?? '').trim()) {
    data.image = String(input.raw.image);
  }

  const updated = await prisma.certificate.update({ where: { id }, data });
  return ok(serializeCertificate(updated), 'Certificate updated successfully');
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  return updateCertificate(req, (await params).id);
}
export async function POST(req: NextRequest, { params }: Ctx) {
  return updateCertificate(req, (await params).id);
}
export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  const id = Number((await params).id);
  const existing = await prisma.certificate.findUnique({ where: { id } });
  if (!existing) return fail('Certificate not found', 404);
  await prisma.certificate.delete({ where: { id } });
  return ok(null, 'Certificate deleted successfully');
}
