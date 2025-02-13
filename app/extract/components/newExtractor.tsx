import React from "react";
import DocUpload from "../modules/docUpload";
import { IoArrowBack } from "react-icons/io5";

interface NewExtractorProps {
  onBack: () => void;
  pipelineType: string;
}

const NewExtractor = ({ onBack, pipelineType }: NewExtractorProps) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-foreground-100 rounded-full transition-all"
        >
          <IoArrowBack className="w-5 h-5 text-foreground-700" />
        </button>
        <h1 className="text-xl font-semibold font-poppins text-foreground-900">
          {pipelineType}
        </h1>
      </div>
      <div className="flex-grow">
        <DocUpload />
      </div>
    </div>
  );
};

export default NewExtractor;
