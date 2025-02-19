import React from "react";
import PipelineList from "./components/pipelineList";
import PlaygroundFileList from "./components/playgroundFileList";

export default function Playground() {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-xl font-semibold font-poppins text-foreground-900">
          Playground
        </h1>
      </div>
      <div className="flex flex-col gap-4 w-full h-full flex-grow">
        <h2 className="text-base font-semibold font-poppins text-foreground-700">
          New
        </h2>
        <PipelineList />
        <div className="h-1 border-b border-foreground-200"></div>
        <PlaygroundFileList />
      </div>
    </div>
  );
}
