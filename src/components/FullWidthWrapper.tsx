import { cn } from "@/utils/utils";
import React from "react";

export const FullWidthWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full mx-auto max-w-screen-xl px-3 sm:px-12 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};
