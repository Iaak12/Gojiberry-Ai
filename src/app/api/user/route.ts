import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email: email.toLowerCase() }).select('-password');

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, ...updateData } = body;
    
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const normalizedEmail = email.toLowerCase();

    await connectToDatabase();
    
    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: updateData },
      { returnDocument: 'after', upsert: true }
    ).select('-password');

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
