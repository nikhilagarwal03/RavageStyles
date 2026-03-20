import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JWTPayload { userId: string; email: string; isAdmin: boolean; }

export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as any });
}

export function verifyToken(token: string): JWTPayload | null {
  try { return jwt.verify(token, JWT_SECRET as string) as JWTPayload; } catch { return null; }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.substring(7);
  return req.cookies.get('auth-token')?.value || null;
}
