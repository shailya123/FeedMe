import type { NextApiRequest, NextApiResponse } from 'next';

import bcrypt from 'bcryptjs';
import UserModel from '@/model/User';
import { dbConnect } from '@/lib/dbConnect';

export async function POST(req: Request) {
  
await dbConnect();
    const { token, email, password } =await req.json();
    const user = await UserModel.findOne({ email });

    if (!user || !user.resetPasswordToken) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: 'Invalid or expired token' },
          status: 400,
        })
      );
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);

    if (!isTokenValid || user.resetPasswordExpires < new Date(Date.now())) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: 'Invalid or expired token' },
          status: 400,
        })
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = "";
    user.resetPasswordExpires = new Date();
    await user.save();
    return new Response(
        JSON.stringify({
          success: true,
          result: { message: 'Password reset successfully' },
          status: 200,
        })
      );
}
