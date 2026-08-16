import { NextResponse } from "next/server";
import { processLinkedInProfile } from "./pipeline";
import { auth } from "@/auth";
import { checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check rate limit (max 100 per day per user)
    const { success } = await checkRateLimit(session.user.id);
    if (!success) {
      return NextResponse.json({ error: "Rate limit exceeded. Please upgrade your plan." }, { status: 429 });
    }

    const { profileUrl } = await req.json();
    if (!profileUrl) {
      return NextResponse.json({ error: "Profile URL is required" }, { status: 400 });
    }

    const result = await processLinkedInProfile(profileUrl, session.user.id);
    
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
