
import { Content, GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENAI_API_KEY });

// 1. System Instruction Demo: Change assistant personality
export async function agentWithSystemInstruction({ userMessage, personality, conversation }: { userMessage: string, personality: string, conversation: any[] }) {
  const systemInstruction = `You are a ${personality} AI assistant.`;
  // Build conversation history for model
  const contents: Content[] = [
    ...Array.isArray(conversation) ? conversation.map((msg: any) => ({ role: msg.sender || "user", parts: [{ text: msg.text }] })) : [],
    { role: "user", parts: [{ text: userMessage }] }
  ];
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: { systemInstruction, temperature: 0.2 },
  });
  return response.text;
}

// 2. Temperature/topK/topP Demo: Control randomness/diversity
export async function agentWithSampling({ userMessage, temperature, topK, topP, conversation }: { userMessage: string, temperature: number, topK: number, topP: number, conversation: any[] }) {
  // Build conversation history for model
  const contents: Content[] = [
    ...Array.isArray(conversation) ? conversation.map((msg: any) => ({ role: msg.sender || "user", parts: [{ text: msg.text }] })) : [],
    { role: "user", parts: [{ text: userMessage }] }
  ];
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: { temperature, topK, topP },
  });
  return response.text;
}

// 3. Structured Output Demo: Ask for JSON response
export async function agentWithStructuredOutput({ userMessage, conversation }: { userMessage: string, conversation: any[] }) {
  // Use Gemini API's recommended responseSchema for structured output
  const responseSchema = {
    type: "object",
    properties: {
      answer: { type: "string" },
      confidence: { type: "string", enum: ["high", "medium", "low"] }
    },
    required: ["answer", "confidence"],
    propertyOrdering: ["answer", "confidence"]
  };
  // Build conversation history for model
  const contents: Content[] = [
    ...Array.isArray(conversation) ? conversation.map((msg: any) => ({ role: msg.sender || "user", parts: [{ text: msg.text }] })) : [],
    { role: "user", parts: [{ text: userMessage }] }
  ];
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: {
      responseMimeType: "application/json",
      responseSchema,
      temperature: 0.1
    }
  });
  // The model should always return valid JSON
  try {
    if (response.text) {
      return JSON.parse(response.text);
    }
    return { answer: "No response", confidence: "unknown" };
  } catch {
    return { answer: response.text ?? "No response", confidence: "unknown" };
  }
}

// 4. Function Calling Demo: Simulate scheduling a meeting
export async function agentWithFunctionCalling({ userMessage, conversation }: { userMessage: string, conversation: any[] }) {
  // Use Gemini API's recommended function calling config for meeting scheduling
  const scheduleMeetingFunction = {
    name: "schedule_meeting",
    description: "Schedules a meeting with specified attendees at a given time and date.",
    parameters: {
      type: "object",
      properties: {
        attendees: {
          type: "array",
          items: { type: "string" },
          description: "List of people attending the meeting."
        },
        date: {
          type: "string",
          description: "Date of the meeting (e.g., '2025-07-29')"
        },
        time: {
          type: "string",
          description: "Time of the meeting (e.g., '15:00')"
        },
        topic: {
          type: "string",
          description: "The subject or topic of the meeting."
        }
      },
      required: ["attendees", "date", "time", "topic"],
      propertyOrdering: ["attendees", "date", "time", "topic"]
    }
  };
  // Build conversation history for model
  const contents: Content[] = [
    ...Array.isArray(conversation) ? conversation.map((msg: any) => ({ role: msg.sender || "user", parts: [{ text: msg.text }] })) : [],
    { role: "user", parts: [{ text: userMessage }] }
  ];
  // Gemini SDK expects items.type to be a valid type, not a string
  scheduleMeetingFunction.parameters.properties.attendees.items.type = "string";
  // Use the Tool class from SDK for proper typing
  // @ts-ignore: Tool typing may vary by SDK version
  const tools = [new (GoogleGenAI as any).Tool({ functionDeclarations: [scheduleMeetingFunction] })];
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
    config: { tools }
  });
  // Check for function call in the response
  const candidate = response.candidates?.[0];
  const part = candidate?.content?.parts?.[0];
  if (part?.functionCall) {
    const { name, args } = part.functionCall;
    if (name === "schedule_meeting") {
      // Here you would call your backend function with args
      return { scheduled: true, details: args };
    }
    return { scheduled: false, details: args };
  }
  return { scheduled: false, details: response.text ?? "No response" };
}


