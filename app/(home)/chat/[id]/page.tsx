"use client";
import ChatInterface from "@/components/chat/chat-interface";
import Spinner from "@/components/spinner";
import Upload from "@/components/upload";
import { ObjectId } from "bson";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const [chatId, setChatId] = useState("");
  useEffect(() => {
    if (!id || id === "new") {
      const genId = new ObjectId().toHexString();
      console.log("genId", genId);
      setChatId(genId);
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", `/chat/${genId}`);
      }
    } else {
      setChatId(id);
    }
  }, [id]);
  useEffect(() => {
    if (id && id !== "new") {
      const handleReload = async () => {
        const res = await axios.post("/api/chat/fetch", { chatId: id });
        console.log(res.data);
      };
      handleReload();
    }
  }, [id]);

  if (!chatId) {
    return <Spinner />;
  }
  if (chatId)
    return (
      <div>
        <Upload chatId={chatId} />

        <ChatInterface chatId={chatId} />
      </div>
    );
};

export default page;
