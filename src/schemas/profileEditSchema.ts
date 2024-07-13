import { z } from "zod";
const validImageFormats = ["jpg", "jpeg", "png"];
export const profileEditSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  contactNumber: z
    .string()
    .regex(/^[0-9]*$/, { message: "Contact Number must be a number" })
    .min(10, { message: "Enter valid phone number" })
    .max(10, { message: "Enter valid phone number" }),
  address: z.string(),
  gender: z.string(),
  pincode: z
    .string()
    .regex(/^[0-9]*$/, { message: "Contact Number must be a number" })
    .min(6, { message: "Enter valid pincode" })
    .max(10, { message: "Enter valid pincode" }),
  profileImg: z.string(),
  state:z.string(),
  country:z.string(),
  city:z.string(),
  birthdate:z.date(),
});
