import { dbConnect } from "@/lib/dbConnect";
import { resendOtpEmail } from "@/lib/resendOtpEmail";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "User not found" },
          status: 400,
        })
      );
    }
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();
    user.verifyCode = verifyCode;
    const expiryDate = new Date();
    user.verifyCodeExpiry = new Date(
      expiryDate.setHours(expiryDate.getHours() + 1)
    );
    await user.save();
    const emailResponse: any = await resendOtpEmail(
      user.email,
      decodedUsername,
      verifyCode
    );
    if (!emailResponse) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: emailResponse.message },
          status: 500,
        })
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        result: {
          message: "Email send successfully,Please verify your email",
        },
        status: 201,
      })
    );
  } catch (err) {
    console.error("Error verifying user", err);
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "Error verifying user" },
        status: 500,
      })
    );
  }
}
