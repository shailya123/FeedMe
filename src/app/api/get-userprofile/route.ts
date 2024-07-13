import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(req: Request) {
    await dbConnect();
    try {
      const { searchParams } = new URL(req.url);
      const queryParam = { username: searchParams.get("username") };
      const { username } =queryParam
      const user = await UserModel.findOne({ username});
      if (user) {
        return new Response(
          JSON.stringify({
            success: true,
            result: { message: "User found",data:user },
            status: 202,
          })
        );
      }
    } catch (err) {
      console.error("Error checking username", err);
      return new Response(
        JSON.stringify({ success: false, result: { err }, status: 500 })
      );
    }
  }