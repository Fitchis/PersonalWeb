import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/server-gemini";
import { ipFromRequestHeaders, rateLimit } from "@/lib/rate-limit";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: NextRequest) {
  try {
    const { messages } = (await req.json()) as { messages: ChatMessage[] };
    // Rate limit by IP (10 req/min default)
    const ip = ipFromRequestHeaders(req.headers);
    const rl = rateLimit("ai-chat", ip);
    if (!rl.ok) {
      return NextResponse.json({ reply: "Too many requests" }, { status: 429, headers: { "Retry-After": Math.ceil((rl.resetAt - Date.now()) / 1000).toString() } });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ reply: "Invalid input" }, { status: 400 });
    }
    // Basic size guard
    const totalLen = messages.reduce((n, m) => n + (m.content?.length || 0), 0);
    if (totalLen > 4000) {
      return NextResponse.json({ reply: "Input too large" }, { status: 413 });
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
