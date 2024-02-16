import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cn } from "../utils/utils";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import "simplebar-react/dist/simplebar.min.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <Providers>
        <body
          className={cn(
            inter.className,
            "font-sans min-h-screen antialiased grainy "
          )}
        >
          <Navbar />
          <Toaster />
          {children}
        </body>
      </Providers>
    </html>
  );
}
