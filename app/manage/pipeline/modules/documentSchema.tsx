import React from "react";
import { MdTune } from "react-icons/md";
const documentSchema = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-bold">
            Document schema configuration
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Configure the document schema of the pipeline
        </p>
      </div>
    </div>
  );
};

export default documentSchema;
