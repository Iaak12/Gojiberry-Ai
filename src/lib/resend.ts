import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("No Resend API Key found. Mocking email send to:", to);
    return { id: "mock-id" };
  }
  
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM || "Acme <onboarding@resend.dev>",
      to,
      subject,
      html,
    });
    return data;
  } catch (error) {
    console.error("Resend Error:", error);
    return { error };
  }
}
