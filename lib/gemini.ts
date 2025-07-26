import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export const GeminiSendMessage = {
  sendMessage: async (inputPrompt: string) => {
    const config = {
      responseMimeType: "text/plain",
    };
    const model = "gemini-1.5-flash";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: inputPrompt,
          },
        ],
      },
    ];
    const response = await ai.models.generateContentStream({
      model,
      config,
      contents,
    });
    let result = "";
    for await (const chunk of response) {
      result += chunk.text;
    }
    return result;
  },
};
