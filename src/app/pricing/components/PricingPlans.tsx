"use client";

import React, { useEffect, useState } from "react";

import { PlanCard } from "./PlanCard";
import {
  Paddle,
  initializePaddle,
  CheckoutOpenOptions,
} from "@paddle/paddle-js";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import { useRouter } from "next/navigation";

export const PricingPlans = ({ user }: { user: KindeUser | null }) => {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: "test_dd30d2b69c3eaabf013cb2ff9be",
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
        paddleInstance.Setup({
          token: "test_dd30d2b69c3eaabf013cb2ff9be",
          eventCallback: (event) => {
            console.log(event);
          },
        });
      }
    });
  }, []);

  const router = useRouter();

  const onSubscribeToPro = () => {
    if (!user) return router.push("/sign-in");

    if (!paddle) return;

    paddle?.Checkout.open({
      items: [{ priceId: "pri_01hprh7q90ay91ywf3r00gwsmz", quantity: 1 }],
      settings: {
        displayMode: "overlay",
        showAddDiscounts: false,
      },
      customer: {
        email: user.email ?? "",
      },
      customData: {
        userId: user.id,
      },
    });
  };

  const plan1 = {
    planName: "Free",
    planPricing: 0,
    maxQuota: 10,
    planDescription: "Get Started for Free: Fullfill your basic needs",
    planFeatures: [
      {
        feature: "Quick and seamless file uploads",
        availaible: true,
      },
      {
        feature: "4MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
        availaible: true,
      },
      {
        feature: "Mobile-friendly interface",
        availaible: true,
      },
      {
        feature: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        availaible: false,
      },
      {
        feature: "Priority support",
        availaible: false,
      },
    ],
  };

  const plan2 = {
    planName: "Pro",
    planPricing: 12,
    maxQuota: 50,
    planDescription: "Unlock Most Potential: Upgrade for larger data!",
    onSubscribe: onSubscribeToPro,
    planFeatures: [
      {
        feature: "Quick and seamless file uploads",
        availaible: true,
      },
      {
        feature: "16MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
        availaible: true,
      },
      {
        feature: "Mobile-friendly interface",
        availaible: true,
      },
      {
        feature: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        availaible: true,
      },
      {
        feature: "Priority support",
        availaible: true,
      },
    ],
  };

  return (
    <div className="mx-auto flex flex-col justify-around gap-16 md:gap-5 md:flex-row items-center max-w-4xl w-full">
      <PlanCard {...plan1} isCurrentPlan />

      <PlanCard {...plan2} mostPopular />
    </div>
  );
};
