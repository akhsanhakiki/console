"use client";
import React, { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { Stage, Layer, Image } from "react-konva";
import type { UploadedDocument } from "../module/docUpload";
import { Button, ScrollShadow } from "@heroui/react";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.js";
}

interface DocPreviewProps {
  selectedDocument: UploadedDocument | null;
  onPageChange?: (pageNumber: number) => void;
  currentPage?: number;
  children?: React.ReactNode;
}

const DocPreview = ({
  selectedDocument,
  onPageChange,
  currentPage: externalPage,
  children,
}: DocPreviewProps) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [internalPage, setInternalPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [initialScaleSet, setInitialScaleSet] = useState(false);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [pdfJsDoc, setPdfJsDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(
    null
  );
  const [pageImage, setPageImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastScaleFactor = useRef<number>(1.0);

  // Use external page if provided, otherwise use internal state
  const currentPage = externalPage || internalPage;

  useEffect(() => {
    setInternalPage(1);
    loadPDF();
  }, [selectedDocument]);

  useEffect(() => {
    if (pdfDoc && pdfJsDoc) {
      renderPage();
    }
  }, [currentPage, scale, pdfDoc, pdfJsDoc]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth - 32,
          height: containerRef.current.offsetHeight - 32,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const loadPDF = async () => {
    if (!selectedDocument) return;

    setLoading(true);
    setError(null);

    try {
      // Create a copy of the PDF data to prevent ArrayBuffer detachment
      const pdfBytes = new Uint8Array(
        selectedDocument.content.startsWith("data:")
          ? atob(selectedDocument.content.split(",")[1])
              .split("")
              .map((char) => char.charCodeAt(0))
          : atob(selectedDocument.content)
              .split("")
              .map((char) => char.charCodeAt(0))
      );

      // Load with PDF.js first for rendering
      const pdfJsDoc = await pdfjsLib.getDocument({
        data: pdfBytes.slice(), // Create a copy for PDF.js
        cMapUrl: "/cmaps/",
        cMapPacked: true,
      }).promise;
      setPdfJsDoc(pdfJsDoc);
      setNumPages(pdfJsDoc.numPages);

      // Then load with pdf-lib for manipulation
      try {
        const pdf = await PDFDocument.load(pdfBytes.slice()); // Create another copy for pdf-lib
        setPdfDoc(pdf);
      } catch (pdfLibError) {
        if (
          pdfLibError instanceof Error &&
          pdfLibError.message.includes("encrypted")
        ) {
          const pdf = await PDFDocument.load(pdfBytes.slice(), {
            ignoreEncryption: true,
          });
          setPdfDoc(pdf);
        } else {
          throw pdfLibError;
        }
      }
    } catch (error) {
      console.error("Error loading PDF:", error);
      setError(error instanceof Error ? error.message : "Failed to load PDF");
    } finally {
      setLoading(false);
    }
  };

  const renderPage = async () => {
    if (!pdfJsDoc || !containerRef.current) return;

    setLoading(true);
    try {
      const page = await pdfJsDoc.getPage(currentPage);
      const originalViewport = page.getViewport({ scale: 1.0 });

      // Calculate container dimensions accounting for padding
      const containerWidth = containerRef.current.offsetWidth - 32;
      const containerHeight = containerRef.current.offsetHeight - 32;

      // Calculate scale to fit the container height
      const heightScale = containerHeight / originalViewport.height;

      // Set initial scale if not set yet (100% or fit to height, whichever is smaller)
      if (!initialScaleSet) {
        const initialScale = Math.min(1.0, heightScale);
        setScale(initialScale);
        setInitialScaleSet(true);
      }

      // Create viewport with the current scale
      const viewport = page.getViewport({ scale });

      // Create a new canvas for rendering
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const context = canvas.getContext("2d", { alpha: false });
      if (!context) return;

      // Clear the canvas with white background
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Render PDF page to canvas
      const renderContext = {
        canvasContext: context,
        viewport,
        background: "white",
      };

      await page.render(renderContext).promise;

      // Create a new image element
      const img = new window.Image();
      img.onload = () => {
        setPageImage(img);
        setStageSize({
          width: viewport.width,
          height: viewport.height,
        });
        setLoading(false);
      };
      img.src = canvas.toDataURL("image/png", 1.0);

      // Clean up
      canvas.remove();
    } catch (error) {
      console.error("Error rendering PDF page:", error);
      setError(
        error instanceof Error ? error.message : "Failed to render PDF page"
      );
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setInternalPage(newPage);
    onPageChange?.(newPage);
  };

  // Add zoom control functions
  const handleZoom = (delta: number) => {
    const ZOOM_STEP = 0.1;
    const MIN_SCALE = 0.1;
    const MAX_SCALE = 5.0;

    const newScale = Math.max(
      MIN_SCALE,
      Math.min(MAX_SCALE, scale + scale * ZOOM_STEP * delta)
    );
    setScale(newScale);
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
      <ScrollShadow className="flex-1 overflow-y-auto" hideScrollBar>
        <div
          className="flex justify-center p-4 min-h-[600px]"
          ref={containerRef}
          style={{
            backgroundColor: "#f5f5f5",
            height: "100%",
          }}
        >
          {pageImage ? (
            <Stage
              width={stageSize.width}
              height={stageSize.height}
              style={{
                backgroundColor: "white",
                boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              }}
              onMouseDown={(e) => {
                // Prevent default to avoid text selection
                e.evt.preventDefault();
                const stage = e.target.getStage();
                const point = stage?.getPointerPosition();
                if (point) {
                  containerRef.current?.dispatchEvent(
                    new MouseEvent("mousedown", {
                      bubbles: true,
                      clientX: e.evt.clientX,
                      clientY: e.evt.clientY,
                      buttons: e.evt.buttons,
                    })
                  );
                }
              }}
              onMouseMove={(e) => {
                e.evt.preventDefault();
                const stage = e.target.getStage();
                const point = stage?.getPointerPosition();
                if (point) {
                  containerRef.current?.dispatchEvent(
                    new MouseEvent("mousemove", {
                      bubbles: true,
                      clientX: e.evt.clientX,
                      clientY: e.evt.clientY,
                      buttons: e.evt.buttons,
                    })
                  );
                }
              }}
              onMouseUp={(e) => {
                e.evt.preventDefault();
                const stage = e.target.getStage();
                const point = stage?.getPointerPosition();
                if (point) {
                  containerRef.current?.dispatchEvent(
                    new MouseEvent("mouseup", {
                      bubbles: true,
                      clientX: e.evt.clientX,
                      clientY: e.evt.clientY,
                    })
                  );
                }
              }}
            >
              <Layer>
                <Image
                  image={pageImage}
                  width={stageSize.width}
                  height={stageSize.height}
                  imageSmoothingEnabled={true}
                />
                {children}
              </Layer>
            </Stage>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full text-foreground-500 gap-2">
              {error ? (
                <>
                  <div className="text-red-500">Error loading PDF</div>
                  <div className="text-sm text-foreground-400">{error}</div>
                </>
              ) : loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                  <div>Loading PDF...</div>
                </>
              ) : (
                <div>No PDF loaded</div>
              )}
            </div>
          )}
        </div>
      </ScrollShadow>

      {/* Fixed Navigation Footer */}
      <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-[20] pointer-events-auto">
        <div className="flex justify-between items-center p-2 px-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="flat"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                handlePageChange(Math.min(numPages, currentPage + 1))
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
              onPress={() => handleZoom(-1)}
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
              onPress={() => handleZoom(1)}
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
