import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login to start" });
  }

  const userId = session.user.id;
  const body = await req.json();
  const { messages, chatId } = body;

  if (!messages) {
    return NextResponse.json({ message: "messages not found in backend " });
  }
  if (!chatId) {
    return NextResponse.json({ message: "chatId not found in backend " });
  }

  const prevChat = await prisma.chat.findFirst({
    where: { id: chatId, userId },
  });
  if (!prevChat) {
    return NextResponse.json({ message: "upload a doc to start chatting" });
  }

  const lastMessage = messages[messages.length - 2];
  if (!lastMessage || lastMessage.role !== "user") {
    return NextResponse.json({ message: "No valid user message found" });
  }

  // Save only user message (assistant may not exist yet)
  const user = await prisma.message.create({
    data: {
      chatId,
      userId,
      role: lastMessage.role,
      parts: lastMessage.parts,
    },
  });

  let assistant = null;
  if (messages.length > 1) {
    const secondLast = messages[messages.length - 1];
    if (secondLast.role === "assistant") {
      assistant = await prisma.message.create({
        data: {
          chatId,
          userId,
          role: secondLast.role,
          parts: secondLast.parts,
        },
      });
    }
  }

  return NextResponse.json({
    message: "Messages saved successfully",
    user,
    assistant,
  });
}
