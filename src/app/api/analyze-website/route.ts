import { NextRequest, NextResponse } from 'next/server';

export interface ICPAnalysis {
  companyDescription: string;
  targetRoles: string[];
  targetIndustries: string[];
  valueProposition: string;
  companySize: string;
  geography: string;
}

const MOCK_ICP: ICPAnalysis = {
  companyDescription: 'A modern SaaS platform helping B2B companies automate their sales operations.',
  targetRoles: ['VP of Sales', 'Head of Growth', 'Founder / CEO', 'Sales Operations Manager'],
  targetIndustries: ['SaaS', 'FinTech', 'MarTech', 'E-commerce'],
  valueProposition: 'Reduce manual prospecting by 80% with AI-powered lead discovery and outreach.',
  companySize: '10–500 employees',
  geography: 'North America, Europe',
};

export async function POST(req: NextRequest) {
  const { url, clientApiKey } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const apiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    // Graceful fallback to mock data
    await new Promise((r) => setTimeout(r, 800));
    return NextResponse.json({ icp: MOCK_ICP, source: 'mock' });
  }

  try {
    // Fetch website content (best-effort, skip if blocked)
    let websiteText = '';
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'GojiberryCrawler/1.0' },
        signal: AbortSignal.timeout(5000),
      });
      const html = await res.text();
      // Extract text content simply
      websiteText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 3000);
    } catch {
      websiteText = `Website: ${url}`;
    }

    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });

    const prompt = `You are an AI sales analyst. Analyze this website content and extract Ideal Customer Profile (ICP) data for outbound sales targeting.

Website URL: ${url}
Website Content: ${websiteText}

Return ONLY valid JSON (no markdown, no explanation) in this exact shape:
{
  "companyDescription": "One sentence describing what the company does",
  "targetRoles": ["job title 1", "job title 2", "job title 3", "job title 4"],
  "targetIndustries": ["industry 1", "industry 2", "industry 3"],
  "valueProposition": "One sentence on main value proposition for outreach",
  "companySize": "e.g. 10-200 employees",
  "geography": "e.g. North America, Europe"
}`;

    const response = await genai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const icp: ICPAnalysis = JSON.parse(cleaned);

    return NextResponse.json({ icp, source: 'gemini' });
  } catch (err) {
    console.error('Gemini analysis error:', err);
    // Return mock data on any error
    return NextResponse.json({ icp: MOCK_ICP, source: 'mock' });
  }
}
