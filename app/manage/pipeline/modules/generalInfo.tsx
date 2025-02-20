import React from "react";
import { MdTune } from "react-icons/md";
import { Input } from "@heroui/react";
import { Textarea } from "@heroui/react";

const generalInfo = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-semibold text-foreground-900 font-poppins">
            General info configuration
          </h1>
        </div>
        <p className="text-sm text-foreground-600 font-poppins">
          Configure the general information of the pipeline
        </p>
      </div>
      <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
        <Input
          isRequired
          className="max-w-xs"
          label="Name"
          labelPlacement="outside"
          placeholder="Enter your name"
          type="text"
        />
        <Input
          isReadOnly
          className="max-w-xs"
          label="Project ID"
          labelPlacement="outside"
          placeholder="PROJECT-12345"
          type="text"
        />
        <Textarea
          isRequired
          className="max-w-xs"
          label="Description"
          labelPlacement="outside"
          placeholder="Enter your description"
        />
      </div>
    </div>
  );
};

export default generalInfo;
