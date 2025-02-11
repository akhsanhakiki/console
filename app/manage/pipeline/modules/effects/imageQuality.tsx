import { Slider } from "@heroui/react";
import React from "react";

const imageQuality = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <h1 className="text-sm font-medium font-poppins text-foreground-900">
        Image Quality
      </h1>
      <div className="flex flex-col gap-1">
        <Slider
          className="max-w-md font-poppins"
          color="primary"
          defaultValue={0.2}
          label="Minimum quality"
          maxValue={1}
          minValue={0}
          size="sm"
          step={0.1}
        />
        <p className="text-sm text-foreground-500 font-poppins">
          The images will pass to the next processing module if pass the minimum
          quality.
        </p>
      </div>
    </div>
  );
};

export default imageQuality;
