import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { trackProductPurchase } from '@/models/Analytics';
import { requireAuth, errorResponse, unauthorizedResponse } from '@/lib/api';

export async function POST(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  try {
    await connectDB();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(razorpay_order_id + '|' + razorpay_payment_id).digest('hex');
    if (expected !== razorpay_signature) return errorResponse('Invalid signature', 400);
    const order = await Order.findOne({ $or: [{ _id: orderId }, { orderId }], user: payload.userId, razorpayOrderId: razorpay_order_id });
    if (!order) return errorResponse('Order not found', 404);
    order.paymentStatus = 'paid'; order.orderStatus = 'confirmed';
    order.razorpayPaymentId = razorpay_payment_id; order.razorpaySignature = razorpay_signature;
    order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment verified: ' + razorpay_payment_id });
    await order.save();
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { [`sizes.$[el].stock`]: -item.quantity, totalStock: -item.quantity, purchaseCount: item.quantity } }, { arrayFilters: [{ 'el.size': item.size }] });
      trackProductPurchase(item.product.toString(), item.quantity, item.price * item.quantity).catch(console.error);
    }
    return NextResponse.json({ success: true, message: 'Payment verified', data: { order } });
  } catch { return errorResponse('Verification failed', 500); }
}
