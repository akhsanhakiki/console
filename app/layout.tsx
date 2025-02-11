"use client";

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "@/styles/globals.css";
import clsx from "clsx";
import { Inter } from "next/font/google";
import { HeroUIClientProvider } from "./providers/hero-ui-provider";
import { usePathname } from "next/navigation";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import SideNavbar from "@/general-components/sideNavbar";
import { HeaderBar } from "@/general-components/header";
import RootLayoutContent from "./rootLayoutContent";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    // Initialize MSW
    const initMocks = async () => {
      const { worker } = await import("../mocks/browser");
      await worker.start({
        onUnhandledRequest: "bypass",
      });
    };

    initMocks();
  }

  return (
    <ClerkProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ClerkProvider>
  );
}
