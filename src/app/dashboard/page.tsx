import React from "react";

import prisma from "@/prismadb/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Dashboard } from "./components/Dashboard";
import { getSubscriptionInfo } from "@/lib/paddle/paddle";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) return redirect("/api/auth/login");

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) return redirect("/auth-callback?origin=dashboard");

  const { isSubscribed } = await getSubscriptionInfo(user.id);

  return <Dashboard isSubscribed={isSubscribed} />;
}
