"use client";
import React, { useState, useRef } from "react";
import { CheckboxGroup, Checkbox } from "@heroui/react";
import { MdTune, MdFileUpload } from "react-icons/md";
import { Input } from "@heroui/react";
import { Button } from "@heroui/react";

interface DocumentInfo {
  id: string;
  name: string;
  content: string;
  size: number;
  password?: string;
  format: string[];
}

const DocumentLoader = () => {
  const [fileName, setFileName] = useState("No file selected");
  const [documentPassword, setDocumentPassword] = useState("");
  const [documentFormat, setDocumentFormat] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result as string;
      const documentInfo: DocumentInfo = {
        id: Date.now().toString(),
        name: file.name,
        content,
        size: file.size,
        password: documentPassword,
        format: documentFormat,
      };

      // Save to session storage
      sessionStorage.setItem("uploadedDocument", JSON.stringify(documentInfo));
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

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
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileUpload}
            />
            <Button
              variant="bordered"
              size="sm"
              startContent={<MdFileUpload />}
              onPress={() => fileInputRef.current?.click()}
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
          value={documentPassword}
          onChange={(e) => setDocumentPassword(e.target.value)}
        />

        <div className="flex flex-row gap-1">
          <CheckboxGroup
            value={documentFormat}
            onChange={(values) => setDocumentFormat(values as string[])}
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
                  A PDF with selectable text and preserved structure.
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

export default DocumentLoader;
