"use client";
import React from "react";
import ChatHistory from "../api/chat/history";
import DashHero from "@/components/dash-hero";

const page = () => {
  return (
    <div>
      <DashHero />
      <ChatHistory />
    </div>
  );
};

export default page;
