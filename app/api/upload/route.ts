import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first" });
  }
  const userId = session.user.id;
  const formadata = await req.formData();
  const file = formadata.get("file") as File;
  const chatId = formadata.get("chatid") as string;
  if (!chatId) {
    return NextResponse.json({ message: "chatId not found " });
  }
  if (!file) {
    return NextResponse.json({ message: "file not found " });
  }
  let prevChat = await prisma.chat.findFirst({
    where: { userId, id: chatId },
  });
  if (!prevChat) {
    prevChat = await prisma.chat.create({
      data: {
        id: chatId,
        userId,
        name: "new chat",
      },
    });
  }

  // loading the chat

  const loader = new PDFLoader(file, {
    splitPages: false,
  });

  const docs = await loader.load();
  const texts = docs[0].pageContent;
  //split content

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 10,
    chunkOverlap: 1,
  });

  const output = await splitter.createDocuments([texts]);
  console.log(output);
}
