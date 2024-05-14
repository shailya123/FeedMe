import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "Not Authenticated" },
        status: 401,
      })
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "$messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if(!user||user.length===0){
        return new Response(
            JSON.stringify({
              success: false,
              result: { message: "User Not Found" },
              status: 401,
            })
          );  
    }
    return new Response(
        JSON.stringify({
          success: true,
          result: { messages:user[0].messages },
          status: 201,
        })
      ); 
  } catch (error) {
    return new Response(
        JSON.stringify({
          success: false,
          result: { message: error },
          status: 401,
        })
      ); 
  }
}
