import { z } from "zod";


  export const passwordResetingSchema=z.object({
    password:z.string().min(6,{message:"Password must be atleast 6 Characters"}),
    confirmPassword:z.string().min(6,{message:"Password must be atleast 6 Characters"})
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // path of error
  });
