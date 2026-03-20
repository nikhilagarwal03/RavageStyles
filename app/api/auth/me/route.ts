import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth } from '@/lib/api';
import { errorResponse, unauthorizedResponse } from '@/lib/api';

export async function GET(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  await connectDB();
  const user = await User.findById(payload.userId).populate('wishlist', 'name images price slug');
  if (!user) return unauthorizedResponse('User not found');
  return NextResponse.json({ success: true, data: { user } });
}

export async function PATCH(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  await connectDB();
  const { name, phone } = await req.json();
  const user = await User.findByIdAndUpdate(payload.userId, { $set: { name, phone } }, { new: true, runValidators: true });
  if (!user) return errorResponse('User not found', 404);
  return NextResponse.json({ success: true, data: { user } });
}
