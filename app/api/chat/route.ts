import { NextRequest, NextResponse } from "next/server";
import { testAgent } from "@/app/agents/generate_text";

export async function POST(request: NextRequest) {
  const { message, conversation } = await request.json();
  console.log(`Received message: ${message}`);
  // conversation is array of objects: { text, sender }
  const conversationHistory = Array.isArray(conversation) ? conversation : [];
  console.log(`Conversation history: ${JSON.stringify(conversationHistory)}`);

  // Convert to array of strings for testAgent, or update testAgent to accept sender info
  const text = await testAgent({
    userMessage: message,
    conversation: conversationHistory
  });

  return NextResponse.json({ success: true, text });
}