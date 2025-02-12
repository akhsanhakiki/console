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
import { usePathname } from "next/navigation";
import { HeroUIClientProvider } from "./providers/hero-ui-provider";

import { Providers } from "./providers";

import { fontSans } from "@/config/fonts";
import SideNavbar from "@/general-components/sideNavbar";
import { HeaderBar } from "@/general-components/header";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthRoute =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");

  const withoutSidebar = pathname.startsWith("/workspace");

  return (
    <ClerkProvider>
      <html suppressHydrationWarning lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body
          className={clsx(
            "min-h-screen bg-background font-sans antialiased",
            fontSans.variable,
            inter.className
          )}
        >
          <HeroUIClientProvider>
            <Providers
              themeProps={{ attribute: "class", defaultTheme: "systemDefault" }}
            >
              <div className="relative flex flex-col h-screen">
                {!isAuthRoute && <HeaderBar />}
                <div className={clsx("flex flex-row", { grow: !isAuthRoute })}>
                  {!isAuthRoute && !withoutSidebar && <SideNavbar />}
                  <main
                    className={clsx("w-full", {
                      "flex-grow px-4 overflow-hidden": !isAuthRoute,
                      "w-full h-full": isAuthRoute,
                    })}
                  >
                    {children}
                  </main>
                </div>
              </div>
            </Providers>
          </HeroUIClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
