import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import { requireAdmin } from '@/lib/api';
import { errorResponse, forbiddenResponse } from '@/lib/api';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const sp = new URL(req.url).searchParams;
    const page = parseInt(sp.get('page') || '1');
    const limit = parseInt(sp.get('limit') || '12');
    const category = sp.get('category');
    const sort = sp.get('sort') || 'createdAt_desc';
    const search = sp.get('search');
    const featured = sp.get('featured');
    const trending = sp.get('trending');
    const query: any = { isActive: true };
    if (category) query.category = category;
    if (featured === 'true') query.isFeatured = true;
    if (search) query.$text = { $search: search };
    if (trending === 'true') {
      const products = await Product.find(query).sort({ trendingScore: -1 }).limit(parseInt(sp.get('limit') || '8')).lean();
      return NextResponse.json({ success: true, data: { products } });
    }
    const sortMap: any = { createdAt_desc: { createdAt: -1 }, createdAt_asc: { createdAt: 1 }, price_asc: { price: 1 }, price_desc: { price: -1 }, trending: { trendingScore: -1 }, rating: { averageRating: -1 } };
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([Product.find(query).sort(sortMap[sort] || sortMap.createdAt_desc).skip(skip).limit(limit).lean(), Product.countDocuments(query)]);
    return NextResponse.json({ success: true, data: { products, pagination: { page, limit, total, pages: Math.ceil(total / limit) } } });
  } catch { return errorResponse('Failed to fetch products', 500); }
}

export async function POST(req: NextRequest) {
  const payload = requireAdmin(req);
  if (!payload) return forbiddenResponse();
  try {
    await connectDB();
    const body = await req.json();
    let slug = body.name?.toLowerCase().replace(/[^\w\s-]/g,'').replace(/[\s_]+/g,'-').replace(/^-+|-+$/g,'');
    if (await Product.findOne({ slug })) slug += '-' + Date.now();
    const product = await Product.create({ ...body, slug });
    return NextResponse.json({ success: true, data: { product } }, { status: 201 });
  } catch (e: any) { return errorResponse(e.message || 'Failed to create product', 500); }
}
