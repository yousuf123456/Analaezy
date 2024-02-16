"use client";

import React, { useEffect, useState } from "react";
import { PlanCard } from "./PlanCard";
import { Paddle, initializePaddle } from "@paddle/paddle-js";

export const PricingPlans = () => {
  const [paddle, setPaddle] = useState<Paddle>();

  useEffect(() => {
    initializePaddle({
      environment: "sandbox",
      token: "test_dd30d2b69c3eaabf013cb2ff9be",
    }).then((paddleInstance: Paddle | undefined) => {
      if (paddleInstance) {
        setPaddle(paddleInstance);
      }
    });
  }, []);

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
    onSubscribe: () =>
      paddle?.Checkout.open({
        items: [{ priceId: process.env.PADDLE_PRICE_ID!, quantity: 1 }],
      }),
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
