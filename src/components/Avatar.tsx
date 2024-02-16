import React from "react";
import Image from "next/image";

export const Avatar = ({ image }: { image: string | undefined | null }) => {
  return (
    <div className="relative w-full h-full rounded-full overflow-hidden hover:opacity-75 transition-opacity cursor-pointer">
      <Image
        fill
        src={image || "/placeholder.jpg"}
        alt="Avatar Image"
        className="object-cover object-center"
      />
    </div>
  );
};
