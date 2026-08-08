import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    let user = await User.findOne({ email });

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
    const { email, ...updateData } = body;
    
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    
    const user = await User.findOneAndUpdate(
      { email },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
