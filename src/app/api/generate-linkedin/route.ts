import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prospect, fromName, clientApiKey } = await req.json().catch(() => ({}));

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect data is required' }, { status: 400 });
    }

    const geminiKey = (clientApiKey && clientApiKey !== 'MY_GEMINI_API_KEY') ? clientApiKey : process.env.GEMINI_API_KEY;

    if (!geminiKey || geminiKey === 'MY_GEMINI_API_KEY') {
       return NextResponse.json({ error: 'Gemini API key is missing' }, { status: 400 });
    }

    const genai = new GoogleGenAI({ apiKey: geminiKey });

    const prompt = `You are an expert SDR writing a highly personalized, short LinkedIn connection request message (max 300 characters).
Do NOT include a subject line.

Prospect Info:
Name: ${prospect.name || 'there'}
Role: ${prospect.role || 'Professional'}
Company: ${prospect.company || 'your company'}
Recent Signal: ${prospect.signal || 'None'}
Industry: ${prospect.industry || 'Tech'}

Sender Info:
Name: ${fromName || 'Gojiberry User'}

Guidelines:
1. Max 300 characters.
2. Be very casual and concise. No fluff.
3. Mention their recent signal or company growth if relevant.
4. Don't pitch aggressively in the connection request.

Write the connection request message now:`;

    const response = await genai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });

    const message = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? '';
    
    if (!message) {
      return NextResponse.json({ error: 'Failed to generate message from AI' }, { status: 500 });
    }

    return NextResponse.json({ message, source: 'gemini' });
  } catch (err: any) {
    console.error('generate-linkedin error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate message' }, { status: 500 });
  }
}
