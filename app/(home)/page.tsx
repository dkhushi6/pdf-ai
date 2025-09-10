"use client";
import Upload from "@/components/upload";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import ChatHistory from "../api/chat/history";

const page = () => {
  const { data: session } = useSession();

  return (
    <div>
      <ChatHistory />
    </div>
  );
};

export default page;
