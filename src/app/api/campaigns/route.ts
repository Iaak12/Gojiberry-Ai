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

export async function PUT(req: NextRequest) {
  try {
    const { campaignId, email } = await req.json();
    if (!campaignId || !email) return NextResponse.json({ error: 'campaignId and email required' }, { status: 400 });

    await connectToDatabase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const campaign = await Campaign.findOne({ _id: campaignId, userId: user._id });
    if (!campaign) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });

    // Fetch leads for the user that match campaign criteria
    const leads = await Lead.find({ userId: user._id, status: 'New' });

    let sentCount = 0;
    for (const lead of leads) {
      // Mock generating email content
      const emailContent = `<p>Hi ${lead.name},</p><p>We saw your profile at ${lead.linkedInUrl} and we think you'd be a great fit for...</p>`;
      
      const res = await sendEmail({
        to: user.email, // In reality, this would be lead.email, but we use user.email to avoid spamming real people during dev
        subject: `Reaching out to ${lead.name}`,
        html: emailContent,
      });

      if (!res.error) {
        sentCount++;
        lead.status = 'Contacted';
        await lead.save();
      }
    }

    campaign.status = 'Active';
    await campaign.save();

    return NextResponse.json({ success: true, sentCount }, { status: 200 });
  } catch (error) {
    console.error('Error executing campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
