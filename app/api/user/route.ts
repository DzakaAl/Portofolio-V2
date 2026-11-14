import { NextResponse, type NextRequest } from 'next/server';
import { authenticate } from '@/lib/server/auth';
import { fail } from '@/lib/server/http';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return fail('Unauthenticated.', 401);
  return NextResponse.json({ status: 'success', user });
}
