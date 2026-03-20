import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth, errorResponse, unauthorizedResponse } from '@/lib/api';

const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID!, key_secret: process.env.RAZORPAY_KEY_SECRET! });

export async function POST(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  try {
    await connectDB();
    const { orderId } = await req.json();
    const order = await Order.findOne({ $or: [{ _id: orderId }, { orderId }], user: payload.userId });
    if (!order) return errorResponse('Order not found', 404);
    if (order.paymentStatus === 'paid') return errorResponse('Already paid', 400);
    const rpOrder = await razorpay.orders.create({ amount: Math.round(order.total * 100), currency: 'INR', receipt: order.orderId, notes: { orderId: order.orderId } });
    order.razorpayOrderId = rpOrder.id;
    await order.save();
    return NextResponse.json({ success: true, data: { razorpayOrderId: rpOrder.id, amount: rpOrder.amount, currency: rpOrder.currency, key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID } });
  } catch { return errorResponse('Failed to create payment', 500); }
}
