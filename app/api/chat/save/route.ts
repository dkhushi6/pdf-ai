import { auth } from "@/lib/auth";
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
}
