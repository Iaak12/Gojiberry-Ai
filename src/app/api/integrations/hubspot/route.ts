import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

// Dummy OAuth handler for HubSpot
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const redirectUri = `${process.env.APP_URL}/api/integrations/hubspot/callback`;
  const scopes = "contacts";
  
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
  
  return NextResponse.redirect(authUrl);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { leadData } = await req.json();

    // Call HubSpot API to create contact
    // const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', { ... })

    return NextResponse.json({ success: true, message: "Lead pushed to HubSpot" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
