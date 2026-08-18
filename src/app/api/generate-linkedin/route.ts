import { NextRequest, NextResponse } from 'next/server';

const MOCK_MESSAGES = [
  (name: string, role: string, company: string, signal: string) =>
    `Hi ${name.split(' ')[0]}, noticed you're ${role} at ${company} — ${signal.toLowerCase().slice(0, 80)}. Running into this exact challenge is why we built Gojiberry. Would love to connect and share how we've helped similar teams.`,
  (name: string, _role: string, company: string, signal: string) =>
    `${name.split(' ')[0]}, saw the signal around ${company} — ${signal.toLowerCase().slice(0, 70)}. This is right in our wheelhouse at Gojiberry. Happy to share a quick insight if useful. Worth connecting?`,
  (name: string, role: string, company: string) =>
    `Hi ${name.split(' ')[0]}, as ${role} at ${company} you're probably thinking about scalable outbound. We automate exactly that — AI finds warm leads and runs personalized sequences 24/7. Let's connect!`,
];

export async function POST(req: NextRequest) {
  const { prospect, icp, fromName, clientApiKey } = await req.json().catch(() => ({}));

  const apiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    await new Promise((r) => setTimeout(r, 600));
    const idx = Math.floor(Math.random() * MOCK_MESSAGES.length);
    const fn = MOCK_MESSAGES[idx];
    const message = fn(
      prospect?.name ?? 'there',
      prospect?.role ?? 'leader',
      prospect?.company ?? 'your company',
      prospect?.signal ?? 'your recent activity'
    );
    return NextResponse.json({ message, source: 'mock' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert B2B sales development rep writing a LinkedIn connection request note.

PROSPECT:
- Name: ${prospect.name}
- First name: ${prospect.name.split(' ')[0]}
- Role: ${prospect.role}
- Company: ${prospect.company}
- Buying Signal: ${prospect.signal}

SENDER: ${fromName ?? 'The Team'} from Gojiberry AI

PRODUCT VALUE:
${icp?.valueProposition ?? 'AI-powered autonomous sales prospecting that finds warm leads and runs personalized outreach automatically.'}

RULES:
- LinkedIn note: MAX 300 characters total
- Reference the buying signal naturally — don't just copy it verbatim
- Personalized, warm, curious tone — not salesy
- End with a soft question or "worth connecting?"
- Do NOT use "I came across your profile" or "I wanted to reach out"
- Do NOT mention Gojiberry by name — just say "what we've built" or similar
- Use prospect's first name only

Return ONLY the note text. No labels, no JSON.`;

    const response = await genai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const message = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    return NextResponse.json({ message, source: 'gemini' });
  } catch (err) {
    console.error('generate-linkedin error:', err);
    const firstName = prospect?.name?.split(' ')[0] ?? 'there';
    return NextResponse.json({
      message: `Hi ${firstName}, noticed ${prospect?.signal?.toLowerCase().slice(0, 60) ?? 'your recent activity'}. This is exactly the kind of challenge we help teams solve. Worth a quick connect?`,
      source: 'mock',
    });
  }
}
