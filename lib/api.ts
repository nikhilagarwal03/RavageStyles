import { NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken, JWTPayload } from './auth';
import { NextRequest } from 'next/server';

export const successResponse = <T>(data: T, status = 200) =>
  NextResponse.json({ success: true, data }, { status });

export const errorResponse = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

export const unauthorizedResponse = (message = 'Unauthorized') => errorResponse(message, 401);
export const forbiddenResponse = (message = 'Forbidden') => errorResponse(message, 403);
export const notFoundResponse = (message = 'Not found') => errorResponse(message, 404);

export function requireAuth(req: NextRequest): JWTPayload | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(req: NextRequest): JWTPayload | null {
  const payload = requireAuth(req);
  if (!payload?.isAdmin) return null;
  return payload;
}
