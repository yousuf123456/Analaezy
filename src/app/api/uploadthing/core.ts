import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

import prisma from "@/prismadb/db";
import { PineconeClient } from "@/pinecone/pinecone";
import { PagesPerPdf } from "@/config/subscription-limits";
import { getSubscriptionInfo } from "@/lib/paddle/paddle";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new UploadThingError("Unauthorized");

  const { isSubscribed } = await getSubscriptionInfo(user.id);

  // Whatever is returned here is accessible in onUploadComplete as `metadata`
  return { userId: user.id, isSubscribed };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: { key: string; url: string; name: string };
}) => {
  const userId = metadata.userId;

  const isFileThere = await prisma.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileThere) return;

  const createdFile = await prisma.file.create({
    data: {
      user: {
        connect: {
          id: userId,
        },
      },
      url: file.url,
      key: file.key,
      name: file.name,
      uploadStatus: "PROCESSING",
    },
  });

  try {
    const pdf = await fetch(file.url);

    const blob = await pdf.blob();

    const loader = new PDFLoader(blob);

    const docs = await loader.load();

    const noOfPages = docs.length;
    const { free, pro } = PagesPerPdf;

    const { isSubscribed } = metadata;

    if (
      (isSubscribed && noOfPages > pro) ||
      (!isSubscribed && noOfPages > free)
    ) {
      await prisma.file.update({
        where: {
          id: createdFile.id,
        },
        data: {
          uploadStatus: "FAILED",
        },
      });

      return;
    }

    const pinecone = PineconeClient;
    const pineconeIndex = PineconeClient.Index("analaezy");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: pineconeIndex,
      namespace: createdFile.id,
    });

    await prisma.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "SUCCESS",
      },
    });
  } catch (e) {
    console.log(e);
    await prisma.file.update({
      where: {
        id: createdFile.id,
      },
      data: {
        uploadStatus: "FAILED",
      },
    });
  }

  return { uploadedBy: metadata.userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  freeFileUploader: f({ pdf: { maxFileSize: "1GB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),

  proFileUploader: f({ pdf: { maxFileSize: "1GB" } })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
