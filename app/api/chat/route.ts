import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  const { message } = await request.json();
  const apiKey = process.env.GOOGLE_GENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ success: false, error: "API key missing" }, { status: 500 });
  }
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });
    return NextResponse.json({ success: true, text: response.text });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "AI error" }, { status: 500 });
  }
}