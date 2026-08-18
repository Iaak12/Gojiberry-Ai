import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateLeadsForUser } from '@/lib/lead-generator';
import { checkRateLimit } from '@/lib/ratelimit';

export interface Lead {
  id?: any;
  _id?: any;
  name: string;
  role: string;
  company: string;
  email: string;
  linkedin: string;
  signal: string;
  score: number;
  industry: string;
  status: string;
  initials?: string;
  color?: string;
  time?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const email = session.user.email;
    const rl = await checkRateLimit(email);
    if (!rl.success) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please upgrade to Pro for more leads.' }, { status: 429 });
    }

    const { icp, website, clientApiKey } = await req.json().catch(() => ({}));
    
    const geminiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;
    const apifyToken = process.env.APIFY_API_TOKEN;

    if (!apifyToken || !geminiKey || geminiKey === 'MY_GEMINI_API_KEY') {
      return NextResponse.json({ error: 'API Keys missing. Please configure Gemini and Apify tokens.' }, { status: 400 });
    }

    const leadsResponse = await generateLeadsForUser({
      userEmail: session.user.email,
      icp,
      website,
      geminiKey,
      apifyToken
    });

    if (!leadsResponse || !leadsResponse.leads || leadsResponse.leads.length === 0) {
       return NextResponse.json({ error: 'No profiles found matching ICP. Try broadening your criteria.' }, { status: 404 });
    }

    return NextResponse.json(leadsResponse);
  } catch (err: any) {
    console.error('generate-leads error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
