import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, DollarSign, X } from "lucide-react";
import { features } from "process";
import React from "react";

interface PlanCardProps {
  planName: string;
  maxQuota: number;
  planPricing: number;
  mostPopular?: boolean;
  isCurrentPlan?: boolean;
  planDescription: string;
  onSubscribe?: () => void;
  planFeatures: {
    feature: string;
    availaible: boolean;
  }[];
}

export const PlanCard = ({
  planName,
  maxQuota,
  planPricing,
  onSubscribe,
  mostPopular,
  planFeatures,
  isCurrentPlan,
  planDescription,
}: PlanCardProps) => {
  return (
    <div
      className={cn(
        "max-w-96 w-full bg-white shadow-lg rounded-xl",
        mostPopular && "bg-black"
      )}
    >
      <div className="px-6 py-6 flex flex-col gap-6 items-start">
        <div className="flex flex-col">
          <h3
            className={cn(
              "text-xl font-semibold",
              mostPopular && "text-slate-100"
            )}
          >
            {planName}
          </h3>
          <p
            className={cn(
              "text-sm text-zinc-500 mt-1 max-w-[220px]",
              mostPopular && "text-slate-400"
            )}
          >
            {planDescription}
          </p>
        </div>

        <div className="flex gap-0 justify-center items-end">
          <DollarSign
            className={cn("w-9 h-9 mb-1", mostPopular && "text-slate-100")}
          />
          <h2
            className={cn(
              "font-semibold text-5xl",
              mostPopular && "text-slate-100"
            )}
          >
            {planPricing}
          </h2>
          <p
            className={cn(
              "text-zinc-500 ml-2",
              mostPopular && " text-slate-400"
            )}
          >
            \ month
          </p>
        </div>

        {isCurrentPlan ? (
          <Button variant={"outline"} className="w-full">
            Current Plan
          </Button>
        ) : (
          <Button className="w-full" onClick={onSubscribe}>
            Subscribe
          </Button>
        )}

        <div
          className={cn(
            "mx-auto rounded-3xl bg-white shadow-sm border border-purple-200 px-3 py-0.5",
            mostPopular && "bg-black border-slate-700 shadow-slate-700"
          )}
        >
          <p
            className={cn(
              "text-zinc-700 text-sm",
              mostPopular && "text-slate-400"
            )}
          >
            Max {maxQuota} PDFs per month
          </p>
        </div>

        <ul className="flex flex-col gap-4 mt-12">
          {planFeatures.map((feature, i) => (
            <li key={i}>
              <div className="flex items-center gap-4">
                {feature.availaible ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-red-500" />
                )}

                <p
                  className={cn(
                    "text-sm text-zinc-800",
                    mostPopular && "text-slate-300"
                  )}
                >
                  {feature.feature}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
