import React from "react";

import { redirect } from "next/navigation";
import { getSubscriptionInfo } from "@/lib/paddle/paddle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { FullWidthWrapper } from "@/components/FullWidthWrapper";
import { ManageSubscription } from "./ManageSubscription";

export default async function ManageSubsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { isSubscribed, subscription } = await getSubscriptionInfo(user?.id);

  if (!isSubscribed) return redirect("pricing");

  return (
    <div>
      <FullWidthWrapper className="flex flex-col gap-16 mt-12 sm:mt-20">
        <h1 className="text-2xl sm:text-3xl font-semibold text-center">
          Manage Your Subscription
        </h1>

        <ManageSubscription subscription={subscription} />
      </FullWidthWrapper>
    </div>
  );
}
