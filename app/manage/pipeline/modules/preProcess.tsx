import { Button } from "@heroui/react";
import React, { useState } from "react";
import { MdTune } from "react-icons/md";
import { Slider } from "@heroui/react";
import ImageQuality from "./effects/imageQuality";
import ImageOpt from "./effects/imageOpt";

const effects = [
  { name: "Image optimization", isDisabled: false },
  { name: "Image quality", isDisabled: true },
];

const PreProcess = () => {
  const [selectedEffect, setSelectedEffect] = useState(effects[0].name);

  const handleEffectSelect = (effectName: string, isDisabled: boolean) => {
    if (!isDisabled) {
      setSelectedEffect(effectName);
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-grow">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-bold">Pre-process configuration</h1>
        </div>
        <p className="text-sm text-gray-500">
          Configure the pre-process of the pipeline
        </p>
      </div>
      <div className="flex flex-row gap-4 h-full">
        <div className="flex flex-col gap-2 w-1/5">
          <h1 className="text-sm font-medium font-poppins text-foreground-900">
            Default Effect
          </h1>
          {effects.map((effect) => (
            <Button
              key={effect.name}
              variant="solid"
              size="sm"
              className={`
                bg-foreground-100 justify-start font-poppins
                ${selectedEffect === effect.name ? "border-2 border-brand-500" : ""}
                ${effect.isDisabled ? "opacity-50 cursor-not-allowed" : ""}
              `}
              onPress={() => handleEffectSelect(effect.name, effect.isDisabled)}
              isDisabled={effect.isDisabled}
            >
              {effect.name}
              {effect.isDisabled && (
                <span className="ml-2 text-xs text-foreground-500">
                  (Coming Soon)
                </span>
              )}
            </Button>
          ))}
        </div>
        <div className="border-r-1 border-foreground-200"></div>
        <div className="flex flex-col gap-2 w-2/5">
          {selectedEffect === "Image optimization" &&
            !effects.find((e) => e.name === selectedEffect)?.isDisabled && (
              <ImageOpt />
            )}
          {selectedEffect === "Image quality" &&
            !effects.find((e) => e.name === selectedEffect)?.isDisabled && (
              <ImageQuality />
            )}
        </div>
      </div>
    </div>
  );
};

export default PreProcess;
