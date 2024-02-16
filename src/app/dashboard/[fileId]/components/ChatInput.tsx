import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Send } from "lucide-react";
import React, { useContext, useRef } from "react";
import { Context } from "./ChatContext";

export const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { addMessage, message, onMessageChange, isLoading } =
    useContext(Context);

  const inputRef = useRef<HTMLTextAreaElement>(null);

  const sendMessage = (e: any) => {
    e?.preventDefault && e.preventDefault();

    addMessage();

    inputRef.current?.focus();
  };

  const onKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage(e);
    }
  };

  return (
    <div className="pt-2 sm:pt-4 bg-white">
      <div className="h-fit w-full mx-auto px-1 sm:px-4 lg:px-2 max-w-2xl">
        <div className="relative">
          <Textarea
            rows={1}
            maxRows={4}
            value={message}
            disabled={isDisabled}
            onKeyDown={onKeyPress}
            onChange={onMessageChange}
            placeholder="Enter your question here.."
            className="resize-none pr-9 py-3 border-zinc-300"
          />

          <Button
            size={"sm"}
            onClick={sendMessage}
            disabled={isDisabled || isLoading || message.length === 0}
            className="absolute right-3 top-1/2 -translate-y-1/2 focus-within:scale-95 h-fit px-1.5 py-1.5"
          >
            <ArrowUp className="w-5 h-5 z-10 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
};
