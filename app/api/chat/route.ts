import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { NextResponse } from "next/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import pool from "@/lib/pool";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Login to start" });
  }
  const userId = session?.user?.id;
  const body = await req.json();
  const { messages }: { messages: UIMessage[] } = body;

  const { chatId } = body;
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
  let query = "";
  if (messages[0].parts[0].type === "text") {
    query = messages[0].parts[0].text;
  }
  //creating embeding for the query

  const embeddings = await new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
  }).embedQuery(query);
  //doing semantic search
  const joinEmbed = `[${embeddings.join(",")}]`;
  const results = await pool.query(
    `SELECT content 
   FROM "document" 
   WHERE "chatId" = $1 AND "userId" = $2
   ORDER BY embedding <-> $3 
   LIMIT 5`,
    [chatId, userId, joinEmbed]
  );
  const context = results.rows.map((r) => r.content).join("\n\n");

  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(messages),
    system: `You are an expert assistant. Use the following context to answer the user's question as clearly and concisely as possible.

         If the context does not contain the answer, say so honestly. Do not make up information.

         Keep the answer short, relevant, and helpful. and dont give answer in markdown

         Context:
         ${context}
  `,
  });

  return result.toUIMessageStreamResponse();
}
