"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import { chat, message, document } from "@prisma/client";

type ChatWithRelations = chat & {
  message: message[];
  document: document[];
};

type DocumentMetadata = {
  title?: string;
};

export default function ChatHistory() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chats, setChats] = useState<ChatWithRelations[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (status === "authenticated" && session?.user?.id) {
          const res = await axios.get("/api/chat/fetch");
          setChats(res.data.chats || []);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [status, session?.user?.id]);

  if (status === "unauthenticated") return null;

  if (status === "loading") {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Chat History</h1>

      {chats.length === 0 ? (
        <p className="text-gray-500 text-center">
          No chats yet. Start chatting!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {chats.map((chatItem) => {
            let firstMsg = "No messages yet";
            if (chatItem.message && chatItem.message.length > 0) {
              const parts = chatItem.message[0].parts as {
                type: string;
                text?: string;
              }[];
              const firstPart = parts?.[0];
              if (firstPart?.type === "text") {
                firstMsg = firstPart.text || "No message content";
              }
            }

            const docMetadata = chatItem.document?.[0]?.metadata as
              | DocumentMetadata
              | undefined;
            const docTitle = docMetadata?.title || "Untitled Document";

            return (
              <Card
                key={chatItem.id}
                className="p-6 rounded-2xl shadow-md hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col"
                onClick={() => router.push(`/chat/${chatItem.id}`)}
              >
                <CardHeader className="p-0">
                  <h2 className="text-lg font-semibold truncate text-gray-900 dark:text-gray-100">
                    📄 {docTitle}
                  </h2>
                </CardHeader>

                <CardContent className="flex flex-col flex-1 p-0 mt-3">
                  <p className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    <MessageSquare className="h-4 w-4 text-gray-500" />
                    {firstMsg}...
                  </p>

                  <div className="mt-auto pt-4 flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                    <span>
                      {chatItem.updatedAt
                        ? formatDistanceToNow(new Date(chatItem.updatedAt), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </span>
                    <span>
                      {chatItem.message?.length || 0}{" "}
                      {chatItem.message?.length === 1 ? "msg" : "msgs"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
