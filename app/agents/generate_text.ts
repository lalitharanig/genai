import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function testAgent() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "How does AI work?",
  });
  console.log(response.text);
}

