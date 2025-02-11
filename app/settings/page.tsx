"use client";
import React, { useState } from "react";
import TabControl from "./components/tabControl";
import ApiKeys from "./components/apiKeys";
import UserManagement from "./components/userManagement";
import BillingPlans from "./components/billingPlans";
import { Input } from "@heroui/react";
import { IoSearch } from "react-icons/io5";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("apiKeys");
  const [filterValue, setFilterValue] = useState("");

  const tabs = [
    { key: "apiKeys", title: "API keys" },
    { key: "userManagement", title: "User management" },
    { key: "billingPlans", title: "Billing and plans" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Settings
      </h1>
      <div className="flex justify-between items-center">
        <TabControl tabs={tabs} setActiveTab={setActiveTab} />
        {activeTab === "apiKeys" && (
          <Input
            isClearable
            className="w-full max-w-[20%]"
            placeholder="Search by name..."
            startContent={<IoSearch />}
            value={filterValue}
            onValueChange={setFilterValue}
          />
        )}
      </div>
      <div className="flex-1">
        {activeTab === "apiKeys" && (
          <ApiKeys setActiveTab={setActiveTab} filterValue={filterValue} />
        )}
        {activeTab === "userManagement" && (
          <UserManagement setActiveTab={setActiveTab} />
        )}
        {activeTab === "billingPlans" && <BillingPlans />}
      </div>
    </div>
  );
};

export default Settings;
