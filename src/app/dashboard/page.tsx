import React from "react";

import prisma from "@/prismadb/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import { Dashboard } from "./components/Dashboard";

export default async function Page() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) return redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) return redirect("/auth-callback?origin=dashboard");

  return <Dashboard />;
}
