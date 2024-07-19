import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();

  const { username, content, rating } = await req.json();
  try {
    const user: any = await UserModel.findOne({ username });
    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "User Not Found" },
          status: 404,
        })
      );
    }
    if (!user.isAcceptingMessages) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "User is Not Accepting Messages" },
          status: 403,
        })
      );
    }
    const newMessage = { content, createdAt: new Date(), rating };
    user.messages.push(newMessage);
    await user.save();
    return new Response(
      JSON.stringify({
        success: true,
        result: { message: "Message send successfully" },
        status: 200,
      })
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "Error while sending a message" },
        status: 500,
      })
    );
  }
}
