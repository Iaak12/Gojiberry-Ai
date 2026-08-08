import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Notification from '@/models/Notification';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const notifications = await Notification.find({ userEmail: email }).sort({ createdAt: -1 }).limit(20);

    return NextResponse.json({ notifications });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, notification } = body;
    
    if (!email || !notification) {
      return NextResponse.json({ error: 'Email and notification required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const newNotification = new Notification({
      ...notification,
      userEmail: email,
    });
    await newNotification.save();

    return NextResponse.json({ notification: newNotification });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, markAllRead } = body;
    
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    
    if (markAllRead) {
      await Notification.updateMany({ userEmail: email }, { $set: { unread: false } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
