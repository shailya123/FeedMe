import { resend } from "./resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "../types/ApiResponse";
import ResendOtpEmail from "../../emails/ResendOtp";

export async function resendOtpEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const { data, error } = await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'FeedMe Verification Code',
        react:ResendOtpEmail({username,otp:verifyCode}),
      });
    return { success: false, message: "success to send verification email" };
  } catch (emailError) {
    console.log("Error in sending Verification Email");
    return { success: false, message: "Failed to send verification email" };
  }
}
