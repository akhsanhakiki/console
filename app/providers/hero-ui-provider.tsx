"use client";

import { HeroUIProvider } from "@heroui/react";

export function HeroUIClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
