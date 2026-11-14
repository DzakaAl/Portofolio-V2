import { NextResponse, type NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';
import { validationError } from '@/lib/server/http';
import { issueToken } from '@/lib/server/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const errors: Record<string, string[]> = {};
  if (!email) errors.email = ['The email field is required.'];
  if (!password) errors.password = ['The password field is required.'];
  if (Object.keys(errors).length) return validationError(errors);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return validationError({
      email: ['Kredensial email atau password yang dimasukkan salah.'],
    });
  }

  const token = await issueToken(user.id);
  // Login has a custom response shape ({ status, token, user }), matching AuthController@login.
  return NextResponse.json({
    status: 'success',
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
}
