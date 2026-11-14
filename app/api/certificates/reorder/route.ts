import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, fail, validationError } from '@/lib/server/http';
import { authenticate } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  const body = await req.json().catch(() => ({}));
  const orders = body.orders;
  if (!Array.isArray(orders)) return validationError({ orders: ['The orders field is required.'] });
  await prisma.$transaction(
    orders
      .filter((o) => o && o.id != null && o.order != null)
      .map((o) => prisma.certificate.update({ where: { id: Number(o.id) }, data: { order: Number(o.order) } })),
  );
  return ok(null, 'Certificates reordered successfully');
}
