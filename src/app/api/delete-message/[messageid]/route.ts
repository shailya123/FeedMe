import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(
  req: Request,
  { params }: { params: { messageid: string } }
) {
  const messageId = params.messageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  if (!session || !_user) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "Not Authenticated" },
        status: 401,
      })
    );
  }
  try {
    const updateResult = await UserModel.updateOne(
      { _id: _user._id },
      { $pull: { messages: { _id: messageId } } }
    );
    console.log(updateResult);
    if (updateResult.modifiedCount === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "Message not found or already deleted" },
          status: 404,
        })
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        result: { message: "Message deleted" },
        status: 200,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "Error deleting message" },
        status: 500,
      })
    );
  }
}
