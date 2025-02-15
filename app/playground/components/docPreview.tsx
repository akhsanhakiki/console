"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { UploadedDocument } from "../module/docUpload";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface DocPreviewProps {
  selectedDocument: UploadedDocument | null;
}

const DocPreview = ({ selectedDocument }: DocPreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDocument]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (!selectedDocument) {
    return (
      <div className="flex items-center justify-center h-full text-foreground-500">
        Select a document to view
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="px-3 py-1 rounded bg-background-100 hover:bg-background-200 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {currentPage} of {numPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(numPages, prev + 1))
            }
            disabled={currentPage >= numPages}
            className="px-3 py-1 rounded bg-background-100 hover:bg-background-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
            className="px-3 py-1 rounded bg-background-100 hover:bg-background-200"
          >
            Zoom Out
          </button>
          <span className="text-sm">{Math.round(scale * 100)}%</span>
          <button
            onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
            className="px-3 py-1 rounded bg-background-100 hover:bg-background-200"
          >
            Zoom In
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Document
          file={`data:application/pdf;base64,${selectedDocument.content}`}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center"
          loading={
            <div className="flex items-center justify-center h-full">
              Loading PDF...
            </div>
          }
          error={
            <div className="flex items-center justify-center h-full text-red-500">
              Failed to load PDF. Please try again.
            </div>
          }
          options={{
            cMapUrl: "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
            cMapPacked: true,
            standardFontDataUrl:
              "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
          }}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={
              <div className="flex items-center justify-center h-[600px]">
                Loading page...
              </div>
            }
          />
        </Document>
      </div>
    </div>
  );
};

export default DocPreview;
