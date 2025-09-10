import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import pool from "@/lib/pool";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login first" });
  }
  const userId = session.user.id;
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const chatId = formData.get("chatId") as string | null;
  if (!chatId) {
    return NextResponse.json({ message: "chatId not found in backend " });
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
    chunkSize: 500,
    chunkOverlap: 60,
  });

  const chunk = await splitter.createDocuments([texts]);
  const text = chunk.map((doc) => doc.pageContent);
  //embeddings

  const embeddings = await new OpenAIEmbeddings().embedDocuments(text);
  console.log(embeddings);
  // saving it in the database
  await Promise.all(
    chunk.map(async (doc, i) => {
      const embedding = embeddings[i];
      const query = ` INSERT INTO "document" ("userId","content" , "metadata","embedding","chatId" , "createdAt") VALUES($1,$2,$3::jsonb,$4::vector,$5,now())`;
      await pool.query(query, [
        userId,
        doc.pageContent,
        JSON.stringify(doc.metadata),
        JSON.stringify(embedding),
        chatId,
      ]);
    })
  );
  return NextResponse.json({ message: "Process complete!!!!" });
}
