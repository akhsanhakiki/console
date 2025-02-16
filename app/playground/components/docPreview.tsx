"use client";
import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import type { UploadedDocument } from "../module/docUpload";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button, ScrollShadow } from "@heroui/react";

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
    <div className="flex flex-col h-full relative">
      {/* Document Viewer with ScrollShadow */}
      <ScrollShadow className="flex-1 overflow-y-auto" hideScrollBar>
        <div className="flex justify-center p-4">
          <Document
            file={`data:application/pdf;base64,${selectedDocument.content}`}
            onLoadSuccess={onDocumentLoadSuccess}
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
              cMapUrl:
                "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
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
      </ScrollShadow>

      {/* Fixed Navigation Footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-[20] pointer-events-auto">
        <div className="flex justify-between items-center p-2 px-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              isDisabled={currentPage <= 1}
            >
              Previous
            </Button>
            <span className="text-sm font-medium">
              Page {currentPage} of {numPages}
            </span>
            <Button
              size="sm"
              variant="flat"
              onClick={() =>
                setCurrentPage((prev) => Math.min(numPages, prev + 1))
              }
              isDisabled={currentPage >= numPages}
            >
              Next
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              onPress={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              isIconOnly
            >
              -
            </Button>
            <span className="text-sm font-medium min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button
              size="sm"
              variant="flat"
              onPress={() => setScale((prev) => Math.min(2, prev + 0.1))}
              isIconOnly
            >
              +
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocPreview;
