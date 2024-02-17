import React from "react";

import Link from "next/link";
import { FullWidthWrapper } from "./FullWidthWrapper";
import { buttonVariants } from "./ui/button";

import {
  LoginLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { ArrowRight } from "lucide-react";
import { UserAccountPopover } from "./UserAccountPopover";
import { MobileNav } from "./MobileNav";
import { getSubscriptionInfo } from "@/lib/paddle/paddle";

export const Navbar = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { isSubscribed } = await getSubscriptionInfo(user?.id);

  return (
    <div className="sticky top-0 left-0 bg-white py-4 border-b-[1px] border-slate-300 z-50">
      <FullWidthWrapper>
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <p className="font-semibold text-lg ">Analaezy.</p>
          </Link>

          <div className="sm:hidden">
            <MobileNav user={user} isSubscribed={isSubscribed} />
          </div>

          <div className="sm:flex gap-5 items-center hidden">
            {!user ? (
              <>
                <Link
                  href={"/pricing"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "ghost",
                    className: "text-base",
                  })}
                >
                  Pricing
                </Link>

                <LoginLink
                  className={buttonVariants({
                    variant: "secondary",
                    size: "sm",
                    className: "text-base",
                  })}
                >
                  Login
                </LoginLink>

                <RegisterLink
                  className={buttonVariants({
                    size: "sm",
                    className: "text-base gap-2",
                  })}
                >
                  Get Started{" "}
                  <ArrowRight className="w-4 h-4 text-primary-foreground" />
                </RegisterLink>
              </>
            ) : (
              <>
                <Link
                  href={"/dashboard"}
                  className={buttonVariants({
                    size: "sm",
                    variant: "outline",
                    className:
                      "text-base text-primary border-primary/100 hover:bg-primary/5 hover:text-primary",
                  })}
                >
                  Dashboard
                </Link>

                <UserAccountPopover
                  email={user.email}
                  image={user.picture}
                  isSubscribed={isSubscribed}
                  name={
                    user.given_name && user.family_name
                      ? `${user.given_name} ${user.family_name}`
                      : "Your Account"
                  }
                />
              </>
            )}
          </div>
        </div>
      </FullWidthWrapper>
    </div>
  );
};
