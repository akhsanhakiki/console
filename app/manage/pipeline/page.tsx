"use client";
import React, { useState } from "react";
import ListofPipeline from "./components/listofPipeline";
import NewPipeline from "./components/newPipeline";
import ChevronDown from "@/public/images/icons/chevronDown";
import GeneralInfo from "./modules/generalInfo";
import DocumentLoader from "./modules/documentLoader";

export default function PipelinePage() {
  const [currentView, setCurrentView] = useState<"list" | "new">("list");
  const [currentModule, setCurrentModule] = useState<
    | "generalInfo"
    | "documentLoader"
    | "preProcess"
    | "documentSchema"
    | "contractSchema"
    | "postProcess"
  >("generalInfo");
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
          <>
            <ChevronDown className="-rotate-90" />
            <h2 className="text-sm font-medium font-poppins text-foreground-900">
              Pipeline Name
            </h2>
          </>
        )}
      </div>

      {currentView === "list" ? (
        <ListofPipeline setCurrentView={setCurrentView} />
      ) : (
        <NewPipeline />
      )}
    </div>
  );
}
