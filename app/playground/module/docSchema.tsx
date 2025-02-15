"use client";
import React, { useState, useEffect } from "react";
import type { UploadedDocument } from "./docUpload";
import { FiChevronDown } from "react-icons/fi";
import DocPreview from "../components/docPreview";

const DocSchema = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<UploadedDocument | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Load documents from session storage
    const loadDocuments = () => {
      const storedDocs = sessionStorage.getItem("uploadedDocuments");
      if (storedDocs) {
        const parsedDocs = JSON.parse(storedDocs) as UploadedDocument[];
        setDocuments(parsedDocs);
        // Automatically select the first document if none is selected
        if (!selectedDocument && parsedDocs.length > 0) {
          setSelectedDocument(parsedDocs[0]);
        }
      }
    };

    loadDocuments();

    // Add storage event listener to update when documents change
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "uploadedDocuments") {
        loadDocuments();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-foreground-500">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Document selector */}
      <div className="p-4 border-b relative">
        <div
          className="flex items-center justify-between p-2 border rounded cursor-pointer hover:border-primary-500"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="text-sm font-medium">
            {selectedDocument ? selectedDocument.name : "Select a document"}
          </span>
          <FiChevronDown
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute left-0 right-0 mt-1 mx-4 bg-white border rounded-md shadow-lg z-10">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`p-2 cursor-pointer hover:bg-background-100 ${
                  selectedDocument?.id === doc.id ? "bg-primary-50" : ""
                }`}
                onClick={() => {
                  setSelectedDocument(doc);
                  setIsDropdownOpen(false);
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{doc.name}</span>
                  <span className="text-xs text-foreground-400">
                    ({(doc.size / 1024).toFixed(2)} KB)
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Preview */}
      <div className="flex-1">
        <DocPreview selectedDocument={selectedDocument} />
      </div>
    </div>
  );
};

export default DocSchema;
