import { NextRequest, NextResponse } from 'next/server';

export interface GeneratedEmail {
  subject: string;
  body: string;
}

function buildMockEmail(prospect: { name?: string; role?: string; company?: string; signal?: string; industry?: string }, fromName?: string): GeneratedEmail {
  const first = prospect?.name?.split(' ')[0] ?? 'there';
  const company = prospect?.company ?? 'your company';
  const signal = prospect?.signal ?? 'your recent activity in the market';
  const role = prospect?.role ?? 'leader';
  const industry = prospect?.industry ?? 'your space';

  const variants: GeneratedEmail[] = [
    {
      subject: `${company}'s outbound — a thought`,
      body: `Hi ${first},\n\n${signal.slice(0, 90)}${signal.length > 90 ? '...' : ''} — saw this and immediately thought of you.\n\nWe built Gojiberry specifically for ${role}s in ${industry} who need to scale pipeline without scaling headcount. AI finds your warm leads, writes personalized outreach, and books demos — 24/7.\n\nWorth a 15-minute look this week?\n\n${fromName ?? 'The Gojiberry Team'}`,
    },
    {
      subject: `Scaling outbound at ${company} — quick idea`,
      body: `Hi ${first},\n\nNoticed ${signal.toLowerCase().slice(0, 80)}. That's exactly the trigger we built Gojiberry around.\n\nOur AI autonomously finds high-intent leads matching your ICP, crafts hyper-personalized emails referencing their specific buying signals, and books demos — without a single SDR.\n\nHappy to show you a live demo specific to ${company}. Grab 15 min?\n\nBest,\n${fromName ?? 'The Gojiberry Team'}`,
    },
    {
      subject: `Re: outbound at ${company}`,
      body: `${first},\n\n${signal.slice(0, 100)}${signal.length > 100 ? '...' : ''} — this is a pattern we see with every company about to 3x their pipeline.\n\nGojiberry's AI agent runs your outbound end-to-end: intent monitoring, personalized email + LinkedIn, demo booking. Most teams go live in under 24 hours.\n\n15 minutes to see if it makes sense for ${company}?\n\n— ${fromName ?? 'The Gojiberry Team'}`,
    },
    {
      subject: `${first}, question about your pipeline`,
      body: `Hi ${first},\n\nSaw that ${signal.toLowerCase().slice(0, 80)} — strong signal that pipeline is top of mind.\n\nAt Gojiberry we automate the full outbound loop for ${role}s in ${industry}: AI scans 100k+ daily intent signals, writes emails referencing exactly what prospects care about right now, and books demos directly to your calendar.\n\nWould a quick call this week make sense?\n\n${fromName ?? 'The Gojiberry Team'}`,
    },
  ];

  return variants[Math.floor(Date.now() / 1000) % variants.length];
}

export async function POST(req: NextRequest) {
  const { prospect, icp, fromName, fromCompany, clientApiKey } = await req.json().catch(() => ({}));

  const apiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    await new Promise((r) => setTimeout(r, 700));
    return NextResponse.json({ email: buildMockEmail(prospect, fromName), source: 'mock' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert B2B cold email copywriter. Write a hyper-personalized cold email.

PROSPECT:
- Name: ${prospect.name}
- First name: ${prospect.name.split(' ')[0]}
- Role: ${prospect.role}
- Company: ${prospect.company}
- Industry: ${prospect.industry}
- Buying Signal: ${prospect.signal}

SENDER:
- Name: ${fromName ?? 'The Team'}
- Company: ${fromCompany ?? 'Gojiberry AI'}

PRODUCT VALUE:
${icp?.valueProposition ?? 'AI-powered autonomous sales prospecting that finds warm leads and runs personalized outreach automatically.'}

RULES:
- Subject line: 5-9 words, highly specific to the signal, no generic phrases
- Opening: MUST reference the exact signal in the first sentence as the icebreaker (be natural, not robotic)
- Body: 2-3 short paragraphs MAX. Be direct, show value, no fluff
- CTA: One simple soft ask ("Worth a quick call?" or "15 minutes this week?")
- Tone: Confident but not pushy. Professional but human
- NEVER use: "Hope this finds you well", "I came across your profile", "I wanted to reach out", "I'd love to connect"
- Use the prospect's first name only in the opening
- Keep total email under 120 words

Return ONLY valid JSON:
{
  "subject": "Subject line here",
  "body": "Full email body here (use \\n for line breaks)"
}`;

    const response = await genai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const email: GeneratedEmail = JSON.parse(cleaned);
    
    if (!email || !email.subject || !email.body) {
       return NextResponse.json({ error: 'Failed to generate email from Gemini API.' }, { status: 500 });
    }

    return NextResponse.json({ email, source: 'gemini' });
  } catch (err: any) {
    console.error('generate-email error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate email' }, { status: 500 });
  }
}
