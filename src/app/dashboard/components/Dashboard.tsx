"use client";
import React, { useState } from "react";

import { trpc } from "@/app/_trpc/client";
import { UploadFile } from "./UploadFile";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Ghost, Plus, GanttChartSquare, Trash, Loader2 } from "lucide-react";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const Dashboard = ({ isSubscribed }: { isSubscribed: boolean }) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    null | string
  >(null);

  const utils = trpc.useUtils();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate } = trpc.deleteFile.useMutation({
    onMutate: (input) => {
      setCurrentlyDeletingFile(input.fileId);
    },
    onSettled: () => {
      setCurrentlyDeletingFile(null);
    },
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });

  return (
    <div className="mt-10 min-[460px]:mt-16 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-12">
        <div className="flex  max-[460px]:gap-6 max-[460px]:flex-col justify-between items-center">
          <h1 className="text-3xl sm:text-4xl font-bold">My Files</h1>

          <UploadFile isSubscribed={isSubscribed} />
        </div>

        {files && files.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <li key={file.id}>
                <div className="py-3 px-4 bg-purple-50/50 rounded-lg border-[1px] border-primary/10 transition hover:border-primary/40">
                  <Link href={`/dashboard/${file.id}`}>
                    <div className="flex items-center gap-5">
                      <div className="w-6 h-6 bg-gradient-to-tr rounded-full from-purple-500 to-pink-500" />

                      <p className="text-xl truncate font-semibold">
                        {file.name}
                      </p>
                    </div>
                  </Link>
                  <div className="grid grid-cols-3 gap-4 place-content-center place-items-center mt-5">
                    <div className="flex items-center gap-1">
                      <Plus className="w-4 h-4 text-zinc-400 flex-shrink-0" />

                      <p className="text-sm text-zinc-500">
                        {format(new Date(file.createdAt), "MMM yyyy")}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <GanttChartSquare className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                      <p className="text-sm text-zinc-500">5</p>
                    </div>

                    <div className="flex items-center gap-2 w-full">
                      <Button
                        className="flex-1 h-8 bg-white text-red-500 border-[1px] border-red-200"
                        onClick={() => mutate({ fileId: file.id })}
                        variant={"destructive"}
                        size={"sm"}
                      >
                        {currentlyDeletingFile &&
                        currentlyDeletingFile === file.id ? (
                          <Loader2 className="animate-spin w-4 h-4 text-red-500" />
                        ) : (
                          <Trash className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : isLoading ? (
          <Skeleton count={3} height={100} className="w-full my-3" />
        ) : (
          <div className="mt-24 flex items-center justify-center flex-col gap-0">
            <Ghost className="h-12 w-12 text-zinc-600/60" />

            <h3 className="mt-6 text-2xl font-medium text-zinc-600">
              It&apos;s all empty
            </h3>

            <p className="text-lg text-zinc-600">
              Let&apos;s upload your first file
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
