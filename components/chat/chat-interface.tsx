"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, UIMessage } from "ai";
import { send } from "node:process";
import { useEffect, useState } from "react";
import axios from "axios";
type ChatInterfaceProps = {
  chatId: string;
  oldMsg?: UIMessage[];
};

export default function ChatInterface({ chatId, oldMsg }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { chatId },
    }),
    onFinish: async (message) => {
      if (!chatId) {
        console.log("chatId from usechat", chatId);

        return;
      } else {
        console.log("chatId from usechat", chatId);
        console.log("message from usechat", message.messages);
        const res = await axios.post("/api/chat/save", {
          messages: message.messages,
          chatId,
        });
        console.log(res.data);
      }
    },
  });
  useEffect(() => {
    if (!oldMsg) {
      console.log("THIS IS A NEW CHAT");
      return;
    }
    if (oldMsg.length > 0) {
      console.log("oldchats from chatInterface:", oldMsg);
      console.log("oldchats from category:", oldMsg);

      setMessages(oldMsg);
      console.log("messages from setmessages", messages);
    }
  }, [oldMsg, setMessages]);
  return (
    <div className="flex flex-col w-full max-w-6xl py-24 mx-auto px-4">
      <div className="flex flex-col gap-4 mb-20">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-2 shadow-md text-sm md:text-base whitespace-pre-wrap
                  ${
                    isUser
                      ? "dark:bg-[#A84270] bg-[#edb1de] dark:text-white rounded-t-3xl rounded-bl-3xl"
                      : "bg-muted rounded-t-3xl rounded-br-3xl"
                  }`}
              >
                {message.parts.map((part, i) => {
                  if (part.type === "text") {
                    return <div key={`${message.id}-${i}`}>{part.text}</div>;
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="fixed bottom-0 left-0 right-0 flex justify-center pb-6"
      >
        <input
          className="w-full max-w-6xl py-3 px-5 border border-zinc-300 dark:border-zinc-800 rounded-full shadow-lg dark:bg-zinc-900"
          value={input}
          placeholder="Type your message..."
          onChange={(e) => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
