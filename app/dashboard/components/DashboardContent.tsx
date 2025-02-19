"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Tooltip } from "@heroui/react";
import { FiInfo } from "react-icons/fi";
import ExtractedPageIcon from "@/public/images/icons/extractedPageIcon";
import ExtractionQuotaIcon from "@/public/images/icons/extractionQuotaIcon";
import TotalProcessingTimeIcon from "@/public/images/icons/totalProcessingTimeIcon";
import AvgTimerperPageIcon from "@/public/images/icons/avgTimerperPageIcon";
import { useOrganization } from "@clerk/nextjs";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useDashboardStore } from "@/stores/dashboardStore";
import ContentLoading from "./contentLoading";

const DashboardContent = () => {
  const { organization } = useOrganization();
  const {
    selectedWorkspace,
    workspaces,
    isLoading: isWorkspaceLoading,
  } = useWorkspaceStore();
  const {
    dashboardData,
    isLoading: isDashboardLoading,
    error,
    fetchDashboardData,
  } = useDashboardStore();

  useEffect(() => {
    if (organization?.id && selectedWorkspace) {
      console.log("Fetching dashboard data for workspace:", selectedWorkspace);
      fetchDashboardData(organization.id, selectedWorkspace).catch((error) => {
        console.error("Error fetching dashboard data:", error);
      });
    }
  }, [organization?.id, selectedWorkspace, fetchDashboardData]);

  // Add a check for workspaces
  if (workspaces.length === 0) {
    return <div>No workspaces available</div>;
  }

  if (isWorkspaceLoading || isDashboardLoading) {
    return <ContentLoading />;
  }

  if (!organization?.id || !selectedWorkspace) {
    return (
      <div>
        Please select an organization and workspace
        {/* Debug info */}
        <pre>
          {JSON.stringify(
            {
              orgId: organization?.id,
              selectedWorkspace,
              workspacesCount: workspaces.length,
            },
            null,
            2
          )}
        </pre>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Store the card data in an array
  const cardData = [
    {
      title: "Documents Processed",
      value: dashboardData?.documentProcessed || 0,
      description: "Total documents processed this month.",
    },
    {
      title: "Pipeline Created",
      value: dashboardData?.pipelineCreated || 0,
      description: "Pipelines created by users.",
    },
    {
      title: "Doc type Created",
      value: dashboardData?.documentCreated || 0,
      description: "Document types created by users.",
    },
    {
      title: "Schema Created",
      value: dashboardData?.schemaCreated || 0,
      description: "Schema created by users.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col gap-4 flex-grow"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Card Data */}
      <motion.div className="flex flex-row gap-4" variants={containerVariants}>
        {cardData.map((card, index) => (
          <motion.div
            key={index}
            className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl p-4 w-1/4"
            variants={itemVariants}
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
          </motion.div>
        ))}
      </motion.div>

      {/* Chart Data */}
      <motion.div
        className="flex flex-row gap-4 w-full"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl w-3/5 p-4"
          variants={itemVariants}
        >
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
        </motion.div>
        <motion.div
          className="flex flex-col gap-4 w-2/5"
          variants={itemVariants}
        >
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
            <div className="flex flex-col bg-foreground-100 rounded-2xl gap-4 p-4 w-1/2">
              <div className="flex flex-row justify-between">
                <ExtractionQuotaIcon className="w-10 h-10 p-2 bg-background bg-opacity-70 rounded-2xl text-foreground-900" />
                <Tooltip content="Extraction quota">
                  <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="text-xl font-poppins font-semibold text-foreground-900">
                    64/10,000
                  </h2>
                  <p className="text-base font-poppins font-medium text-foreground-900">
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
            <div className="flex flex-col bg-foreground-100 rounded-2xl gap-4 p-4 w-1/2">
              <div className="flex flex-row justify-between">
                <TotalProcessingTimeIcon className="w-10 h-10 p-2 bg-background bg-opacity-70 rounded-2xl text-foreground-900" />
                <Tooltip content="Total processing time">
                  <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
                </Tooltip>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <h2 className="text-xl font-poppins font-semibold text-foreground-900">
                    41 min 30 s
                  </h2>
                </div>
                <p className="text-sm font-poppins font-medium text-foreground-500">
                  Total processing time
                </p>
              </div>
            </div>

            {/* Avg. time/page*/}
            <div className="flex flex-col bg-foreground-100 rounded-2xl gap-4 p-4 w-1/2">
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
        </motion.div>
      </motion.div>

      {/* Extraction Logs */}
      <motion.div
        className="flex flex-row gap-4 w-full h-full flex-grow"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl w-3/5 p-4"
          variants={itemVariants}
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-sm font-poppins font-semibold text-foreground-900">
              Extraction Log
            </h2>
            <Tooltip content="Extraction Log">
              <FiInfo className="w-4 h-4 text-foreground-900 cursor-pointer" />
            </Tooltip>
          </div>
        </motion.div>
        <motion.div
          className="flex flex-col gap-2 w-2/5"
          variants={itemVariants}
        >
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
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardContent;
