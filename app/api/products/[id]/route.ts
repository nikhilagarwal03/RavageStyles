import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { trackProductView } from '@/models/Analytics';
import { requireAdmin, errorResponse, forbiddenResponse, notFoundResponse } from '@/lib/api';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const product = await Product.findOne({ $or: [...(isObjectId ? [{ _id: id }] : []), { slug: id }], isActive: true }).lean();
    if (!product) return notFoundResponse('Product not found');
    trackProductView((product as any)._id.toString()).catch(console.error);
    return NextResponse.json({ success: true, data: { product } });
  } catch { return errorResponse('Failed to fetch product', 500); }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const p = requireAdmin(req);
  if (!p) return forbiddenResponse();
  try {
    await connectDB();
    const body = await req.json();
    const product = await Product.findByIdAndUpdate(params.id, { $set: body }, { new: true, runValidators: true });
    if (!product) return notFoundResponse('Product not found');
    return NextResponse.json({ success: true, data: { product } });
  } catch { return errorResponse('Failed to update', 500); }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const p = requireAdmin(req);
  if (!p) return forbiddenResponse();
  try {
    await connectDB();
    const product = await Product.findByIdAndUpdate(params.id, { isActive: false }, { new: true });
    if (!product) return notFoundResponse();
    return NextResponse.json({ success: true, message: 'Product archived' });
  } catch { return errorResponse('Failed to delete', 500); }
}
