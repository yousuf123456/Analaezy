import React from "react";

import { FullWidthWrapper } from "@/components/FullWidthWrapper";
import { PricingHeader } from "./components/PricingHeader";
import { PricingPlans } from "./components/PricingPlans";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getSubscriptionInfo } from "@/lib/paddle/paddle";
import { redirect } from "next/navigation";

export default async function PricingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { isSubscribed } = await getSubscriptionInfo(user?.id);

  if (isSubscribed) redirect("/manage-subscription");

  return (
    <div className="bg-zinc-50 min-h-screen">
      <FullWidthWrapper className="flex flex-col gap-20 md:gap-24 pt-16 sm:pt-20 pb-16">
        <PricingHeader />

        <PricingPlans user={user} />
      </FullWidthWrapper>
    </div>
  );
}
