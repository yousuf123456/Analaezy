import React, { forwardRef } from "react";
import { Avatar } from "@/components/Avatar";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { Bot } from "lucide-react";

import ReactMarkdown from "react-markdown";
import { ExtendedMessage } from "@/types";

export type Ref = HTMLDivElement;

const Message = forwardRef<
  Ref,
  {
    message: ExtendedMessage;
    user: KindeUser;
  }
>(({ message, user }, ref) => {
  return (
    <div className="flex items-start gap-5" ref={ref}>
      {message.isUserMessage ? (
        <div className="w-6 h-6 flex-shrink-0">
          <Avatar image={user.picture} />
        </div>
      ) : (
        <Bot className="rounded-full text-zinc-600 w-6 h-6 flex-shrink-0" />
      )}

      <div className="flex flex-col gap-0">
        <h3 className="text-zinc-700 font-semibold">
          {message.isUserMessage ? "You" : "Analyzer"}
        </h3>

        <p className="text-zinc-700 bg-zinc-50 py-2 px-4 rounded-md">
          {typeof message.message === "string" ? (
            <ReactMarkdown className={"prose"}>{message.message}</ReactMarkdown>
          ) : (
            message.message
          )}
        </p>
      </div>
    </div>
  );
});

Message.displayName = "Message";
export default Message;
