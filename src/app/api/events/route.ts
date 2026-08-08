import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Event from '@/models/Event';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const events = await Event.find({ userEmail: email }).sort({ date: 1, time: 1 });

    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, event } = body;
    
    if (!email || !event) {
      return NextResponse.json({ error: 'Email and event required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const newEvent = new Event({
      ...event,
      userEmail: email,
      prospectId: event.prospectId ? new mongoose.Types.ObjectId(event.prospectId) : undefined
    });
    await newEvent.save();

    return NextResponse.json({ event: newEvent });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
