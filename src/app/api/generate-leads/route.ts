import { NextRequest, NextResponse } from 'next/server';

export interface Lead {
  id: number;
  name: string;
  role: string;
  company: string;
  initials: string;
  color: string;
  score: number;
  status: 'pending' | 'contacted' | 'replied' | 'booked';
  signal: string;
  time: string;
  email: string;
  linkedin: string;
  industry: string;
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899', '#84CC16', '#F97316', '#6366F1'];

// Large pool of 30 realistic prospects to randomize from
const LEAD_POOL: Omit<Lead, 'id' | 'initials' | 'color' | 'status' | 'time'>[] = [
  { name: 'Sarah Chen',       role: 'VP of Sales',              company: 'Meridian Analytics',  email: 'sarah.chen@meridiananalytics.com',   linkedin: 'linkedin.com/in/sarahchen',       signal: 'Posted: "Scaling our SDR team from 3 to 12 reps this quarter — any tooling recommendations?"',    score: 94, industry: 'Analytics SaaS' },
  { name: 'Raj Patel',        role: 'Head of Growth',           company: 'Stackline',            email: 'raj@stackline.io',                    linkedin: 'linkedin.com/in/rajpatelgrowth',  signal: 'Competitor Outreach.io contract publicly confirmed to be expiring this quarter',                   score: 91, industry: 'E-commerce Tech' },
  { name: 'Claire Dubois',    role: 'Founder & CEO',            company: 'Fieldo',               email: 'claire@fieldo.com',                   linkedin: 'linkedin.com/in/clairedubois',    signal: 'Just raised €2.4M Seed — job postings show hiring first sales team + outbound engine',             score: 89, industry: 'Field Service SaaS' },
  { name: 'Marcus Webb',      role: 'Director of Revenue Ops',  company: 'Novacore',             email: 'marcus.webb@novacore.co',             linkedin: 'linkedin.com/in/marcuswebb',      signal: 'LinkedIn post: "Manual prospecting is stealing 3 hours from my team daily" — 87 reactions',        score: 85, industry: 'HR Tech' },
  { name: 'Fatima Al-Rashid', role: 'Sales Operations Manager', company: 'Brightpath',           email: 'fatima@brightpath.ai',                linkedin: 'linkedin.com/in/fatimaalrashid', signal: 'Actively hiring 2 SDRs with job description explicitly mentioning building outbound from scratch',  score: 81, industry: 'AI Compliance' },
  { name: 'Tom Eriksen',      role: 'Co-Founder',               company: 'Loopflow',             email: 'tom@loopflow.io',                     linkedin: 'linkedin.com/in/tomeriksen',      signal: 'Left G2 review: "Apollo is too manual and too expensive — looking for AI-native alternative"',     score: 78, industry: 'Workflow Automation' },
  { name: 'Nadia Osei',       role: 'VP Marketing',             company: 'Cohort Health',        email: 'nadia@cohorthealth.com',              linkedin: 'linkedin.com/in/nadiaosei',       signal: 'Your pricing page visited 5× this week from their company IP — high purchase intent signal',       score: 74, industry: 'Health Tech' },
  { name: 'David Kim',        role: 'Chief Revenue Officer',    company: 'Venturate',            email: 'david.kim@venturate.com',             linkedin: 'linkedin.com/in/davidkimcro',     signal: 'Newly hired CRO — typically rebuilds entire sales stack within first 90 days at every company',    score: 71, industry: 'FinTech' },
  { name: 'Priya Sharma',     role: 'VP of Sales',              company: 'Driftwave',            email: 'priya.sharma@driftwave.io',           linkedin: 'linkedin.com/in/priyasharma',     signal: 'Tweeted: "We are hiring AEs aggressively — need a solid outbound engine ASAP"',                   score: 92, industry: 'MarTech' },
  { name: 'James Okafor',     role: 'Head of Business Dev',     company: 'Synkly',               email: 'james@synkly.com',                    linkedin: 'linkedin.com/in/jamesokafor',     signal: 'Just closed $8M Series A — CEO mentioned "scaling go-to-market" in TechCrunch interview',         score: 88, industry: 'Integration SaaS' },
  { name: 'Elena Rossi',      role: 'Founder & CEO',            company: 'Calvi AI',             email: 'elena@calvi.ai',                      linkedin: 'linkedin.com/in/elenarossi',      signal: 'Posted job for "Outbound SDR to build pipeline from scratch" — no existing sales motion',          score: 86, industry: 'AI Tools' },
  { name: 'Ben Hartley',      role: 'Sales Director',           company: 'Peakflow HQ',          email: 'ben.hartley@peakflowhq.com',          linkedin: 'linkedin.com/in/benhartley',      signal: 'Contract with Apollo.io seen expiring in LinkedIn job post: "Looking for Apollo replacement"',     score: 83, industry: 'Real Estate Tech' },
  { name: 'Yuki Tanaka',      role: 'GTM Lead',                 company: 'Praxis Labs',          email: 'yuki@praxislabs.io',                  linkedin: 'linkedin.com/in/yukitanaka',      signal: 'Commented on competitors post: "we tried this and it did not work for our team size"',             score: 80, industry: 'Dev Tools' },
  { name: 'Carlos Mendez',    role: 'VP Revenue',               company: 'Orbitt',               email: 'carlos.mendez@orbitt.co',             linkedin: 'linkedin.com/in/carlosmendez',    signal: 'LinkedIn activity: liked 4 posts about "AI-powered outbound" in last 48 hours',                   score: 77, industry: 'Logistics Tech' },
  { name: 'Sophie Laurent',   role: 'Chief of Staff',           company: 'Kira Finance',         email: 'sophie@kirafinance.com',              linkedin: 'linkedin.com/in/sophielaurent',   signal: 'Company raised Series B last month, CFO quoted as wanting to "10x pipeline this year"',            score: 75, industry: 'FinTech' },
  { name: 'Alex Novak',       role: 'Founder',                  company: 'Taskr',                email: 'alex@taskr.io',                       linkedin: 'linkedin.com/in/alexnovak',       signal: 'Negative Capterra review of Outreach.io: "Terrible ROI, switching next month"',                   score: 73, industry: 'Productivity SaaS' },
  { name: 'Mia Johnson',      role: 'Head of Sales',            company: 'Clearview Analytics',  email: 'mia.johnson@clearviewanalytics.co',   linkedin: 'linkedin.com/in/miajohnson',      signal: 'Posted about "missing pipeline targets by 40% — need help scaling outbound fast"',               score: 90, industry: 'Business Intelligence' },
  { name: 'Luca Ferrari',     role: 'Growth Manager',           company: 'Sprinto',              email: 'luca.ferrari@sprinto.com',            linkedin: 'linkedin.com/in/lucaferrari',     signal: 'Job posting for "RevOps Lead to build scalable outbound engine" posted 3 days ago',               score: 82, industry: 'Compliance SaaS' },
  { name: 'Rachel Kim',       role: 'VP of Operations',         company: 'Nudge Security',       email: 'rachel.kim@nudgesecurity.com',        linkedin: 'linkedin.com/in/rachelkim',       signal: 'Raised $12M Series A 6 weeks ago — leadership team active on LinkedIn discussing growth plans',   score: 87, industry: 'Cybersecurity' },
  { name: 'Omar Hassan',      role: 'Co-Founder & CEO',         company: 'Payloop',              email: 'omar@payloop.io',                     linkedin: 'linkedin.com/in/omarhassan',      signal: 'Asked community: "What outbound tools are you using in 2025 that aren\'t Apollo or Outreach?"',   score: 84, industry: 'Payments Tech' },
  { name: 'Nina Petrov',      role: 'Sales Enablement Lead',    company: 'Cortex AI',            email: 'nina.petrov@cortexai.io',             linkedin: 'linkedin.com/in/ninapetrov',      signal: 'Fired their agency for cold outreach — job post says "bringing prospecting in-house with AI"',    score: 79, industry: 'AI SaaS' },
  { name: 'Will Zhang',       role: 'Director of Demand Gen',   company: 'Plexo',                email: 'will.zhang@plexo.com',                linkedin: 'linkedin.com/in/willzhang',       signal: 'LinkedIn post: "Hand-written cold emails are our best channel right now — hard to scale"',        score: 76, industry: 'Supply Chain Tech' },
  { name: 'Amara Diallo',     role: 'Head of Growth',           company: 'Formly',               email: 'amara@formly.io',                     linkedin: 'linkedin.com/in/amaradiallo',     signal: 'Just announced new enterprise tier — need outbound to fill pipeline at higher ACV',               score: 93, industry: 'No-Code SaaS' },
  { name: 'Josh Winters',     role: 'CEO & Founder',            company: 'Beamy',                email: 'josh.winters@beamy.app',              linkedin: 'linkedin.com/in/joshwinters',     signal: 'Reddit comment: "Our SDR quit and I\'m doing outreach manually -- it\'s not sustainable"',          score: 89, industry: 'Design Tools' },
  { name: 'Ting Li',          role: 'VP of Revenue',            company: 'Wrapify',              email: 'ting.li@wrapify.com',                 linkedin: 'linkedin.com/in/tingli',          signal: 'Series B company: CRO role just went vacant — board wants new pipeline strategy within 60 days',  score: 86, industry: 'AdTech' },
  { name: 'Emma Walsh',       role: 'Sales Operations Lead',    company: 'Tessera',              email: 'emma.walsh@tessera.io',               linkedin: 'linkedin.com/in/emmawalsh',       signal: 'Published LinkedIn article: "Why I stopped using Salesforce sequences and what I use instead"',   score: 82, industry: 'Legal Tech' },
  { name: 'Felix Braun',      role: 'Founder & CTO turned CEO', company: 'Devhub',               email: 'felix@devhub.io',                     linkedin: 'linkedin.com/in/felixbraun',      signal: 'Technical founder now running sales — Tweeted "I need an AI to do this because I hate cold email"', score: 78, industry: 'Dev Tools' },
  { name: 'Isabelle Morel',   role: 'Chief Marketing Officer',  company: 'Axiom Data',           email: 'isabelle.morel@axiomdata.co',         linkedin: 'linkedin.com/in/isabellemorel',   signal: 'Company just won "Fastest Growing SaaS" award — sales team being doubled immediately',             score: 85, industry: 'Data Infrastructure' },
  { name: 'Marcus Thompson',  role: 'Head of Partnerships',     company: 'Relay Commerce',       email: 'marcus.t@relaycommerce.com',          linkedin: 'linkedin.com/in/marcusthompson',  signal: 'Announced $5.2M raise — hiring "full go-to-market team" per press release published yesterday',   score: 83, industry: 'E-commerce' },
  { name: 'Zoe Park',         role: 'VP Sales Engineering',     company: 'Meshery',              email: 'zoe.park@meshery.io',                 linkedin: 'linkedin.com/in/zoepark',         signal: 'Left Salesforce VP role to join startup — LinkedIn shows actively building outbound motion',       score: 80, industry: 'Cloud Infrastructure' },
];

function shuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * (i + 1) * 2654435761) >>> 0) / 0x100000000 * (i + 1));
    [a[i], a[j % (i + 1)]] = [a[j % (i + 1)], a[i]];
  }
  return a;
}

function pickLeads(seed: number, count = 8): Omit<Lead, 'id' | 'initials' | 'color' | 'status' | 'time'>[] {
  return shuffle(LEAD_POOL, seed).slice(0, count);
}

const STATUS_POOL: Lead['status'][] = ['replied', 'booked', 'contacted', 'contacted', 'pending', 'pending', 'pending', 'pending'];
const TIMES = ['20m ago', '45m ago', '1h ago', '2h ago', '3h ago', '5h ago', '8h ago', '12h ago'];

function enrichLeads(raw: Omit<Lead, 'id' | 'initials' | 'color' | 'status' | 'time'>[], seed: number): Lead[] {
  const shuffledColors = shuffle(COLORS, seed + 7);
  return raw.map((lead, i) => ({
    ...lead,
    id: i + 1,
    initials: lead.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    color: shuffledColors[i % shuffledColors.length],
    status: STATUS_POOL[i % STATUS_POOL.length],
    time: TIMES[i % TIMES.length],
  }));
}

export async function POST(req: NextRequest) {
  const { icp, website, clientApiKey } = await req.json().catch(() => ({}));

  // Prefer client-provided key (from Settings UI) over env variable
  const apiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

  // Use time-based seed so each call returns different leads
  const seed = Math.floor(Date.now() / 1000);

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    await new Promise((r) => setTimeout(r, 800));
    const picked = pickLeads(seed, 8);
    return NextResponse.json({ leads: enrichLeads(picked, seed), source: 'mock' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });

    const prompt = `You are a B2B sales intelligence system. Generate 8 realistic, high-intent prospects based on this Ideal Customer Profile.

ICP:
${JSON.stringify(icp ?? { targetRoles: ['VP Sales', 'Founder', 'Head of Growth'], targetIndustries: ['SaaS', 'FinTech'], companySize: '10-200 employees' }, null, 2)}

Product being sold: ${website ?? 'a B2B SaaS tool'}
Value proposition: ${icp?.valueProposition ?? 'Automate outbound prospecting with AI'}

Rules for each prospect:
- Company must be realistic but NOT a Fortune 500 (small to mid-market, 10-500 employees)
- Signal must be SPECIFIC and actionable (e.g. "Just raised Series A", "Left negative review of competitor", "Hiring 3 SDRs", "Shared post about scaling challenges")
- Email format: firstname.lastname@company.com or firstname@company.com
- Score: 65-99 (higher = stronger signal)
- Role must match the ICP target roles
- Industry must match ICP target industries

Return ONLY a valid JSON array of 8 objects with these exact fields:
[{
  "name": "Full Name",
  "role": "Job Title",
  "company": "Company Name",
  "email": "email@company.com",
  "linkedin": "linkedin.com/in/handle",
  "signal": "Specific buying intent signal (1-2 sentences)",
  "score": 85,
  "industry": "Industry"
}]

No markdown, no explanation. Only the JSON array.`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const raw = JSON.parse(cleaned);
    const leads = enrichLeads(Array.isArray(raw) ? raw : raw.leads ?? pickLeads(seed), seed);
    return NextResponse.json({ leads, source: 'gemini' });
  } catch (err) {
    console.error('generate-leads error:', err);
    return NextResponse.json({ leads: enrichLeads(pickLeads(seed, 8), seed), source: 'mock' });
  }
}
