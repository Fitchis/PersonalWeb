import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

type ChatMessage = {
  role: string;
  content: string;
};
export async function POST(req: NextRequest) {
  const { messages } = await req.json();
  if (!GEMINI_API_KEY) {
    return NextResponse.json(
      { reply: "Gemini API key not set." },
      { status: 500 }
    );
  }
  try {
    // Gemini expects a single prompt string or an array of message objects (for chat)
    // We'll use the chat endpoint with message history
    const geminiMessages = (messages as ChatMessage[]).map(
      (m: ChatMessage) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })
    );
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contents: geminiMessages }),
      }
    );
    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json(
        { reply: `Gemini error: ${error}` },
        { status: 500 }
      );
    }
    const data = await res.json();
    // Gemini's response: data.candidates[0].content.parts[0].text
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    if (!reply) {
      return NextResponse.json(
        {
          reply: `Gemini did not return a message. Raw response: ${JSON.stringify(data)}`,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { reply: "Error: Could not reach Gemini." },
      { status: 500 }
    );
  }
}
