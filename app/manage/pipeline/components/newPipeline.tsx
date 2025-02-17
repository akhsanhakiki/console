import { Button } from "@heroui/react";
import React, { useState } from "react";
import DocumentLoader from "../modules/documentLoader";
import PreProcess from "../modules/preProcess";
import DocumentSchema from "../modules/documentSchema";
import GeneralInfo from "../modules/generalInfo";
import ContractSchema from "../modules/contractSchema";
import ModuleSwitcher from "@/general-components/moduleSwitcher";

type ModuleType =
  | "General Info"
  | "Document loader"
  | "Pre-process"
  | "Document schema"
  | "Contract schema";

const ModuleList: Array<{ title: ModuleType }> = [
  {
    title: "General Info",
  },
  {
    title: "Document loader",
  },
  {
    title: "Pre-process",
  },
  {
    title: "Document schema",
  },
  {
    title: "Contract schema",
  },
];

const NewPipeline = () => {
  const [currentModule, setCurrentModule] =
    useState<ModuleType>("General Info");

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-row gap-2 items-center">
        {ModuleList.map((module) => (
          <ModuleSwitcher<ModuleType>
            key={module.title}
            isActive={currentModule === module.title}
            title={module.title}
            setCurrentModule={setCurrentModule}
          />
        ))}
      </div>
      {currentModule === "General Info" && <GeneralInfo />}
      {currentModule === "Document loader" && <DocumentLoader />}
      {currentModule === "Pre-process" && <PreProcess />}
      {currentModule === "Document schema" && <DocumentSchema />}
      {currentModule === "Contract schema" && <ContractSchema />}
    </div>
  );
};

export default NewPipeline;
