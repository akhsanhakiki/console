import { CheckboxGroup, Checkbox } from "@heroui/react";
import React from "react";

const effects = {
  rotationCorrection: {
    name: "Rotation correction",
    description:
      "Preprocess document images to correct rotation issues that can affect extraction quality or processing.",
    isReadOnly: true,
  },
  detectExtremeFontSizesOrStyles: {
    name: "Detect extreme font sizes or styles",
    description:
      "Identify and adjust images with unusually large or small font sizes or styles that may affect text extraction.",
    isReadOnly: true,
  },
  partiallyHiddenText: {
    name: "Partially hidden text",
    description:
      "Identify and adjust images with partially hidden text that may affect text extraction.",
    isReadOnly: true,
  },
};

const ImageOpt = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-1">
        <CheckboxGroup
          defaultValue={[
            "rotationCorrection",
            "detectExtremeFontSizesOrStyles",
            "partiallyHiddenText",
          ]}
          label={
            <span className="text-sm font-medium font-poppins text-foreground-900">
              Image Optimization
            </span>
          }
        >
          {Object.entries(effects).map(([key, effect]) => (
            <Checkbox
              key={key}
              value={key}
              isReadOnly={effect.isReadOnly}
              defaultValue={effect.name}
            >
              <div className="flex flex-col">
                <h1 className="text-sm font-medium font-poppins text-foreground-900">
                  {effect.name}
                </h1>
                <p className="text-sm font-normal font-poppins text-gray-500">
                  {effect.description}
                </p>
              </div>
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
    </div>
  );
};

export default ImageOpt;
