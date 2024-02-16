import { FullWidthWrapper } from "@/components/FullWidthWrapper";
import React from "react";
import { PricingHeader } from "./components/PricingHeader";
import { PricingPlans } from "./components/PricingPlans";

export default function PricingPage() {
  return (
    <div className="bg-zinc-50 min-h-screen">
      <FullWidthWrapper className="flex flex-col gap-20 md:gap-24 pt-16 sm:pt-20 pb-16">
        <PricingHeader />

        <PricingPlans />
      </FullWidthWrapper>
    </div>
  );
}
