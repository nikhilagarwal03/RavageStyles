import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { requireAuth, errorResponse, unauthorizedResponse } from '@/lib/api';
import { generateOrderId } from '@/lib/utils';

export async function GET(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  await connectDB();
  const page = parseInt(new URL(req.url).searchParams.get('page') || '1');
  const limit = 10;
  const query = payload.isAdmin ? {} : { user: payload.userId };
  const [orders, total] = await Promise.all([Order.find(query).populate('user','name email').sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean(), Order.countDocuments(query)]);
  return NextResponse.json({ success: true, data: { orders, pagination: { page, limit, total, pages: Math.ceil(total/limit) } } });
}

export async function POST(req: NextRequest) {
  const payload = requireAuth(req);
  if (!payload) return unauthorizedResponse();
  try {
    await connectDB();
    const { items, shippingAddress } = await req.json();
    if (!items?.length || !shippingAddress) return errorResponse('Invalid order data');
    const orderItems = [];
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || !product.isActive) return errorResponse('Product unavailable: ' + item.product, 400);
      const sizeObj = product.sizes.find(s => s.size === item.size);
      if (!sizeObj || sizeObj.stock < item.quantity) return errorResponse('Insufficient stock for ' + product.name + ' - ' + item.size, 400);
      orderItems.push({ product: product._id, name: product.name, image: product.images[0], price: product.price, size: item.size, quantity: item.quantity });
      subtotal += product.price * item.quantity;
    }
    const shippingFee = subtotal >= 999 ? 0 : 99;
    const order = await Order.create({ orderId: generateOrderId(), user: payload.userId, items: orderItems, shippingAddress, subtotal, shippingFee, discount: 0, total: subtotal + shippingFee, statusHistory: [{ status: 'pending', timestamp: new Date() }] });
    return NextResponse.json({ success: true, data: { order } }, { status: 201 });
  } catch (e: any) { return errorResponse(e.message || 'Failed to create order', 500); }
}
