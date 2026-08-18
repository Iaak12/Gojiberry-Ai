import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { thread, prospect, fromName, clientApiKey } = await req.json().catch(() => ({}));

  const apiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    await new Promise((r) => setTimeout(r, 400));
    const firstName = prospect?.name?.split(' ')[0] ?? 'there';
    return NextResponse.json({
      reply: `Thanks for getting back to me, ${firstName}! I'd love to show you exactly how Gojiberry handles this for companies at your stage.\n\nAre you free for a 20-minute call this Thursday or Friday afternoon?`,
      source: 'mock',
    });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const genai = new GoogleGenAI({ apiKey });

    const threadStr = Array.isArray(thread)
      ? thread.map((msg: string, i: number) => `${i % 2 === 0 ? 'Me' : prospect?.name ?? 'Prospect'}: ${msg}`).join('\n\n')
      : String(thread ?? '');

    const prompt = `You are a skilled B2B sales development rep writing a reply to a warm prospect.

CONVERSATION THREAD:
${threadStr}

PROSPECT: ${prospect?.name ?? 'Unknown'} at ${prospect?.company ?? 'their company'}

YOUR GOAL: Move toward booking a discovery call or demo. Be natural and responsive to what they said.

RULES:
- 2-4 sentences MAX
- Reference something specific from their last message
- End with a clear, easy-to-answer CTA (specific day/time or a question)
- Warm, professional tone — not salesy
- Do NOT use generic openers like "Great to hear from you!" or "Thanks for reaching out!"
- Sign off with: ${fromName ?? 'The Team'}

Return ONLY the reply text. No JSON, no subject line, no labels.`;

    const response = await genai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const reply = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    
    if (!reply) {
      return NextResponse.json({ error: 'Failed to generate reply.' }, { status: 500 });
    }

    return NextResponse.json({ reply, source: 'gemini' });
  } catch (err: any) {
    console.error('generate-reply error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate reply' }, { status: 500 });
  }
}
