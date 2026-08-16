import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import connectToDatabase from "@/lib/mongodb";
import Lead from "@/models/Lead";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return new NextResponse("Unauthorized", { status: 401 });

    await connectToDatabase();
    const leads = await Lead.find({ userId: session.user.id });

    if (!leads || leads.length === 0) {
      return new NextResponse("No leads found", { status: 404 });
    }

    // Convert JSON to CSV
    const headers = ["Name", "LinkedIn URL", "Headline", "Score", "Status"];
    const csvRows = [headers.join(",")];
    
    for (const lead of leads) {
      const row = [
        `"${lead.name || ''}"`,
        `"${lead.linkedInUrl || ''}"`,
        `"${(lead.headline || '').replace(/"/g, '""')}"`,
        `"${lead.score || 0}"`,
        `"${lead.status || 'New'}"`
      ];
      csvRows.push(row.join(","));
    }

    const csvData = csvRows.join("\n");

    return new NextResponse(csvData, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=leads_export.csv",
      },
    });
  } catch (error: any) {
    return new NextResponse(error.message, { status: 500 });
  }
}
