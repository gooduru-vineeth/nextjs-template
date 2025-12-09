import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key-change-in-production',
);

export async function isAuthenticated(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth-token');

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(token.value, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
