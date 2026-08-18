import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";
config();

async function run() {
  try {
    const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Fallback: we can't easily call ListModels in the new SDK if we don't know the exact method, 
    // let's just try to call generateContent with gemini-2.5-flash, gemini-1.5-flash, gemini-1.5-pro, etc.
    const modelsToTest = [
      "gemini-1.5-flash",
      "gemini-1.5-flash-latest",
      "gemini-1.5-pro",
      "gemini-2.0-flash",
      "gemini-1.0-pro"
    ];

    for (const model of modelsToTest) {
      try {
        console.log(`Testing model: ${model}...`);
        await genai.models.generateContent({
          model,
          contents: "Hello"
        });
        console.log(`✅ ${model} works!`);
      } catch (err: any) {
        console.error(`❌ ${model} failed:`, err.message);
      }
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
