"use client";
import React from "react";
import PipelineList from "./components/pipelineList";
import ExtractFileIcon from "@/public/images/icons/extractFileIcon";
import ExtractionFileList from "./components/extractionFileList";

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

const Extract = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="text-xl font-semibold font-poppins text-foreground-900">
        Extract
      </h1>
      <div className="flex flex-col gap-4 w-full h-full flex-grow">
        <h2 className="text-base font-semibold font-poppins text-foreground-900">
          New
        </h2>
        <PipelineList cards={pipelineCards} />
        <div className="h-1 border-b border-foreground-200"></div>
        <ExtractionFileList />
      </div>
    </div>
  );
};

export default Extract;
