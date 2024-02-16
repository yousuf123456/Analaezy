import React from "react";
import prisma from "@/prismadb/db";
import { notFound, redirect } from "next/navigation";
import { PDFRenderer } from "./components/PDFRenderer";
import { ChatArea } from "./components/ChatArea";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

const getFile = async (fileId: string) => {
  return await prisma.file.findFirst({ where: { id: fileId } });
};

interface Params {
  fileId: string;
}

export default async function ({ params }: { params: Params }) {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) return redirect("/sign-in");

  const file = await getFile(fileId);

  if (!file) return notFound();

  return (
    <div className="px-2 py-3 h-full lg:overflow-y-hidden sm:px-4 md:px-8 flex flex-col lg:flex-row gap-6 sm:gap-4 w-full max-w-[1440px] mx-auto bg-zinc-50">
      <PDFRenderer file={file} />

      <ChatArea fileId={file.id} user={user} />
    </div>
  );
}
