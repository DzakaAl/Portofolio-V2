import { createHash, randomBytes } from 'crypto';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';

export type AuthUser = { id: number; name: string; email: string };

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

/** Issue a new plaintext bearer token for a user; stores only its sha256 hash. */
export async function issueToken(userId: number, name = 'admin-token'): Promise<string> {
  const plain = randomBytes(40).toString('hex'); // 80 hex chars
  await prisma.accessToken.create({
    data: { userId, name, token: sha256(plain), createdAt: new Date() },
  });
  return plain;
}

function bearer(req: NextRequest): string | null {
  const header = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : null;
}

/** Resolve the authenticated admin user from the request, or null. */
export async function authenticate(req: NextRequest): Promise<AuthUser | null> {
  const plain = bearer(req);
  if (!plain) return null;
  const record = await prisma.accessToken.findUnique({
    where: { token: sha256(plain) },
    include: { user: true },
  });
  if (!record) return null;
  // best-effort last-used stamp
  prisma.accessToken
    .update({ where: { id: record.id }, data: { lastUsedAt: new Date() } })
    .catch(() => {});
  return { id: record.user.id, name: record.user.name, email: record.user.email };
}

/** Revoke the token presented on this request (logout). */
export async function revokeToken(req: NextRequest): Promise<void> {
  const plain = bearer(req);
  if (!plain) return;
  await prisma.accessToken.deleteMany({ where: { token: sha256(plain) } });
}

export { sha256 };
