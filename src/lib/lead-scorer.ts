import { GoogleGenAI } from '@google/genai';

export async function scoreAndEnrichLeads(
  geminiApiKey: string,
  rawProfiles: any[],
  icp: any,
  website: string
) {
  if (!geminiApiKey || geminiApiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Valid Gemini API Key is required for scoring.');
  }

  const genai = new GoogleGenAI({ apiKey: geminiApiKey });

  const prompt = `You are an expert B2B sales intelligence system. Evaluate the following real LinkedIn profiles against this Ideal Customer Profile (ICP).

ICP:
${JSON.stringify(icp, null, 2)}

Product being sold: ${website || 'a B2B SaaS tool'}

Raw Profiles:
${JSON.stringify(rawProfiles.map((p: any) => ({
  name: `${p.profile?.first_name} ${p.profile?.last_name}`,
  headline: p.profile?.headline,
  summary: p.profile?.summary,
  occupation: p.profile?.occupation,
  experiences: p.profile?.experiences?.slice(0, 2),
  linkedin_url: `https://linkedin.com/in/${p.profile?.public_identifier}`
})), null, 2)}

Task:
For EACH profile that is a STRONG FIT (Score > 65), extract their details and formulate a specific buying signal based on their recent experience or headline.
Drop any profile that is a bad fit.

Return ONLY a valid JSON array of objects with exactly these fields:
[{
  "name": "Full Name",
  "role": "Current Job Title",
  "company": "Current Company Name",
  "email": "firstname@company.com", 
  "linkedin": "linkedin.com/in/handle",
  "signal": "Specific buying intent signal (e.g., 'Just started as VP Sales 2 months ago')",
  "score": 85,
  "industry": "Industry based on profile"
}]

Do not include markdown or text blocks. Only the JSON array.`;

  const response = await genai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  });

  const text = response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  
  try {
    const scoredLeads = JSON.parse(cleaned);
    return Array.isArray(scoredLeads) ? scoredLeads : [];
  } catch (err) {
    console.error('Failed to parse Gemini output:', text);
    return [];
  }
}
