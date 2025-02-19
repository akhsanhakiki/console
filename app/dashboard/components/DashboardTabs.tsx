"use client";

import { Tab, Tabs } from "@heroui/react";

export default function DashboardTabs() {
  return (
    <Tabs key="size" aria-label="Tabs sizes" size="sm">
      <Tab key="daily" title="Daily" />
      <Tab key="weekly" title="Weekly" />
      <Tab key="monthly" title="Monthly" />
      <Tab key="yearly" title="Yearly" />
    </Tabs>
  );
}
