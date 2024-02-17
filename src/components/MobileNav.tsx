"use client";

import React, { useState } from "react";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import {
  ArrowRight,
  FileSearch,
  Gem,
  LucideIcon,
  Menu,
  PoundSterling,
  X,
} from "lucide-react";
import Link from "next/link";

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { buttonVariants } from "./ui/button";
import { Avatar } from "./Avatar";
import { cn } from "@/utils/utils";

const NavbarItem = ({
  label,
  href,
  Icon,
  iconClassName,
}: {
  href: string;
  label: string;
  Icon?: LucideIcon;
  iconClassName?: string;
}) => {
  return (
    <Link href={href} className="flex items-center gap-5">
      {Icon && <Icon className={cn("w-5 h-5", iconClassName)} />}
      <p className="text-lg text-zinc-700 font-semibold">{label}</p>
    </Link>
  );
};

export const MobileNav = ({
  user,
  isSubscribed,
}: {
  user: KindeUser | null;
  isSubscribed: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const toggleNavbar = () => setOpen((prev) => !prev);

  return (
    <>
      <Menu className="w-6 h-6" onClick={toggleNavbar} />

      {open && (
        <div className="fixed slide-in-from-right-96 px-8 duration-500 inset-0 animate-in no-scrollbar bg-white z-0 scrollbar-none">
          <X
            className="w-4 h-4 absolute top-6 right-4"
            onClick={toggleNavbar}
          />
          <p className="absolute left-4 top-4 font-semibold text-primary text-xl">
            Analaezy
          </p>

          <div className="flex justify-start max-w-sm mx-auto gap-5 mt-20 pb-5 border-b-[1px] border-slate-200">
            {user ? (
              <div className="flex gap-5 items-center">
                <div className="w-9 h-9 flex-shrink-0">
                  <Avatar image={user.picture} />
                </div>
                <p className="text-xl font-semibold line-clamp-1">
                  {user.family_name && user.given_name
                    ? user.given_name + " " + user.family_name
                    : "Your Account"}
                </p>
              </div>
            ) : (
              <>
                <RegisterLink
                  className={buttonVariants({
                    className: "flex items-center gap-2",
                  })}
                >
                  Get Started <ArrowRight className="w-5 h-5" />
                </RegisterLink>
                <LoginLink className={buttonVariants({ variant: "secondary" })}>
                  Login
                </LoginLink>
              </>
            )}
          </div>

          <div className="mx-auto max-w-sm flex flex-col gap-8 mt-12">
            {!user && (
              <NavbarItem
                label="Pricing"
                href="/pricing"
                Icon={PoundSterling}
              />
            )}

            {user && (
              <>
                <NavbarItem
                  label="Dashboard"
                  href="/dashboard"
                  Icon={FileSearch}
                />

                {isSubscribed ? (
                  <NavbarItem
                    label="Manage Subscription"
                    href="/manage-subscription"
                    Icon={PoundSterling}
                  />
                ) : (
                  <NavbarItem
                    Icon={Gem}
                    label="Upgrade"
                    href="/pricing"
                    iconClassName="text-primary w-6 h-6"
                  />
                )}

                <LogoutLink
                  className={buttonVariants({
                    variant: "secondary",
                    className: "mt-8",
                  })}
                >
                  Logout
                </LogoutLink>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
