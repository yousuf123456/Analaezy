import { Input } from "@/components/ui/input";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { router, publicProcedure, protectedProcedure } from "./trpc";
import { TRPCError } from "@trpc/server";
import prisma from "@/prismadb/db";
import { string, z } from "zod";
import { MESSAGES_LIMIT } from "@/config/infinite-query";

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user || !user.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    const dbUser = await prisma?.user.findUnique({
      where: {
        id: user.id,
      },
    });

    if (!dbUser) {
      await prisma?.user.create({
        data: {
          id: user.id,
          email: user.email!,
        },
      });
    }

    return { success: true };
  }),

  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;

    return await prisma.file.findMany({
      where: {
        userId,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
      take: 15,
    });
  }),

  deleteFile: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedFile = await prisma.file.delete({
        where: {
          id: input.fileId,
        },
      });

      if (!deletedFile) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      return "Succesfully deleted the file";
    }),

  getFile: protectedProcedure
    .input(z.object({ key: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.userId;

      const file = await prisma.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      return file;
    }),
  getFileStatus: protectedProcedure
    .input(z.object({ fileId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;

      const file = await prisma.file.findUnique({
        where: {
          id: input.fileId,
        },
      });

      if (!file) return "PENDING" as const;

      return file.uploadStatus;
    }),

  getFileMessages: protectedProcedure
    .input(
      z.object({
        fileId: z.string(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, limit, cursor } = input;

      const file = await prisma.file.findUnique({
        where: {
          id: fileId,
        },
      });

      if (!file) throw new TRPCError({ code: "NOT_FOUND" });

      const messages = await prisma.message.findMany({
        take: (limit ?? MESSAGES_LIMIT) + 1,
        cursor: cursor
          ? {
              id: cursor,
            }
          : undefined,
        where: {
          fileId: fileId,
          userId: userId,
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          message: true,
          isUserMessage: true,
        },
      });

      let newCursor: string | undefined = undefined;
      if (messages.length > (limit ?? MESSAGES_LIMIT)) {
        const lastMessage = messages.pop();
        newCursor = lastMessage?.id;
      }

      return {
        messages,
        cursor: newCursor,
      };
    }),
});

export type AppRouter = typeof appRouter;
