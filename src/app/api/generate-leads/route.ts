import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { searchLinkedInProfiles } from '@/lib/proxycurl';
import { scoreAndEnrichLeads } from '@/lib/lead-scorer';
import connectToDatabase from '@/lib/mongodb';
import Lead from '@/models/Lead';

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'];

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

    let scoredLeads: any[] = [];
    let source = 'live';

    // 1. If keys are missing, fallback to mock data
    if (!proxycurlKey || proxycurlKey === 'your_proxycurl_key_here' || !geminiKey || geminiKey === 'MY_GEMINI_API_KEY') {
      console.warn("API Keys missing. Falling back to mock data.");
      await new Promise(r => setTimeout(r, 1000));
      const seed = Math.floor(Date.now() / 1000);
      scoredLeads = shuffle(LEAD_POOL, seed).slice(0, 5);
      source = 'mock';
    } else {
      // 2. Fetch raw profiles from Proxycurl
      const targetRoles = icp?.targetRoles || [];
      const targetIndustries = icp?.targetIndustries || [];
      
      const rawProfiles = await searchLinkedInProfiles(proxycurlKey, targetRoles, targetIndustries, 8);
      
      if (!rawProfiles || rawProfiles.length === 0) {
        return NextResponse.json({ leads: [], source: 'proxycurl', message: 'No profiles found matching ICP.' });
      }

      // 3. Score and enrich using Gemini
      scoredLeads = await scoreAndEnrichLeads(geminiKey, rawProfiles, icp, website);

      if (!scoredLeads || scoredLeads.length === 0) {
        return NextResponse.json({ leads: [], source: 'gemini', message: 'No profiles met the minimum score threshold.' });
      }
    }

    // 4. Save to Database
    await connectToDatabase();
    
    const enrichedLeads = scoredLeads.map((lead: any, index: number) => ({
      userEmail: session.user?.email,
      name: lead.name || 'Unknown',
      role: lead.role || 'Unknown Role',
      company: lead.company || 'Unknown Company',
      initials: (lead.name || 'Un Known').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
      color: COLORS[index % COLORS.length],
      score: lead.score || 70,
      status: 'pending',
      signal: lead.signal || 'Matches ICP profile',
      time: 'Just now',
      email: lead.email || `${lead.name?.split(' ')[0]}@${lead.company?.replace(/\\s/g, '').toLowerCase()}.com`,
      linkedin: lead.linkedin || '',
      industry: lead.industry || 'Unknown',
      listId: 'default',
      fitStatus: 'unrated'
    }));

    // Insert into DB
    let insertedLeads = enrichedLeads;
    try {
      insertedLeads = await Lead.insertMany(enrichedLeads);
    } catch (e) {
      console.error("Failed to insert leads to MongoDB:", e);
      // Fallback: return them anyway even if DB save fails
    }

    return NextResponse.json({ leads: insertedLeads, source });
  } catch (err: any) {
    console.error('generate-leads error:', err);
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}
