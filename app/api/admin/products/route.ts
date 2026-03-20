import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin, errorResponse, forbiddenResponse } from '@/lib/api';

export async function GET(req: NextRequest) {
  const p = requireAdmin(req);
  if (!p) return forbiddenResponse();
  await connectDB();
  const sp = new URL(req.url).searchParams;
  const page = parseInt(sp.get('page') || '1'), limit = parseInt(sp.get('limit') || '10');
  const search = sp.get('search');
  const query: any = {};
  if (search) query.$text = { $search: search };
  const [products, total] = await Promise.all([Product.find(query).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit).lean(), Product.countDocuments(query)]);
  return NextResponse.json({ success: true, data: { products, pagination: { page, limit, total, pages: Math.ceil(total/limit) } } });
}
