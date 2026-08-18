import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Thread from '@/models/Thread';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const threads = await Thread.find({ userEmail: email });
    
    // Convert array of threads to the Record<string, string[]> format the frontend expects
    const threadsMap: Record<string, string[]> = {};
    threads.forEach(t => {
      threadsMap[t.leadId.toString()] = t.messages;
    });

    return NextResponse.json({ threads: threadsMap });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, leadId, message } = body;
    
    if (!email || !leadId || !message) {
      return NextResponse.json({ error: 'Email, leadId, and message required' }, { status: 400 });
    }

    await connectToDatabase();
    
    const thread = await Thread.findOneAndUpdate(
      { userEmail: email, leadId: new mongoose.Types.ObjectId(leadId) },
      { $push: { messages: message } },
      { returnDocument: 'after', upsert: true }
    );

    return NextResponse.json({ thread });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
