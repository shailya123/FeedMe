import { z } from "zod";

export const slackMessageSchema = z.object({
  channel: z.string(),
  message: z.string(),
});
