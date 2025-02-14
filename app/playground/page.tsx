"use client";
import React, { useState } from "react";
import PipelineList from "./components/playgorundList";
import ExtractFileIcon from "@/public/images/icons/extractFileIcon";
import PlaygroundFileList from "./components/playgroundFileList";
import NewPlayground from "./components/playground";
import { IoArrowBack } from "react-icons/io5";
import ChevronDown from "@/public/images/icons/chevronDown";

const pipelineCards = [
  {
    title: "Bank Statement",
    icon: ExtractFileIcon,
    description:
      "Extract information from bank statements such as account number, balance, and other financial information.",
    state: "active" as const,
  },
  {
    title: "General Documents",
    icon: ExtractFileIcon,
    description:
      "Extract information from general documents such as invoices, receipts, and other business documents.",
    state: "disabled" as const,
  },
  {
    title: "Credit Card Application",
    icon: ExtractFileIcon,
    description:
      "Extract information from credit card applications such as name, address, and other personal information.",
    state: "disabled" as const,
  },
  {
    title: "Insurance Policy",
    icon: ExtractFileIcon,
    description:
      "Extract information from insurance policies such as policy number, coverage, and other insurance details.",
    state: "disabled" as const,
  },
  {
    title: "Loan Agreement",
    icon: ExtractFileIcon,
    description:
      "Extract information from loan agreements such as loan amount, interest rate, and other loan details.",
    state: "disabled" as const,
  },
  {
    title: "Mortgage Agreement",
    icon: ExtractFileIcon,
    description:
      "Extract information from mortgage agreements such as property details, loan amount, and other mortgage details.",
    state: "disabled" as const,
  },
  {
    title: "Property Deed",
    icon: ExtractFileIcon,
    description:
      "Extract information from property deeds such as property details, ownership, and other property details.",
    state: "disabled" as const,
  },
  {
    title: "Vehicle Registration",
    icon: ExtractFileIcon,
    description:
      "Extract information from vehicle registration documents such as vehicle details, ownership, and other vehicle details.",
    state: "disabled" as const,
  },
];

const Playground = () => {
  const [newPlayground, setNewPlayground] = useState("");
  const [currentView, setCurrentView] = useState<"list" | "new" | "playground">(
    "list"
  );
  const [playgroundName, setPlaygroundName] = useState("");

  const handleBack = () => {
    setNewPlayground("");
    setCurrentView("list");
    setPlaygroundName("");
  };

  const handleNewPlayground = (name: string) => {
    setNewPlayground(name);
    setCurrentView("new");
    setPlaygroundName(name);
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <div className="cursor-pointer" onClick={handleBack}>
          <h1 className="text-xl font-semibold font-poppins text-foreground-900">
            Playground
          </h1>
        </div>
        {(currentView === "new" || currentView === "playground") && (
          <>
            <ChevronDown className="-rotate-90" />
            <h2 className="text-sm font-medium font-poppins text-foreground-900">
              {playgroundName}
            </h2>
          </>
        )}
      </div>
      <div className="flex flex-col gap-4 w-full h-full flex-grow">
        {currentView === "list" ? (
          <>
            <h2 className="text-base font-semibold font-poppins text-foreground-700">
              New
            </h2>
            <PipelineList
              cards={pipelineCards}
              setNewPlayground={handleNewPlayground}
            />
            <div className="h-1 border-b border-foreground-200"></div>
            <PlaygroundFileList
              setPlaygroundName={setPlaygroundName}
              setCurrentView={setCurrentView}
            />
          </>
        ) : (
          <NewPlayground
            onBack={handleBack}
            onNext={() => {}}
            pipelineType={newPlayground}
            playgroundName={
              currentView === "playground" ? playgroundName : undefined
            }
          />
        )}
      </div>
    </div>
  );
};

export default Playground;
