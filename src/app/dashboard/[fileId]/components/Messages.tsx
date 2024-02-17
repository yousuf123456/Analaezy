import React, { useContext, useEffect, useRef } from "react";
import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, MessageCircle } from "lucide-react";
import Message from "./Message";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { Context } from "./ChatContext";

import { useInView } from "react-intersection-observer";

export const Messages = ({
  fileId,
  user,
}: {
  fileId: string;
  user: KindeUser;
}) => {
  const { toast } = useToast();

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
      },
      {
        onError: (e) => {
          toast({
            title: "Something goes wrong",
            description: "There was some error fetching your chat history",
            variant: "destructive",
          });
        },
        getNextPageParam: (data) => data.cursor,
        keepPreviousData: true,
      }
    );

  const { isLoading: isAiThinking } = useContext(Context);

  const { ref, inView } = useInView({ threshold: 1 });

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [ref, inView]);

  const messages = [
    ...(isAiThinking
      ? [
          {
            id: "loader",
            message: <Loader2 className=" animate-spin w-5 h-5 text-primary" />,
            isUserMessage: false,
          },
        ]
      : []),
    ...(data?.pages.flatMap((page) => page.messages) || []),
  ];

  const lastDivRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data) {
      lastDivRef.current?.scrollIntoView();
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="w-full flex-1 h-full flex flex-col gap-2 items-center justify-center">
        <Loader2 className=" animate-spin text-primary w-5 h-5" />
        <h3 className="text-lg text-zinc-700 font-semibold">
          Loading messages...
        </h3>
      </div>
    );
  }

  if (!isLoading && (!data || messages.length === 0)) {
    return (
      <div className="w-full flex-1 h-full flex flex-col gap-2 items-center justify-center">
        <MessageCircle className="text-primary w-7 h-7" />
        <h3 className="text-lg text-zinc-700 font-semibold">
          You&apos;re all set!
        </h3>
        <p className="text-sm text-zinc-500">
          Type in your questions and start Analyzing
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col-reverse gap-8 relative w-full flex-1 h-full max-h-full overflow-y-auto p-4 scrollbar-thin scrollbar-track-white scrollbar-thumb-purple-200">
        {messages.map((message, i) => {
          if (i === messages.length - 1) {
            return <Message ref={ref} key={i} message={message} user={user} />;
          }
          return <Message key={i} message={message} user={user} />;
        })}

        {/* <div ref={lastDivRef} className="w-0 h-0" /> */}
      </div>
    </>
  );
};
