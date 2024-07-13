import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import User, { Message } from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const { email,data } = await req.json();
  try {
    console.log(data,email);
    const user: any = await UserModel.findOneAndUpdate( { "email" : email },
        { $set : data },);
    if (!user) {
        return new Response(
            JSON.stringify({
              success: false,
              result: { message: "User Not Found" },
              status: 404,
            })
          );
        }
    return new Response(JSON.stringify({
        success: true,
        result: { message: "User profile updated successfully" },
        status: 200,
      })
    );

  }
   catch (err) {
    return new Response(JSON.stringify({
        success: false,
        result: { message: err },
        status: 500,
      })
    );

  }
}
