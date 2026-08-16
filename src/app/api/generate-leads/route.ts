import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { generateLeadsForUser } from '@/lib/lead-generator';

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

// Mock pool for development / missing API keys
const LEAD_POOL = [
  { name: 'Sarah Chen', role: 'VP of Sales', company: 'Meridian Analytics', email: 'sarah.chen@meridiananalytics.com', linkedin: 'linkedin.com/in/sarahchen', signal: 'Posted: "Scaling our SDR team from 3 to 12 reps this quarter — any tooling recommendations?"', score: 94, industry: 'Analytics SaaS' },
  { name: 'Raj Patel', role: 'Head of Growth', company: 'Stackline', email: 'raj@stackline.io', linkedin: 'linkedin.com/in/rajpatelgrowth', signal: 'Competitor Outreach.io contract publicly confirmed to be expiring this quarter', score: 91, industry: 'E-commerce Tech' },
  { name: 'Claire Dubois', role: 'Founder & CEO', company: 'Fieldo', email: 'claire@fieldo.com', linkedin: 'linkedin.com/in/clairedubois', signal: 'Just raised €2.4M Seed — job postings show hiring first sales team + outbound engine', score: 89, industry: 'Field Service SaaS' },
  { name: 'Marcus Webb', role: 'Director of Revenue Ops', company: 'Novacore', email: 'marcus.webb@novacore.co', linkedin: 'linkedin.com/in/marcuswebb', signal: 'LinkedIn post: "Manual prospecting is stealing 3 hours from my team daily" — 87 reactions', score: 85, industry: 'HR Tech' },
  { name: 'Priya Sharma', role: 'VP of Sales', company: 'Driftwave', email: 'priya.sharma@driftwave.io', linkedin: 'linkedin.com/in/priyasharma', signal: 'Tweeted: "We are hiring AEs aggressively — need a solid outbound engine ASAP"', score: 92, industry: 'MarTech' },
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * (i + 1) * 2654435761) >>> 0) / 0x100000000 * (i + 1));
    [a[i], a[j % (i + 1)]] = [a[j % (i + 1)], a[i]];
  }
  return a;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { icp, website, clientApiKey } = await req.json().catch(() => ({}));
    
    const geminiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;
    const proxycurlKey = process.env.PROXYCURL_API_KEY;

    let leadsResponse;

    // 1. If keys are missing, fallback to mock data
    if (!proxycurlKey || proxycurlKey === 'your_proxycurl_key_here' || !geminiKey || geminiKey === 'MY_GEMINI_API_KEY') {
      console.warn("API Keys missing. Falling back to mock data.");
      await new Promise(r => setTimeout(r, 1000));
      const seed = Math.floor(Date.now() / 1000);
      leadsResponse = { leads: shuffle(LEAD_POOL, seed).slice(0, 5), source: 'mock' };
    } else {
      // 2. Use the generator service
      leadsResponse = await generateLeadsForUser({
        userEmail: session.user.email,
        icp,
        website,
        geminiKey,
        proxycurlKey
      });
    }

    return NextResponse.json(leadsResponse);
  } catch (err: any) {
    console.error('generate-leads error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
