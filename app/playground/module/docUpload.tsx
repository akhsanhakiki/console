import React from "react";
import { FiUploadCloud } from "react-icons/fi";

const docUpload = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <FiUploadCloud className="w-32 h-32 text-foreground-300" />
      <p className="text-sm font-medium text-foreground-500 font-poppins">
        Upload or drop documents here
      </p>
    </div>
  );
};

export default docUpload;
