import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { signToken } from '@/lib/auth';
import { errorResponse } from '@/lib/api';
import { z } from 'zod';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const v = schema.safeParse(body);
    if (!v.success) return errorResponse(v.error.errors[0].message);
    const { email, password } = v.data;

    // Check for missing environment variables
    if (!process.env.JWT_SECRET) {
      console.error("Missing JWT_SECRET in environment variables");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    try {
      const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
      if (!user || !(await user.comparePassword(password))) return errorResponse('Invalid email or password', 401);
      const token = signToken({ userId: user._id.toString(), email: user.email, isAdmin: user.isAdmin });
      const res = NextResponse.json({ success: true, data: { user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token } });
      res.cookies.set('auth-token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 604800, path: '/' });
      return res;
    } catch (innerError: any) {
      console.error("Detailed Login Error:", innerError.message);
      return NextResponse.json({ error: innerError.message }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Detailed Login Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
