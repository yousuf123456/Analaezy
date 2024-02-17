import React from "react";

import { redirect } from "next/navigation";
import { getSubscriptionInfo } from "@/lib/paddle/paddle";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default async function ManageSubsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { isSubscribed } = await getSubscriptionInfo(user?.id);

  if (!isSubscribed) return redirect("pricing");

  return <div>ManageSubsPage</div>;
}
