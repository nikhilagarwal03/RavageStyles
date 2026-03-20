import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    const sig = req.headers.get('x-razorpay-signature');
    if (!sig) return NextResponse.json({ error: 'No sig' }, { status: 400 });
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!).update(raw).digest('hex');
    if (expected !== sig) return NextResponse.json({ error: 'Invalid sig' }, { status: 400 });
    const event = JSON.parse(raw);
    await connectDB();
    if (event.event === 'payment.captured') {
      const pmt = event.payload.payment.entity;
      const order = await Order.findOne({ razorpayOrderId: pmt.order_id });
      if (order && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid'; order.orderStatus = 'confirmed'; order.razorpayPaymentId = pmt.id;
        order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Webhook capture' });
        await order.save();
      }
    } else if (event.event === 'payment.failed') {
      const pmt = event.payload.payment.entity;
      const order = await Order.findOne({ razorpayOrderId: pmt.order_id });
      if (order) { order.paymentStatus = 'failed'; order.statusHistory.push({ status: 'payment_failed', timestamp: new Date() }); await order.save(); }
    }
    return NextResponse.json({ received: true });
  } catch { return NextResponse.json({ error: 'Webhook error' }, { status: 500 }); }
}
