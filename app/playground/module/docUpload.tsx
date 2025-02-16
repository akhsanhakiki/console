import React, { useState, useEffect } from "react";
import { FiUploadCloud, FiX } from "react-icons/fi";
import { useDropzone } from "react-dropzone";
import DocPreview from "../components/docPreview";

export interface UploadedDocument {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // base64 content
  lastModified: number;
  uploadedAt: string;
}

const DocUpload = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedDocument | null>(
    null
  );
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);

  useEffect(() => {
    // Load files from session storage on mount
    const storedDocs = sessionStorage.getItem("uploadedDocuments");
    if (storedDocs) {
      const parsedDocs = JSON.parse(storedDocs) as UploadedDocument[];
      setDocuments(parsedDocs);
    }
  }, []);

  const saveToSessionStorage = (docs: UploadedDocument[]) => {
    sessionStorage.setItem("uploadedDocuments", JSON.stringify(docs));
    setDocuments(docs);
  };

  const onDrop = async (acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

    // Convert files to base64 and save to session storage
    const newDocuments: UploadedDocument[] = await Promise.all(
      acceptedFiles.map(async (file) => {
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(",")[1]); // Remove data URL prefix
          };
          reader.readAsDataURL(file);
        });

        return {
          id: `${file.name}-${file.lastModified}`,
          name: file.name,
          size: file.size,
          type: file.type,
          content,
          lastModified: file.lastModified,
          uploadedAt: new Date().toISOString(),
        };
      })
    );

    saveToSessionStorage([...documents, ...newDocuments]);
  };

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );

    // Remove from session storage
    const updatedDocs = documents.filter(
      (doc) => doc.name !== fileToRemove.name
    );
    saveToSessionStorage(updatedDocs);

    // Clear selected file if it was removed
    if (selectedFile?.name === fileToRemove.name) {
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (doc: UploadedDocument) => {
    setSelectedFile(doc);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div className="flex h-[calc(100vh-170px)] gap-4">
      <div className="flex-1">
        <div className="flex flex-col w-full h-full gap-4">
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center gap-4 h-48 border-2 border-dashed rounded-lg p-4 cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary-500 bg-primary-50"
                : "border-foreground-200 hover:border-primary-500"
            }`}
          >
            <input {...getInputProps()} />
            <FiUploadCloud className="w-16 h-16 text-foreground-300" />
            <div className="text-center">
              <p className="text-sm font-medium text-foreground-500 font-poppins">
                {isDragActive
                  ? "Drop the PDF files here"
                  : "Drag & drop PDF files here, or click to select files"}
              </p>
            </div>
          </div>

          {documents.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Uploaded Files:</h3>
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      selectedFile?.id === doc.id
                        ? "bg-primary-50"
                        : "bg-background-100"
                    }`}
                    onClick={() => handleFileSelect(doc)}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-sm truncate max-w-[200px]">
                        {doc.name}
                      </span>
                      <span className="text-xs text-foreground-400">
                        ({(doc.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(new File([], doc.name));
                      }}
                      className="p-1 hover:bg-background-200 rounded"
                    >
                      <FiX className="w-4 h-4 text-foreground-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="w-[600px]">
        <DocPreview selectedDocument={selectedFile} />
      </div>
    </div>
  );
};

export default DocUpload;
