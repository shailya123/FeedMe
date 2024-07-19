import { NextRequest, NextResponse } from "next/server";
import { WebClient } from "@slack/web-api";

const token = process.env.SLACK_BOT_OAUTH_TOKEN; // Use the actual token
const slackClient = new WebClient(token);

export async function GET(req: NextRequest) {
  try {
    const result = await slackClient.conversations.list({
      types: "public_channel",
    });

    return NextResponse.json({ channels: result.channels });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json(
      { error: "Error fetching channels" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { channelId, message } = await req.json();
  try {
    const result = await slackClient.chat.postMessage({
      channel: channelId,
      text: message,
    });
    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error fetching channels:", error);
    return NextResponse.json(
      { error: "Error fetching channels" },
      { status: 500 }
    );
  }
}
