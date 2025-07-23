import { Content, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({apiKey: process.env.GOOGLE_GENAI_API_KEY});
const systemInstructionContent = `You are a helpful AI assistant. Respond to the user's messages in a friendly and informative manner.`;

export async function testAgent({userMessage, conversation}: {userMessage: string, conversation: string[]}) {
  const conversationHistoryForModel: Content[] = [{ role: "user", parts: [{ text: userMessage + "\n" + conversation.join("\n") }] }];
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: conversationHistoryForModel,
    config: { systemInstruction: systemInstructionContent, temperature: 0.1, maxOutputTokens: 100, topK: 40, topP: 0.95 },
  });
  return response.text;
}

