import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { WebClient } from "@slack/web-api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = `${process.env.NGROK_URL}/api/slack/callback`;
  if (!code) {
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "Missing code" },
        status: 400,
      })
    );
  }

  try {
    const web = new WebClient();
    const response = await web.oauth.v2.access({
      client_id: clientId as string,
      client_secret: clientSecret as string,
      code,
      redirect_uri: redirectUri,
    });

    const { access_token, team } = response;
    const user = await UserModel.findOneAndUpdate(
      { email: "shailya6019506@gmail.com" }, // Assuming email is a unique identifier
      { $set: { slackAccessToken: access_token, slackTeam: team } },
      { new: true }
    );
    return NextResponse.redirect(
      new URL("http://localhost:3000/dashboard", req.url)
    );
  } catch (error) {
    console.error("OAuth Access Error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        result: { message: "OAuth Access Error" },
        status: 500,
      })
    );
  }
}
