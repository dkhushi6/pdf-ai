import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

//fetch all chats
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login to start" });
  }
  const userId = session?.user?.id;
  const userChats = await prisma.chat.findMany({
    where: { userId },
    include: {
      document: {
        select: {
          id: true,
          content: true,
          metadata: true,
          createdAt: true,
        },
      },
      message: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          role: true,
          parts: true,
          createdAt: true,
        },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
  if (!userChats) {
    return NextResponse.json({ message: "chat doesn't exist for user " });
  }
  return NextResponse.json({ message: "user chats are ", chats: userChats });
}

// fetch particular chat
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login to start" });
  }
  const userId = session?.user?.id;
  const { chatId } = await req.json();
  const userChat = await prisma.chat.findMany({
    where: { userId, id: chatId },
    include: { message: true },
  });
  if (!userChat) {
    return NextResponse.json({ message: "chat doesn't exist for user " });
  }
  return NextResponse.json({ message: "user chats are ", chat: userChat });
}
