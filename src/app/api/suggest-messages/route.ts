import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const initialMessage = {
      role: "system",
      content: "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform like qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interactions",
    };

    const result = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [initialMessage, ...messages],
    });

    const stream = OpenAIStream(result);
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({
        name,
        status,
        headers,
        message,
      });
    } else {
      console.error("An unexpected error occurred", error);
      throw error;
    }
  }
}
