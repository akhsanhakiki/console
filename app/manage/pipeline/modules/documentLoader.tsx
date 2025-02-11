import React, { useState } from "react";
import { CheckboxGroup, Checkbox } from "@heroui/react";
import { MdTune } from "react-icons/md";
import { Input } from "@heroui/react";
import { RadioGroup, Radio } from "@heroui/react";
import { MdFileUpload } from "react-icons/md";
import { Button } from "@heroui/react";

const documentLoader = () => {
  const [fileName, setFileName] = useState("Document.pdf");
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-bold">
            Document loader configuration
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Configure the document loader of the pipeline
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1 items-start">
          <h1 className="text-sm font-medium font-poppins text-foreground-900">
            Base Document <span className="text-base text-red-500">*</span>
          </h1>
          <p className="text-sm text-gray-500">
            Upload the base document for annotation later in the pipeline.
          </p>
          <div className="flex flex-row gap-2 items-center">
            <Button
              variant="bordered"
              size="sm"
              startContent={<MdFileUpload />}
            >
              Upload
            </Button>
            <p className="text-sm text-gray-500">{fileName}</p>
          </div>
        </div>
        <Input
          className="max-w-xs"
          label="Document Password"
          labelPlacement="outside"
          placeholder="Enter the document password if any"
          type="password"
        />

        <div className="flex flex-row gap-1">
          <CheckboxGroup
            defaultValue={["buenos-aires", "london"]}
            label={
              <span className="text-sm font-medium font-poppins text-foreground-900">
                Document Format
              </span>
            }
          >
            <Checkbox value="native-pdf">
              <div className="flex flex-col">
                <h1 className="text-sm font-medium font-poppins text-foreground-900">
                  Native PDF
                </h1>
                <p className="text-sm font-normal font-poppins text-gray-500">
                  A PDF generated from scanned documents or photos, preserving
                  appearance but not allowing edits.
                </p>
              </div>
            </Checkbox>
            <Checkbox value="image-based-pdf">
              <div className="flex flex-col">
                <h1 className="text-sm font-medium font-poppins text-foreground-900">
                  Image Based PDF
                </h1>
                <p className="text-sm font-normal font-poppins text-gray-500">
                  A PDF generated from scanned documents or photos, preserving
                  appearance but not allowing edits.
                </p>
              </div>
            </Checkbox>
          </CheckboxGroup>
        </div>
      </div>
    </div>
  );
};

export default documentLoader;
