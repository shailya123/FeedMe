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
    const updateResult = await UserModel.updateOne(
      { _id: user._id },
      {
        $pull: { message: { _id: messageId } },
      }
    );
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
