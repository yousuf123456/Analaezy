"use client";

import React from "react";

import { Messages } from "./Messages";
import { ChatInput } from "./ChatInput";
import { trpc } from "@/app/_trpc/client";
import { ChevronLeft, Gem, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChatContext } from "./ChatContext";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";

export const ChatArea = ({
  fileId,
  user,
}: {
  fileId: string;
  user: KindeUser;
}) => {
  const { data, isLoading } = trpc.getFileStatus.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data === "SUCCESS" || data === "FAILED" ? false : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="flex-[0.75] bg-white">
        <div className="flex flex-col gap-0 w-full min-h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-6.5rem)]">
          <div className="flex-1 h-full flex flex-col gap-2 justify-center items-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <h3 className="text-lg font-semibold text-zinc-700">
              We&apos;re preparing your file
            </h3>
          </div>

          <ChatInput isDisabled />
        </div>
      </div>
    );
  }

  if (data === "PROCESSING") {
    return (
      <div className="flex-[0.75] bg-white">
        <div className="flex flex-col gap-0 w-full min-h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-6.5rem)]">
          <div className="flex-1 h-full flex flex-col gap-2 justify-center items-center">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <h3 className="text-lg font-semibold text-zinc-700">
              Processing data
            </h3>
          </div>

          <ChatInput isDisabled />
        </div>
      </div>
    );
  }

  if (data === "FAILED") {
    return (
      <div className="flex-[0.75] bg-white">
        <div className="flex flex-col gap-0 w-full min-h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-6.5rem)]">
          <div className="flex-1 h-full flex flex-col gap-2 justify-center items-center">
            <XCircle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-zinc-700">
              Requires a higher{" "}
              <Link
                href={"/dashboard"}
                className="underline underline-offset-2 text-cyan-500"
              >
                <span className="bg-gradient-to-tr from-primary to-cyan-500 bg-clip-text text-clip text-transparent">
                  Plan
                </span>
              </Link>
            </h3>

            <p className="text-zinc-500 text-sm">
              Your <span className=" font-medium text-zinc-700">Free</span> plan
              does not support PDFs greater than 4MB
            </p>

            <div className="flex w-full justify-center gap-4 mt-12">
              <Link href={"/dashboard"}>
                <Button
                  variant={"ghost"}
                  size={"sm"}
                  className="gap-2 text-zinc-600"
                >
                  <ChevronLeft className="w-3 h-3" /> Back
                </Button>
              </Link>

              <Link href={"/pricing"}>
                <Button variant={"secondary"} size={"sm"} className="gap-2">
                  <Gem className="w-4 h-4 text-primary" /> Change Plan
                </Button>
              </Link>
            </div>
          </div>

          <ChatInput isDisabled />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:flex-[0.75] bg-white">
      <div className="flex flex-col gap-0 min-h-[calc(100vh-5.5rem)] max-h-[calc(100vh-5.5rem)] lg:min-h-[calc(100vh-6.5rem)] lg:max-h-[calc(100vh-6.5rem)] h-full">
        <ChatContext fileId={fileId}>
          <Messages fileId={fileId} user={user} />
          <ChatInput />
        </ChatContext>
      </div>
    </div>
  );
};
