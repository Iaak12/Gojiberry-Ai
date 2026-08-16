import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Agent from '@/models/Agent';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const agents = await Agent.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ...agentData } = body;

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const agent = new Agent({
      ...agentData,
      userId: user._id,
    });

    await agent.save();
    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
