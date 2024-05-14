import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "username must be 5 characters")
  .max(20, "username must be less than 20 characters")
  .regex(/^[a-zA-A0-9_]+$/, "username must not contain special character");

  export const signupSchema=z.object({
    username:usernameValidation,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be atleast 6 Characters"})
  })
