import { trpc } from "@/app/_trpc/client";
import { toast, useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { ChangeEvent, createContext, useRef, useState } from "react";

type ContextType = {
  message: string;
  isLoading: boolean;
  addMessage: () => void;
  onMessageChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const Context = createContext<ContextType>({
  message: "",
  isLoading: false,
  addMessage: () => {},
  onMessageChange: () => {},
});

export const ChatContext = ({
  children,
  fileId,
}: {
  children: React.ReactNode;
  fileId: string;
}) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backupMessage = useRef("");

  const utils = trpc.useUtils();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async (message: string) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) throw new Error("Something goes wrong");

      return response;
    },
    onMutate: async (newMessage) => {
      backupMessage.current = newMessage;

      await utils.getFileMessages.cancel();

      const previousMessages = utils.getFileMessages.getInfiniteData({
        fileId,
      });

      utils.getFileMessages.setInfiniteData({ fileId }, (old) => {
        if (!old) {
          return {
            pages: [],
            pageParams: [],
          };
        }

        const oldPages = old.pages;
        const newPages = [...oldPages];

        let lastestPage = newPages[0];

        lastestPage.messages = [
          {
            id: "new message",
            message: newMessage,
            isUserMessage: true,
          },
          ...lastestPage.messages,
        ];

        newPages[0] = lastestPage;

        return {
          pages: newPages,
          pageParams: old.pageParams,
        };
      });

      setIsLoading(true);

      return {
        prevMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);

      if (!stream.body) {
        return toast({
          title: "There was some error sending your message",
          description: "Please refresh your page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accResponse = "";

      while (!done) {
        const { value, done: doneReadingStream } = await reader.read();
        done = doneReadingStream;

        const chunkText = decoder.decode(value);
        accResponse += chunkText;

        utils.getFileMessages.setInfiniteData({ fileId }, (old) => {
          if (!old) {
            return {
              pages: [],
              pageParams: [],
            };
          }

          const isAiResponseMsgCreated = old.pages.some((page) =>
            page.messages.some((msg) => msg.id === "stream-ai-response")
          );

          const updatedPages = old.pages.map((page, i) => {
            if (i === 0) {
              if (!isAiResponseMsgCreated) {
                return {
                  ...page,
                  messages: [
                    {
                      id: "stream-ai-response",
                      isUserMessage: false,
                      message: accResponse,
                    },
                    ...page.messages,
                  ],
                };
              } else {
                const updatedMsgs = page.messages.map((msg) => {
                  if (msg.id === "stream-ai-response") {
                    return {
                      ...msg,
                      message: accResponse,
                    };
                  } else return msg;
                });

                return {
                  ...page,
                  messages: updatedMsgs,
                };
              }
            } else return page;
          });

          return {
            ...old,
            pages: updatedPages,
          };
        });
      }
    },
    onError: (e, __, context) => {
      setMessage(backupMessage.current);

      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.prevMessages ?? [] }
      );

      toast({
        title: "Something goes wrong",
        description:
          "There was some error sending your message, Please refresh and try again.",
        variant: "destructive",
      });
    },
    onSettled: async () => {
      setIsLoading(false);

      // await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => {
    if (!message || message.length === 0) {
      return toast({
        title: "No Message Provided",
        description: "Please enter your message and send",
        variant: "destructive",
      });
    }

    sendMessage(message);
    setMessage("");
  };

  const onMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <Context.Provider
      value={{
        message,
        isLoading,
        addMessage,

        onMessageChange,
      }}
    >
      {children}
    </Context.Provider>
  );
};
