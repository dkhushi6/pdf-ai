import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login to start" });
  }
  const userId = session?.user?.id;
  const body = await req.json();
  const { messages, chatId } = body;
  if (!messages) {
    return NextResponse.json({ message: "msges not found in backend " });
  }

  if (!chatId) {
    return NextResponse.json({ message: "chatId not found in backend " });
  }
  const prevChat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
  });

  if (!prevChat) {
    return NextResponse.json({ messages: "upload a doc to start chating" });
  }
  let userMsg = null;

  let assistantMsg = null;
  if (messages[messages.length - 1].role === "user") {
    userMsg = messages[messages.length - 1];
  }
  if (messages[messages.length - 2].role === "assistant") {
    assistantMsg = messages[messages.length - 2];
  }
  const user = await prisma.message.create({
    data: {
      id: userMsg.id,
      chatId,
      userId,
      role: userMsg.role,
      parts: userMsg.parts,
    },
  });
  const assistant = await prisma.message.create({
    data: {
      id: assistantMsg.id,
      chatId,
      userId,
      role: assistantMsg.role,
      parts: assistantMsg.parts,
    },
  });
  return NextResponse.json({
    message: "Messages  created successfully",
    user,
    assistant,
  });
}
