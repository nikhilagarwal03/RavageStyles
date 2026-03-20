import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { errorResponse } from '@/lib/api';
import { z } from 'zod';

const schema = z.object({ name: z.string().min(2).max(50), email: z.string().email(), password: z.string().min(8) });

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const v = schema.safeParse(body);
    if (!v.success) return errorResponse(v.error.errors[0].message);
    const { name, email, password } = v.data;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return errorResponse('Email already registered', 409);
    const isFirst = (await User.countDocuments()) === 0;
    const user = await User.create({ name, email: email.toLowerCase(), password, isAdmin: isFirst });
    const token = signToken({ userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin });
    const res = NextResponse.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token } });
    res.cookies.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 604800, path: '/' });
    return res;
  } catch (e: any) {
    if (e.code === 11000) return errorResponse('Email already exists', 409);
    return errorResponse('Failed to create account', 500);
  }
}
