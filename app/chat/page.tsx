"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import ChatUI from "../../components/ChatUI";

async function sendToAI(message: string): Promise<string> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await res.json();
    if (data.success) return data.text || "(No response)";
    return data.error || "Error";
  } catch (err) {
    return "Error connecting to AI";
  }
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Get bot response from API
    const botText = await sendToAI(inputMessage);
    const botMessage: Message = {
      id: messages.length + 2,
      text: botText,
      sender: 'bot',
    };

    setMessages(prev => [...prev, botMessage]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F0F2F5]">
      <div className="flex flex-1 items-end justify-center pb-8">
        <div className="w-full max-w-2xl flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
          <div className="flex flex-col justify-end w-full">
            <div className="h-[400px] overflow-y-auto px-4 py-6 bg-white rounded-lg shadow-lg flex flex-col justify-end">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`
                        max-w-[80%] px-4 py-2.5 text-sm
                        ${
                          message.sender === 'user'
                            ? 'bg-[#1A1A1A] text-white rounded-[20px] rounded-tr-[5px]'
                            : 'bg-gray-100 text-black rounded-[20px] rounded-tl-[5px] shadow-sm'
                        }
                      `}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full border-t bg-white p-4 rounded-b-lg shadow-lg">
              <div className="flex items-center gap-3 bg-[#F0F2F5] rounded-full p-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 bg-transparent text-sm focus:outline-none"
                />
                <Button 
                  onClick={handleSendMessage}
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-full bg-[#1A1A1A] hover:bg-[#2A2A2A]"
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}