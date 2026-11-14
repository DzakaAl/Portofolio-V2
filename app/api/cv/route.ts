import type { NextRequest } from 'next/server';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import { ok, fail } from '@/lib/server/http';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Admin only: the CV holds phone/email etc. that isn't meant for the public API.
export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  const cv = await prisma.cv.findFirst({ orderBy: { id: 'asc' } });
  return ok(cv?.data ?? null);
}

export async function PUT(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object' || typeof body.name !== 'string') {
    return fail('Data CV tidak valid.', 422);
  }
  const data = body as Prisma.InputJsonValue;
  const existing = await prisma.cv.findFirst({ orderBy: { id: 'asc' } });
  const cv = existing
    ? await prisma.cv.update({ where: { id: existing.id }, data: { data, updatedAt: new Date() } })
    : await prisma.cv.create({ data: { data, updatedAt: new Date() } });
  return ok(cv.data, 'CV berhasil disimpan');
}
