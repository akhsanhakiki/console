import React from "react";
import { MdTune } from "react-icons/md";

const ContractSchema = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-semibold text-foreground-900 font-poppins">
            Contract schema configuration
          </h1>
        </div>
        <p className="text-sm text-foreground-600 font-poppins">
          Configure the contract schema of the pipeline
        </p>
      </div>
    </div>
  );
};

export default ContractSchema;
