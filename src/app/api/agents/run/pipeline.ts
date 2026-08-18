import { GoogleGenAI } from "@google/genai";
import { getLinkedInProfile } from "@/lib/apify";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";
import User from "@/models/User";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function processLinkedInProfile(profileUrl: string, userId: string) {
  try {
    // 1. Fetch data from LinkedIn via Apify
    const apifyToken = process.env.APIFY_API_TOKEN || '';
    const profileData = await getLinkedInProfile(profileUrl, apifyToken);
    
    if (!profileData) {
      throw new Error("Could not fetch profile data");
    }

    // 2. Fetch User's ICP
    await connectToDatabase();
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const icp = user.icp || {};

    // 3. Match using Gemini
    const prompt = `
      You are an expert sales recruiter. Score this LinkedIn profile against the Ideal Customer Profile (ICP).
      ICP: ${JSON.stringify(icp)}
      Profile: ${JSON.stringify(profileData)}
      
      Return ONLY a JSON object:
      {
        "score": number (0-100),
        "reasoning": "short explanation",
        "matchedKeywords": ["key1", "key2"]
      }
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    const resultText = response.text || "{}";
    const result = JSON.parse(resultText);

    // 4. Save to Lead Inbox if score > 70
    if (result.score > 70) {
      const newLead = await Lead.create({
        userId,
        linkedInUrl: profileUrl,
        name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'Unknown',
        headline: profileData.headline,
        score: result.score,
        reasoning: result.reasoning,
        status: "New",
      });
      return { success: true, lead: newLead, score: result.score };
    }

    return { success: true, lead: null, score: result.score, message: "Lead did not meet ICP score threshold." };
  } catch (error) {
    console.error("Pipeline Error:", error);
    return { success: false, error: "Pipeline execution failed" };
  }
}
