import { searchLinkedInProfiles } from "./src/lib/apify.ts";
import { config } from "dotenv";
config();

async function run() {
  console.log("Starting Apify google search test...");
  const token = process.env.APIFY_API_TOKEN!;
  console.log("Token:", token.substring(0, 10) + "...");
  try {
    const profiles = await searchLinkedInProfiles(
      token,
      ["CEO", "Founder"],
      ["Software"],
      5
    );
    console.log("Found profiles:", profiles.length);
    console.log(JSON.stringify(profiles, null, 2));
  } catch (err) {
    console.error("Error:", err);
  }
}

run();
