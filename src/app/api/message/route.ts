import { PineconeStore } from "@langchain/pinecone";
import prisma from "@/prismadb/db";
import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import { z } from "zod";
import { openai } from "@/lib/openai/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeClient } from "@/pinecone/pinecone";

import { StreamingTextResponse, OpenAIStream } from "ai";

const bodyType = z.object({
  fileId: z.string(),
  message: z.string(),
});

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    const userId = user?.id;

    if (!user || !userId)
      return new NextResponse("Unauthorized", { status: 401 });

    const body = await req.json();
    const { fileId, message } = bodyType.parse(body);

    const file = await prisma.file.findUnique({
      where: {
        id: fileId,
      },
    });

    if (!file) return new NextResponse("Not Found", { status: 404 });

    const createdMessage = await prisma.message.create({
      data: {
        isUserMessage: true,
        message,
        fileId,
        userId,
      },
    });

    // Vectorize the message and send to LLM model
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const pinecone = PineconeClient;
    const index = pinecone.Index("analaezy");

    const store = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      namespace: fileId,
    });

    const vectorResults = await store.similaritySearch(message, 4);

    const prevMessages = await prisma.message.findMany({
      take: 8,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        fileId: fileId,
      },
      select: {
        message: true,
        isUserMessage: true,
      },
    });

    console.log(prevMessages);
    const formattedPrevMessages = prevMessages.map((message) => ({
      role: message.isUserMessage ? "user" : "assistant",
      content: message.message,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format.",
        },
        {
          role: "user",
          content: `Use the following pieces of context (or previous conversaton if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
        
  \n----------------\n
  
  PREVIOUS CONVERSATION:
  ${formattedPrevMessages.map((message) => {
    if (message.role === "user") return `User: ${message.content}\n`;
    return `Assistant: ${message.content}\n`;
  })}
  
  \n----------------\n
  
  CONTEXT:
  ${vectorResults.map((r) => r.pageContent).join("\n\n")}
  
  USER INPUT: ${message}`,
        },
      ],
    });

    const stream = OpenAIStream(response, {
      onCompletion: async (completion) => {
        await prisma.message.create({
          data: {
            isUserMessage: false,
            message: completion,
            userId: userId,
            fileId: fileId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (e) {
    console.log(e);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
