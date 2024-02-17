import { cn } from "@/lib/utils";
import React from "react";

interface Props {
  Key: string;
  value: string;
  className?: string;
}

export const KeyValue = ({ Key, value, className }: Props) => {
  return (
    <div className={cn("flex gap-5 items-center", className)}>
      <p className="text-zinc-500">{Key}</p>
      <p className="text-zinc-800 capitalize">{value}</p>
    </div>
  );
};
