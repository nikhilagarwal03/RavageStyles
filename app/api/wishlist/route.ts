import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { requireAuth, errorResponse, unauthorizedResponse } from '@/lib/api';

export async function GET(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  await connectDB();
  const user = await User.findById(payload.userId).populate('wishlist','name images price slug category averageRating totalStock sizes').lean();
  return NextResponse.json({ success: true, data: { wishlist: user?.wishlist || [] } });
}

export async function POST(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  await connectDB();
  const { productId } = await req.json();
  const user = await User.findById(payload.userId);
  if (!user) return errorResponse('User not found', 404);
  const inList = user.wishlist.some((id: any) => id.toString() === productId);
  if (inList) user.wishlist = user.wishlist.filter((id: any) => id.toString() !== productId);
  else user.wishlist.push(productId);
  await user.save();
  return NextResponse.json({ success: true, data: { added: !inList, wishlist: user.wishlist } });
}
