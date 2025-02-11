import { Button } from "@heroui/react";
import React, { useState } from "react";
import DocumentLoader from "../modules/documentLoader";
import PreProcess from "../modules/preProcess";
import DocumentSchema from "../modules/documentSchema";
import GeneralInfo from "../modules/generalInfo";
import ContractSchema from "../modules/contractSchema";

const ModuleNavigator = ({
  isActive,
  title,
  setCurrentModule,
}: {
  isActive: boolean;
  title: string;
  setCurrentModule: (
    module:
      | "General Info"
      | "Document loader"
      | "Pre-process"
      | "Document schema"
      | "Contract schema"
  ) => void;
}) => {
  return (
    <div
      className={`
        flex items-center justify-center rounded-lg w-fit h-8 transition-all duration-300 ease-in-out
        ${isActive ? "p-[2px] bg-gradient-to-r from-[#49FFDB] to-[#00E5FF]" : "p-[2px] bg-transparent"}
      `}
    >
      <Button
        variant="bordered"
        size="sm"
        className={`
          w-full h-full transition-all duration-200 ease-in-out font-poppins
          ${
            isActive
              ? "bg-background border-none text-foreground-900 font-medium"
              : "border-foreground-300 text-foreground-900 font-medium h-8 hover:border-[#49FFDB]"
          }
        `}
        onPress={() => setCurrentModule(title as any)}
      >
        {title}
      </Button>
    </div>
  );
};

const ModuleList = [
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
  const [currentModule, setCurrentModule] = useState<
    | "General Info"
    | "Document loader"
    | "Pre-process"
    | "Document schema"
    | "Contract schema"
  >("General Info");

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="flex flex-row gap-2 items-center">
        {ModuleList.map((module) => (
          <ModuleNavigator
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
