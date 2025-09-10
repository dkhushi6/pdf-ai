"use client";
import React, { useEffect } from "react";
import axios from "axios";
const ChatHistory = () => {
  useEffect(() => {
    const handleChatsFetch = async () => {
      const res = await axios.get("/api/chat/fetch");
      console.log(res.data);
    };
    handleChatsFetch();
  }, []);
  return <div>ChatHistory</div>;
};

export default ChatHistory;
