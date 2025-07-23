import React, { useState } from "react";
// import { Button } from "../ui/button";

export interface Message {
  sender: "user" | "ai";
  text: string;
}

const ChatUI: React.FC<{ onSend: (message: string) => Promise<string> }> = ({ onSend }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { sender: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);
    const aiResponse = await onSend(input);
    setMessages((msgs) => [...msgs, { sender: "ai", text: aiResponse }]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto border rounded-lg shadow bg-white">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-[80%] p-3 rounded-lg ${
              msg.sender === "user"
                ? "bg-black text-white self-end ml-auto"
                : "bg-gray-100 text-gray-900 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatUI;
