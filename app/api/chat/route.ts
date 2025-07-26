import { NextRequest, NextResponse } from "next/server";
import {
  agentWithSystemInstruction,
  agentWithSampling,
  agentWithStructuredOutput,
  agentWithFunctionCalling
} from "@/app/agents/generate_text";
// test comment
export async function POST(request: NextRequest) {
  const { message, conversation } = await request.json();
  console.log(`Received message: ${message}`);
  // conversation is array of objects: { text, sender }
  const conversationHistory = Array.isArray(conversation) ? conversation : [];
  console.log(`Conversation history: ${JSON.stringify(conversationHistory)}`);

  // Sample variables for all agents
  const userMessage = message;
  const personality = "friendly"; // sample personality
  const temperature = 0.3; // sample value
  const topK = 40; // sample value
  const topP = 0.95; // sample value

  // Call each agent with required arguments
  const systemInstructionResult = await agentWithSystemInstruction({
    userMessage,
    personality,
    conversation: conversationHistory
  });

  const samplingResult = await agentWithSampling({
    userMessage,
    temperature,
    topK,
    topP,
    conversation: conversationHistory
  });

  const structuredOutputResult = await agentWithStructuredOutput({
    userMessage,
    conversation: conversationHistory
  });

  const functionCallingResult = await agentWithFunctionCalling({
    userMessage,
    conversation: conversationHistory
  });

  return NextResponse.json({
    success: true,
    systemInstructionResult,
    samplingResult,
    structuredOutputResult,
    functionCallingResult
  });
}