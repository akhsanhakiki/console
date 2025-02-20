"use client";

import ChevronDown from "@/public/images/icons/chevronDown";
import { useState } from "react";
import ListofPipeline from "./listofPipeline";
import NewPipeline from "./newPipeline";
import { motion } from "framer-motion";

const PipelineContent = () => {
  const [currentView, setCurrentView] = useState<"list" | "new">("list");

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 1,
      },
    },
  };

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-row gap-1 items-center">
        <h1
          onClick={() => setCurrentView("list")}
          className="text-xl font-semibold font-poppins text-foreground-900 hover:cursor-pointer"
        >
          Pipeline
        </h1>
        {currentView === "new" && (
          <motion.div
            className="flex flex-row gap-1 items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 15,
              mass: 1,
            }}
          >
            <ChevronDown className="-rotate-90" />
            <h2 className="text-sm font-medium font-poppins text-foreground-900">
              Pipeline Name
            </h2>
          </motion.div>
        )}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={contentVariants}
        className="h-full"
      >
        {currentView === "list" ? (
          <ListofPipeline setCurrentView={setCurrentView} />
        ) : (
          <NewPipeline />
        )}
      </motion.div>
    </div>
  );
};

export default PipelineContent;
