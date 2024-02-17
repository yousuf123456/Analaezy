import { FullWidthWrapper } from "@/components/FullWidthWrapper";
import React from "react";
import { PricingHeader } from "./components/PricingHeader";
import { PricingPlans } from "./components/PricingPlans";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function PricingPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return (
    <div className="bg-zinc-50 min-h-screen">
      <FullWidthWrapper className="flex flex-col gap-20 md:gap-24 pt-16 sm:pt-20 pb-16">
        <PricingHeader />

        <PricingPlans user={user} />
      </FullWidthWrapper>
    </div>
  );
}
