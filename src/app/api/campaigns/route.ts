import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Campaign from '@/models/Campaign';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

  try {
    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const campaigns = await Campaign.find({ userId: user._id }).sort({ createdAt: -1 });
    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, ...campaignData } = body;

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const campaign = new Campaign({
      ...campaignData,
      userId: user._id,
    });

    await campaign.save();
    return NextResponse.json({ campaign }, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { sendEmail } from '@/lib/resend';
import Lead from '@/models/Lead';
import { inngest } from '@/inngest/client';

export async function PUT(req: NextRequest) {
  try {
    const { campaignId, email, leadId } = await req.json();
    if (!campaignId || !email || !leadId) return NextResponse.json({ error: 'campaignId, email, and leadId required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const campaign = await Campaign.findOne({ _id: campaignId, userId: user._id });
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    const lead = await Lead.findOne({ _id: leadId });
    if (!lead) return NextResponse.json({ error: 'Lead not found' }, { status: 404 });

    // Send event to Inngest
    await inngest.send({
      name: "campaign/step.execute",
      data: {
        campaignId: campaign._id.toString(),
        leadId: lead._id.toString(),
        stepIndex: 0
      },
    });

    campaign.status = 'active';
    await campaign.save();

    return NextResponse.json({ success: true, message: 'Added to sequence' }, { status: 200 });
  } catch (error) {
    console.error('Error executing campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
