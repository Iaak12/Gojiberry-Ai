import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get('email');
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const leads = await Lead.find({ userEmail: email }).sort({ score: -1 });

    return NextResponse.json({ leads });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, leads } = body;
    
    if (!email || !leads || !Array.isArray(leads)) {
      return NextResponse.json({ error: 'Email and leads array required' }, { status: 400 });
    }

    await connectToDatabase();
    
    // Optional: Clear existing leads for this user before saving new ones, 
    // or just append them. We'll delete old ones to keep the demo clean.
    await Lead.deleteMany({ userEmail: email });
    
    const leadsWithEmail = leads.map(lead => ({ ...lead, userEmail: email }));
    const inserted = await Lead.insertMany(leadsWithEmail);

    return NextResponse.json({ leads: inserted });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, status } = body;
    
    if (!leadId || !status) {
      return NextResponse.json({ error: 'Lead ID and status required' }, { status: 400 });
    }

    await connectToDatabase();
    const lead = await Lead.findByIdAndUpdate(
      leadId,
      { $set: { status } },
      { returnDocument: 'after' }
    );

    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    return NextResponse.json({ lead });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
