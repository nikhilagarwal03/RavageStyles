import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { requireAuth, requireAdmin, errorResponse, forbiddenResponse, notFoundResponse, unauthorizedResponse } from '@/lib/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  await connectDB();
  const order = await Order.findOne({ $or: [{ _id: params.id }, { orderId: params.id }] }).populate('user','name email');
  if (!order) return notFoundResponse('Order not found');
  if (!payload.isAdmin && order.user._id.toString() !== payload.userId) return forbiddenResponse();
  return NextResponse.json({ success: true, data: { order } });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(req);
  if (!payload) return forbiddenResponse();
  await connectDB();
  const { orderStatus, trackingNumber, note } = await req.json();
  const order = await Order.findById(params.id);
  if (!order) return notFoundResponse();
  if (orderStatus) { order.orderStatus = orderStatus; order.statusHistory.push({ status: orderStatus, timestamp: new Date(), note }); }
  if (trackingNumber) order.trackingNumber = trackingNumber;
  await order.save();
  return NextResponse.json({ success: true, data: { order } });
}
