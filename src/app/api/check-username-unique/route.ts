import { dbConnect } from "@/lib/dbConnect";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import UserModel from "@/model/User";

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = { username: searchParams.get("username") };
    const result = UsernameQuerySchema.safeParse(queryParam);
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return new Response(
        JSON.stringify({
          success: false,
          result: { usernameErrors },
          status: 400,
        })
      );
    }
    const { username } = result.data;
    const user = await UserModel.findOne({ username});
    if (user) {
      return new Response(
        JSON.stringify({
          success: false,
          result: { message: "Username is already taken" },
          status: 400,
        })
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        result: { message: "Username is unique" },
        status: 200,
      })
    );
  } catch (err) {
    console.error("Error checking username", err);
    return new Response(
      JSON.stringify({ success: false, result: { err }, status: 500 })
    );
  }
}
