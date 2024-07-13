import { resend } from "./resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import ForgotPasswordEmail from "../../emails/ForgotPassword";

export async function forgotPasswordEmail(
  email: string,
  forgotPasswordLink: string,
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'FeedMe forgot password',
        react:ForgotPasswordEmail({forgotPasswordLink}),
      });
    return { success: false, message: "success to send forgot password email" };
  } catch (emailError) {
    console.log("Error in sending forgot password Email");
    return { success: false, message: "Failed to forgot password email" };
  }
}
