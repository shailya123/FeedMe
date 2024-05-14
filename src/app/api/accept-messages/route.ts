import UserModel from "@/model/User";
import { dbConnect } from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import { User } from "next-auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
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
  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const updateduser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!updateduser) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "failed to update user status" },
          status: 401,
        })
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        result: { message: "Status updated sucessfully" },
        status: 201,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "failed to update user status" },
        status: 500,
      })
    );
  }
}

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
  const userId = user._id;
  try {
    const foundUser = await UserModel.findById(userId);
    if (!foundUser) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "User not found" },
          status: 404,
        })
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        result: { message: "Status updated sucessfully" },
        isAcceptingMessages: foundUser.isAcceptingMessages,
        status: 201,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "failed to update user status" },
        status: 500,
      })
    );
  }
}
