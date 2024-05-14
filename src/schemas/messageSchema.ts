import { z } from "zod";

export const MessagesSchema = z.object({
  content: z
    .string()
    .min(10, "Content must be of atleast 10 Characters")
    .max(300, "Content must be no longer than 300 Characters"),
});
