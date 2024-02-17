import React from "react";

export const PricingHeader = () => {
  return (
    <div className="mx-auto flex-col flex items-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-center">
        Pricing plans matching needs of all!
      </h1>
      <p className="text-sm sm:text-base text-zinc-500 max-w-2xl text-center mt-4 capitalize">
        Explore our flexible pricing options and choose the subscription plan
        that aligns perfectly with your budget, scale, and feature requirements.
      </p>
    </div>
  );
};
