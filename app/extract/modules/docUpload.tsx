import React from "react";
import { FiUploadCloud } from "react-icons/fi";

const docUpload = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <FiUploadCloud className="text-4xl text-foreground-500" />
      <p className="text-sm text-foreground-500">Upload your document</p>
    </div>
  );
};

export default docUpload;
