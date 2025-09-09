"use client";
import { useSession } from "next-auth/react";
import React from "react";

const page = () => {
  const { data: session } = useSession();
  if (session) {
    console.log("USER LOGINED", session);
  }
  return <div>page</div>;
};

export default page;
