import { dbConnect } from "@/lib/dbConnect";

import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();

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
    const isCodeValid = user.verifyCode === code;
    const expiry=new Date(user.verifyCodeExpiry)
    const isCodeNotExpired =new Date(expiry.setHours(expiry.getHours() + 1)) > new Date();
    if (isCodeNotExpired && isCodeValid) {
      user.isVerified = true;
      await user.save();
      return new Response(
        JSON.stringify({
          success: true,
          result: { message: "User verified successfully" },
          status: 200,
        })
      );
    } else if (isCodeValid && !isCodeNotExpired) {
      return new Response(
        JSON.stringify({
          success: false,
          result: {
            message:
              "Verification code has expired, please signup again to get a new code",
          },
          status: 400,
        })
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "Incorrect verification Code, Please try again!!" },
          status: 400,
        })
      );
    }
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
