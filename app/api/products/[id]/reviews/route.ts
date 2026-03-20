import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';
import Order from '@/models/Order';
import { requireAuth, errorResponse, unauthorizedResponse } from '@/lib/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const page = parseInt(new URL(req.url).searchParams.get('page') || '1');
    const limit = 10;
    const [reviews, total] = await Promise.all([
      Review.find({ product: params.id }).populate('user','name').sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean(),
      Review.countDocuments({ product: params.id }),
    ]);
    const dist = await Review.aggregate([{ $match: { product: params.id } }, { $group: { _id: '$rating', count: { $sum: 1 } } }]);
    const ratingDistribution: Record<number,number> = { 1:0,2:0,3:0,4:0,5:0 };
    dist.forEach(d => { ratingDistribution[d._id] = d.count; });
    return NextResponse.json({ success: true, data: { reviews, total, ratingDistribution, pages: Math.ceil(total/limit) } });
  } catch { return errorResponse('Failed to fetch reviews', 500); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = requireAuth(req);
  if (!user) return unauthorizedResponse();
  try {
    await connectDB();
    const { rating, title, comment } = await req.json();
    if (!rating || !title || !comment) return errorResponse('All fields required');
    const order = await Order.findOne({ user: user.userId, 'items.product': params.id, paymentStatus: 'paid' });
    const existing = await Review.findOne({ user: user.userId, product: params.id });
    if (existing) return errorResponse('Already reviewed', 409);
    const review = await Review.create({ user: user.userId, product: params.id, rating, title, comment, isVerifiedPurchase: !!order });
    await review.populate('user','name');
    return NextResponse.json({ success: true, data: { review } }, { status: 201 });
  } catch (e: any) {
    if (e.code === 11000) return errorResponse('Already reviewed', 409);
    return errorResponse('Failed to submit review', 500);
  }
}
