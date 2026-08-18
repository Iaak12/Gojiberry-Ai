import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clientId = process.env.HUBSPOT_CLIENT_ID || 'dummy_client_id';
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/integrations/hubspot/callback`;
  const scopes = "crm.objects.contacts.write crm.objects.contacts.read";
  
  const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes}`;
  
  return NextResponse.redirect(authUrl);
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { leadData } = await req.json();
    
    if (!leadData || !leadData.email) {
      return NextResponse.json({ error: "Invalid lead data. Email is required." }, { status: 400 });
    }

    const hubspotToken = process.env.HUBSPOT_ACCESS_TOKEN;
    if (!hubspotToken) {
      return NextResponse.json({ error: "HubSpot token not configured." }, { status: 500 });
    }

    const res = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hubspotToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          email: leadData.email,
          firstname: leadData.name?.split(' ')[0] || '',
          lastname: leadData.name?.split(' ').slice(1).join(' ') || '',
          company: leadData.company || '',
          jobtitle: leadData.role || ''
        }
      })
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("HubSpot error:", errData);
      return NextResponse.json({ error: "Failed to push to HubSpot" }, { status: res.status });
    }

    console.log(`[HubSpot] Successfully pushed contact ${leadData.email} to CRM.`);

    return NextResponse.json({ success: true, message: "Lead pushed to HubSpot successfully" });
  } catch (error: any) {
    console.error("HubSpot integration error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
