import { Tabs, Tab } from "@heroui/react";
import React from "react";

interface TabControlProps {
  tabs: { key: string; title: string }[];
  setActiveTab: (tab: string) => void;
}

const TabControl = ({ tabs, setActiveTab }: TabControlProps) => {
  return (
    <Tabs
      variant="underlined"
      className="font-poppins"
      onSelectionChange={(key) => setActiveTab(key.toString())}
    >
      {tabs.map((tab) => (
        <Tab key={tab.key} title={tab.title} />
      ))}
    </Tabs>
  );
};

export default TabControl;
