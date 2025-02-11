"use client";
import React from "react";
import { Tabs, Tab, Tooltip } from "@heroui/react";
import TotalProcessingTimeIcon from "@/public/images/icons/totalProcessingTimeIcon";
import ExtractionQuotaIcon from "@/public/images/icons/extractionQuotaIcon";
import ExtractedPageIcon from "@/public/images/icons/extractedPageIcon";
import AvgTimerperPageIcon from "@/public/images/icons/avgTimerperPageIcon";
import { FiInfo } from "react-icons/fi";

const Dashboard = () => {
  // Store the card data in an array
  const cardData = [
    {
      title: "Documents Processed",
      value: 420,
      description: "Total documents processed this month.",
    },
    {
      title: "Pipeline Created",
      value: 24,
      description: "Pipelines created by users.",
    },
    {
      title: "Doc type Created",
      value: 48,
      description: "Document types created by users.",
    },
    {
      title: "Schema Created",
      value: 30,
      description: "Schema created by users.",
    },
  ];

  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="flex flex-row justify-between">
        <h1 className="text-xl font-semibold font-poppins text-foreground-900 ">
          Dashboard
        </h1>
        <Tabs key="size" aria-label="Tabs sizes" size="sm">
          <Tab key="daily" title="Daily" />
          <Tab key="weekly" title="Weekly" />
          <Tab key="monthly" title="Monthly" />
          <Tab key="yearly" title="Yearly" />
        </Tabs>
      </div>
      <div className="flex flex-col gap-4 flex-grow">
        {/* Card Data */}
        <div className="flex flex-row gap-4">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl p-4 w-1/4"
            >
              <div className="flex flex-row items-center justify-between">
                <h2 className="text-sm font-poppins font-medium text-foreground-500">
                  {card.title}
                </h2>
                <Tooltip content={card.description}>
                  <FiInfo className="w-4 h-4 text-foreground-500 cursor-pointer" />
                </Tooltip>
              </div>
              <p className="text-xl font-poppins font-semibold text-foreground-900">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Chart Data */}
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl w-3/5 p-4">
            <div className="flex flex-row justify-between">
              <h2 className="text-sm font-poppins font-semibold text-foreground-900">
                Extracted Documents
              </h2>
              <Tooltip content="Extracted Documents">
                <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
              </Tooltip>
            </div>
            <div>
              <h2>Chart</h2>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-2/5">
            <div className="flex flex-row gap-4">
              {/* Total Page Extracted */}
              <div className="flex flex-col bg-gradient-to-br from-[#09FF8D] to-[#0CD9E7] rounded-2xl gap-4 p-4 w-1/2">
                <div className="flex flex-row justify-between">
                  <ExtractedPageIcon className="w-10 h-10 p-2 bg-white bg-opacity-70 rounded-2xl text-black" />
                  <Tooltip content="Total pages extracted">
                    <FiInfo className="w-4 h-4 text-black cursor-pointer" />
                  </Tooltip>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <h2 className="text-xl font-poppins font-semibold text-black">
                      1,245
                    </h2>
                    <p className="text-base font-poppins font-medium text-black">
                      pages
                    </p>
                  </div>
                  <p className="text-sm font-poppins font-medium text-black">
                    Total pages extracted
                  </p>
                </div>
              </div>

              {/* Extraction Quota */}
              <div className="flex flex-col bg-foreground-200 rounded-2xl gap-4 p-4 w-1/2">
                <div className="flex flex-row justify-between">
                  <ExtractionQuotaIcon className="w-10 h-10 p-2 bg-background bg-opacity-70 rounded-2xl text-foreground-900" />
                  <Tooltip content="Extraction quota">
                    <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                  </Tooltip>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <h2 className="text-xl font-poppins font-semibold text-black">
                      64/10,000
                    </h2>
                    <p className="text-base font-poppins font-medium text-black">
                      pages
                    </p>
                  </div>
                  <p className="text-sm font-poppins font-medium text-foreground-500">
                    Extraction quota
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-4">
              {/* Total Processing Time */}
              <div className="flex flex-col bg-foreground-200 rounded-2xl gap-4 p-4 w-1/2">
                <div className="flex flex-row justify-between">
                  <TotalProcessingTimeIcon className="w-10 h-10 p-2 bg-background bg-opacity-70 rounded-2xl text-foreground-900" />
                  <Tooltip content="Total processing time">
                    <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                  </Tooltip>
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row items-center gap-2">
                    <h2 className="text-xl font-poppins font-semibold text-black">
                      41 min 30 s
                    </h2>
                  </div>
                  <p className="text-sm font-poppins font-medium text-foreground-500">
                    Total processing time
                  </p>
                </div>
              </div>

              {/* Avg. time/page*/}
              <div className="flex flex-col bg-foreground-200 rounded-2xl gap-4 p-4 w-1/2">
                <div className="flex flex-row justify-between">
                  <AvgTimerperPageIcon className="w-10 h-10 p-2 bg-background bg-opacity-70 rounded-2xl text-foreground-900" />
                  <Tooltip content="Avg. time/page">
                    <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                  </Tooltip>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-poppins font-semibold text-foreground-900">
                    2.31 s
                  </h2>
                  <p className="text-sm font-poppins font-medium text-foreground-500">
                    Avg. time/page
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Extraction Logs */}
        <div className="flex flex-row gap-4 w-full h-full flex-grow">
          <div className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl w-3/5 p-4">
            <div className="flex flex-row justify-between">
              <h2 className="text-sm font-poppins font-semibold text-foreground-900">
                Extraction Log
              </h2>
              <Tooltip content="Extraction Log">
                <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-2/5">
            <div className="flex flex-col border-1 border-foreground-200 rounded-2xl gap-4 p-4 flex-grow">
              <div className="flex flex-row justify-between">
                <h2 className="text-sm font-poppins font-semibold text-foreground-900">
                  Pipeline Usage
                </h2>
                <Tooltip content="Extraction Log">
                  <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="flex flex-row gap-4">Chart</div>
            </div>
            <div className="flex flex-col border-1 border-foreground-200 rounded-2xl gap-4 p-4 flex-grow">
              <div className="flex flex-row justify-between">
                <h2 className="text-sm font-poppins font-semibold text-foreground-900">
                  Schema Usage
                </h2>
                <Tooltip content="Schema Usage">
                  <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="flex flex-row gap-4">Chart</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
