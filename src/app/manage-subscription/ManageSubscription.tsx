import { DollarSign } from "lucide-react";
import React from "react";
import { KeyValue } from "./KeyValue";
import { Button, buttonVariants } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";

interface Props {
  subscription: any;
}

export const ManageSubscription = ({ subscription }: Props) => {
  return (
    <div className="max-w-3xl w-full mx-auto flex max-sm:gap-10 flex-col sm:flex-row justify-between p-3 bg-zinc-50 rounded-lg">
      <div className="flex flex-col">
        <h3 className="text-lg font-semibold text-zinc-800">
          Currently subscribed to <span className="text-primary">Pro Plan</span>
        </h3>
        <div className="flex items-end gap-0">
          <DollarSign className="w-6 h-6 mr-1 mb-1" />
          <h2 className="text-4xl font-semibold">10</h2>
          <p className="text-zinc-500 ml-1">\ month</p>
        </div>

        <KeyValue Key="Status:" className="mt-8" value={subscription.status} />

        <KeyValue
          Key="Subscribed At:"
          value={format(new Date(subscription.started_at), "dd MMM yyyy")}
          className="mt-1"
        />

        <KeyValue
          Key="Subscription Renewal At:"
          value={format(new Date(subscription.next_billed_at), "dd MMM yyyy")}
          className="mt-1"
        />

        {/* <KeyValue
          Key="Current Billing Period:"
          value={`${format(
            new Date(subscription.current_billing_period.starts_at),
            "dd MMM yyyy"
          )} - ${format(
            new Date(subscription.current_billing_period.ends_at),
            "dd MMM yyyy"
          )}`}
          className="mt-1"
        /> */}
      </div>

      {subscription.scheduled_change?.action === "cancel" ? (
        <p className="text-red-700">
          Your Subscription will be cancelled on{" "}
          {format(
            new Date(subscription.scheduled_change?.effective_at),
            "dd MMM yyyy"
          )}
        </p>
      ) : (
        <div className="flex flex-col sm:justify-between items-start sm:items-end gap-4">
          <Link
            href={subscription.management_urls.update_payment_method}
            className={buttonVariants()}
          >
            Change Payment Method
          </Link>

          <Link
            href={subscription.management_urls.cancel}
            className={buttonVariants({
              variant: "destructive",
              className: "bg-red-200 hover:bg-red-100 w-fit",
            })}
          >
            Cancel
          </Link>
        </div>
      )}
    </div>
  );
};
