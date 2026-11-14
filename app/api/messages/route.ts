import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { ok, validationError } from '@/lib/server/http';
import { serializeMessage } from '@/lib/server/serialize';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const messages = await prisma.message.findMany({ orderBy: { id: 'asc' } });
  return ok(messages.map(serializeMessage));
}

function hhmm(): string {
  return new Date().toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const user = typeof body.user === 'string' ? body.user.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const text = typeof body.text === 'string' ? body.text : '';
  const avatar = typeof body.avatar === 'string' && body.avatar ? body.avatar : null;

  const errors: Record<string, string[]> = {};
  if (!user) errors.user = ['The user field is required.'];
  if (!email) errors.email = ['The email field is required.'];
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = ['The email must be a valid email address.'];
  if (!text.trim()) errors.text = ['The text field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  // Keep a visitor's older messages in sync with their latest avatar/name.
  if (avatar) {
    await prisma.message.updateMany({ where: { email }, data: { avatar, user } });
  }

  const message = await prisma.message.create({
    data: {
      user,
      email,
      avatar,
      text,
      time: typeof body.time === 'string' && body.time ? body.time : hhmm(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  return ok(serializeMessage(message));
}
