import { dbConnect } from "@/lib/dbConnect";

import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextApiResponse } from "next";

export async function GET(req: Request, res: NextApiResponse) {}

export async function POST(req: Request, res: NextApiResponse) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const existingUser = await UserModel.findOne({
      email,
      isVerified: true,
    });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: true,
          result: { message: "Username is already taken" },
          status: 400,
        })
      );
    }
    const existingUserByEmail = await UserModel.findOne({ email });
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();
    if (existingUserByEmail) {
      if (!existingUserByEmail.isVerified) {
        return new Response(
          JSON.stringify({
            success: false,
            result: { message: "Email already existes" },
            status: 400,
          })
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUserByEmail.password = hashedPassword;
        existingUserByEmail.verifyCode = verifyCode;
        const expiryDate = new Date();
        existingUserByEmail.verifyCodeExpiry =  new Date(expiryDate.setHours(expiryDate.getHours() + 1));
        await existingUserByEmail.save();
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      const newExpiryDate = new Date(expiryDate.getTime());
      // Add 1 hour to the new expiry date
      newExpiryDate.setHours(newExpiryDate.getHours() + 1);
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode: verifyCode,
        VerifyCodeExpiry: newExpiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });
      const data = await UserModel.create(newUser);
    }
    const emailResponse: any = await sendVerificationEmail(
      email,
      username,
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
          message: "User registered successfully,Please verify your email",
        },
        status: 201,
      })
    );
  } catch (err) {
    console.error("Error registering user", err);
    return new Response(
      JSON.stringify({ success: false, result: { message: err }, status: 500 })
    );
  }
}
