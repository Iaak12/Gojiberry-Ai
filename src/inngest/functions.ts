import { inngest } from "./client";
import User from "../models/User";
import Lead from "../models/Lead";
import Campaign from "../models/Campaign";
import ExtensionTask from "../models/ExtensionTask";
import connectToDatabase from "../lib/mongodb";
import { generateLeadsForUser } from "../lib/lead-generator";
import { parseEmailTemplate } from "../lib/email-parser";
import { sendEmail } from "../lib/resend";
import { checkRateLimit } from "../lib/ratelimit";

export const runAutopilotCron = inngest.createFunction(
  { id: "run-autopilot-cron" },
  { cron: "0 9 * * *" }, // Runs daily at 9:00 AM UTC
  async ({ step }) => {
    const usersCount = await step.run("fetch-and-process-active-users", async () => {
      await connectToDatabase();
      // Find users who have Autopilot turned on
      const users = await User.find({ "settings.autoGenerateAiMessages": true });
      
      let processedCount = 0;
      for (const user of users) {
        const geminiKey = user.geminiKey || process.env.GEMINI_API_KEY;
        if (!geminiKey || geminiKey === 'MY_GEMINI_API_KEY') continue;
        
        try {
          // Generate and save leads for this user automatically
          await generateLeadsForUser({
            userEmail: user.email,
            icp: user.icp,
            website: user.website || 'Our Company',
            geminiKey,
            proxycurlKey: process.env.PROXYCURL_API_KEY || ''
          });
          processedCount++;
        } catch (e) {
          console.error(`Autopilot failed for user ${user.email}`, e);
        }
      }
      return processedCount;
    });
    
    return { status: "Autopilot cron executed", usersProcessed: usersCount };
  }
);

export const processCampaignQueue = inngest.createFunction(
  { id: "process-campaign-queue" },
  { event: "campaign/step.execute" },
  async ({ event, step }) => {
    const { campaignId, leadId, stepIndex = 0 } = event.data;
    
    // Fetch campaign details safely as a step
    const campaignData = await step.run("fetch-campaign-details", async () => {
      await connectToDatabase();
      const campaign = await Campaign.findById(campaignId);
      if (!campaign || !campaign.sequence || !campaign.sequence[stepIndex]) {
        throw new Error("Invalid campaign or stepIndex");
      }
      return { 
        delayDays: campaign.sequence[stepIndex].delayDays || 0,
        stepType: campaign.sequence[stepIndex].stepType,
        template: campaign.sequence[stepIndex].template || ''
      };
    });
    
    // Durable wait
    if (campaignData.delayDays > 0) {
      await step.sleep("wait-for-delay", `${campaignData.delayDays}d`);
    }

    // Step 2: Rate Limit Check
    await step.run("check-rate-limit", async () => {
      await connectToDatabase();
      const campaign = await Campaign.findById(campaignId);
      if (campaign) {
        const user = await User.findById(campaign.userId);
        if (user) {
          const rl = await checkRateLimit(user.email);
          if (!rl.success) {
            // Throw error so Inngest retries with exponential backoff
            throw new Error(`Rate limit exceeded for user ${user.email}. Retrying later.`);
          }
        }
      }
    });

    // Execute the step
    await step.run("execute-campaign-step", async () => {
      await connectToDatabase();
      const lead = await Lead.findById(leadId);
      if (!lead) throw new Error("Lead not found");
      const campaign = await Campaign.findById(campaignId);
      const user = await User.findById(campaign.userId);

      // Check if email sending is configured
      if (campaignData.stepType === 'email') {
        const compiledMessage = parseEmailTemplate(campaignData.template, lead);
        const subject = `Following up with ${lead.company || 'your team'}`; 
        
        await sendEmail({
          to: lead.email,
          subject: subject,
          html: `<div style="font-family: sans-serif; white-space: pre-wrap;">${compiledMessage}</div>`
        });
      } else {
        // LinkedIn steps handled differently or logged for Chrome extension
        const compiledMessage = parseEmailTemplate(campaignData.template, lead);
        
        await ExtensionTask.create({
          userEmail: user.email,
          leadId: lead._id,
          campaignId: campaign._id,
          linkedinUrl: lead.linkedin || `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(lead.name)}`,
          message: compiledMessage,
          stepType: campaignData.stepType,
          status: 'pending'
        });
        
        console.log(`[Campaign ${campaignId}] Queued LinkedIn task for Lead ${leadId}`);
      }
      
      // Update the lead status
      await Lead.findByIdAndUpdate(leadId, { status: 'contacted' });
      
      return { success: true, leadId, type: campaignData.stepType };
    });

    return { status: "Campaign step executed successfully" };
  }
);
