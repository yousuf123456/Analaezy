"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";

export default function Page() {
  const router = useRouter();
  const origin = useSearchParams().get("origin");

  trpc.authCallback.useQuery(undefined, {
    onSuccess: (data) => {
      if (data.success) {
        return origin ? router.push(`/${origin}`) : router.push("dashboard");
      }
    },

    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") {
        return router.push("/sign-in");
      }
      console.log(err);
    },

    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="mt-36 w-full flex gap-5 justify-center items-center">
      <Loader2 className="animate-spin text-zinc-700 w-8 h-8" />
      <div className="flex flex-col">
        <p className="text-xl font-semibold text-zinc-600">
          Creating your account.
        </p>
        <p className=" text-zinc-600">You will be redirected automatically.</p>
      </div>
    </div>
  );
}
