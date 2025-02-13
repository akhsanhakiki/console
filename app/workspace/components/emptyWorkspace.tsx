import { Button } from "@heroui/react";
import React from "react";
import { FiPlus } from "react-icons/fi";
import { BsPersonWorkspace } from "react-icons/bs";

const emptyWorkspace = () => {
  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <BsPersonWorkspace className="text-foreground-600 w-32 h-32 p-8 rounded-3xl " />
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-foreground-800 font-poppins font-medium text-sm">
          No workspaces found
        </p>
        <p className="text-foreground-500 font-poppins font-normal text-sm">
          Create a new workspace to get started
        </p>
      </div>
      <Button
        className="text-foreground-800 border-foreground-300 w-fit"
        variant="bordered"
      >
        <FiPlus className="text-foreground-800" />
        New Workspace
      </Button>
    </div>
  );
};

export default emptyWorkspace;
