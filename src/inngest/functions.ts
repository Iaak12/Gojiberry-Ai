// @ts-nocheck
import { inngest } from "./client";

// @ts-ignore
export const runAutopilotCron = inngest.createFunction(
  { id: "run-autopilot-cron" },
  { cron: "0 * * * *" }, // Runs every hour
  async ({ step }: any) => {
    await step.run("fetch-active-users", async () => {
      // Logic to fetch all users with Autopilot enabled
      return { usersCount: 0 };
    });
    
    // Implement scraper triggering here
    return { status: "Autopilot cron executed" };
  }
);

// @ts-ignore
export const processCampaignQueue = inngest.createFunction(
  { id: "process-campaign-queue" },
  { event: "campaign/step.execute" },
  async ({ event, step }: any) => {
    const { campaignId, leadId, delayDays } = event.data;
    
    if (delayDays > 0) {
      await step.sleep("wait-for-delay", `${delayDays}d`);
    }

    await step.run("send-email-message", async () => {
      // Trigger email or LinkedIn message via Resend or extension
      return { success: true, leadId };
    });

    return { status: "Campaign step executed" };
  }
);
