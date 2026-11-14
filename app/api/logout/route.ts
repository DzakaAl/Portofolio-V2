import type { NextRequest } from 'next/server';
import { authenticate, revokeToken } from '@/lib/server/auth';
import { ok, fail } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  await revokeToken(req);
  return ok(null, 'Berhasil logout');
}
