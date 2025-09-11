"use client";
import ChatInterface from "@/components/chat/chat-interface";
import Spinner from "@/components/spinner";
import Upload from "@/components/upload";
import { ObjectId } from "bson";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { UIMessage } from "ai";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const [chatId, setChatId] = useState("");
  const [isNewChat, setIsNewChat] = useState(false);
  const [oldMsg, setOldMsg] = useState<UIMessage[]>([]);

  useEffect(() => {
    if (!id || id === "new") {
      setIsNewChat(true);
      const genId = new ObjectId().toHexString();
      console.log("genId", genId);
      setChatId(genId);
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", `/chat/${genId}`);
      }
    } else {
      setChatId(id);
      setIsNewChat(false);
    }
  }, [id]);
  useEffect(() => {
    if (id && id !== "new") {
      const handleReload = async () => {
        const res = await axios.post("/api/chat/fetch", { chatId: id });
        console.log("RELOAD MSG", res.data);
        setOldMsg(res.data.chat[0].message);
      };
      handleReload();
    }
  }, [id]);

  if (!chatId) {
    return <Spinner />;
  }

  return isNewChat ? (
    <Upload chatId={chatId} />
  ) : (
    <ChatInterface chatId={chatId} oldMsg={oldMsg} />
  );
};

export default page;
