import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/server-gemini";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: "Invalid input" }, { status: 400 });
    }
    const reply = await generateText(messages);
    if (!reply) {
      return NextResponse.json({ reply: "Empty response" }, { status: 500 });
    }
    return NextResponse.json({ reply });
  } catch (err) {
    const msg = (err as Error).message || "Unknown error";
    return NextResponse.json({ reply: `Error: ${msg}` }, { status: 500 });
  }
}
