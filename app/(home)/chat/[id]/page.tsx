"use client";
import ChatInterface from "@/components/chat/chat-interface";
import Spinner from "@/components/spinner";
import Upload from "@/components/upload";
import { ObjectId } from "bson";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const params = useParams();
  const id = params.id as string;
  const [chatId, setChatId] = useState("");
  useEffect(() => {
    if (!id || id === "new") {
      const genId = new ObjectId().toHexString();
      console.log("genId", genId);
      setChatId(genId);
    } else {
      setChatId(id);
    }
  }, [id]);
  if (!chatId) {
    return <Spinner />;
  }
  if (chatId)
    return (
      <div>
        <Upload chatId={chatId} />

        <ChatInterface />
      </div>
    );
};

export default page;
