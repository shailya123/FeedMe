import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { forgotPasswordEmail } from '@/lib/forgotPasswordEmail';


export async function POST(req: Request) {
    await dbConnect();
    const { email } =await req.json();
    console.log("req",email);
    const user = await UserModel.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "User not found" },
          status: 400,
        })
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}&email=${email}`;

    const emailResponse: any = await forgotPasswordEmail(
      user.email,
      resetUrl
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
  
}
