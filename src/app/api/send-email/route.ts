import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { sendEmail } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { to, subject, html } = await req.json();
    if (!to || !subject || !html) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // In development/test mode, route to the current user's email for safety
    const isProd = process.env.NODE_ENV === "production";
    const targetEmail = isProd ? to : session.user.email;

    const res = await sendEmail({
      to: targetEmail,
      subject,
      html: `<div style="font-family: sans-serif; white-space: pre-wrap;">${html}</div>`
    });

    if (res.error) {
      console.error("Resend error:", res.error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, sentTo: targetEmail });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
