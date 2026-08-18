import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import ExtensionTask from '@/models/ExtensionTask';

// Handle CORS for the extension
function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Missing email parameter' }, { status: 400, headers: corsHeaders() });
  }

  try {
    await connectToDatabase();
    
    // Find the oldest pending task for this user
    const task = await ExtensionTask.findOne({ userEmail: email, status: 'pending' }).sort({ createdAt: 1 });
    
    return NextResponse.json({ task }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { taskId, status } = await req.json();
    
    if (!taskId || !status) {
      return NextResponse.json({ error: 'Missing taskId or status' }, { status: 400, headers: corsHeaders() });
    }

    await connectToDatabase();
    
    const task = await ExtensionTask.findByIdAndUpdate(taskId, { status }, { returnDocument: 'after' });
    
    return NextResponse.json({ success: true, task }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: corsHeaders() });
  }
}
