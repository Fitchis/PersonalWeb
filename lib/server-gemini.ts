import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export function getServerGemini() {
  if (!apiKey) throw new Error("GEMINI_API_KEY is not set");
  return new GoogleGenAI({ apiKey });
}

export async function generateText(messages: Array<{ role: "user" | "assistant"; content: string }>) {
  const ai = getServerGemini();
  const model = "gemini-1.5-flash";
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const response = await ai.models.generateContentStream({
    model,
    contents,
    config: { responseMimeType: "text/plain" },
  });
  let result = "";
  for await (const chunk of response) {
    result += (chunk as { text?: string }).text || "";
  }
  return result.trim();
}
