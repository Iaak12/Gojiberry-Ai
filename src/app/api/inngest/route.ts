import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { runAutopilotCron, processCampaignQueue } from "../../../inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    runAutopilotCron,
    processCampaignQueue,
  ],
});
