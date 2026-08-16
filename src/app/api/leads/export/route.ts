import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDatabase();
    const leads = await Lead.find({ userEmail: session.user.email });

    if (!leads || leads.length === 0) {
      return new NextResponse("No leads found", { status: 404 });
    }

    // Convert JSON to CSV using actual schema fields
    const headers = ["Name", "Email", "Role", "Company", "Industry", "Score", "Status", "LinkedIn URL", "Buying Signal"];
    const csvRows = [headers.join(",")];
    
    for (const lead of leads) {
      const row = [
        `"${lead.name || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.role || ''}"`,
        `"${lead.company || ''}"`,
        `"${lead.industry || ''}"`,
        `"${lead.score || 0}"`,
        `"${lead.status || 'pending'}"`,
        `"${lead.linkedin || ''}"`,
        `"${(lead.signal || '').replace(/"/g, '""')}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvData = csvRows.join("\n");

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=gojiberry_leads_export.csv",
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
