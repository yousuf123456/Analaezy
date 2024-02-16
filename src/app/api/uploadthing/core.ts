import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";

import prisma from "@/prismadb/db";
import { PineconeClient } from "@/pinecone/pinecone";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      // If you throw, the user will not be able to upload
      if (!user || !user.id) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const userId = metadata.userId;

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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
