import { z } from "zod";

export const resetPassowrdSchema = z.object({
email:z.string().email({message:"Invalid email address"})
});
