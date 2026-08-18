import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export interface ICPAnalysis {
  companyDescription: string;
  targetRoles: string[];
  targetIndustries: string[];
  valueProposition: string;
  companySize: string;
  geography: string;
}

export async function POST(req: NextRequest) {
  const { url, clientApiKey } = await req.json();

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  const apiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return NextResponse.json({ error: 'Gemini API key is required to analyze website.' }, { status: 400 });
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
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const result: ICPAnalysis = JSON.parse(cleaned);

    if (!result || !result.targetRoles || result.targetRoles.length === 0) {
      return NextResponse.json({ error: 'Failed to analyze website content.' }, { status: 500 });
    }

    return NextResponse.json({ icp: result, source: 'gemini' });
  } catch (err: any) {
    console.error('analyze-website error:', err);
    return NextResponse.json({ error: err.message || 'Failed to analyze website.' }, { status: 500 });
  }
}
