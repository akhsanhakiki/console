"use client";
import React, { useState, useEffect, useRef, useCallback, memo } from "react";
import type { UploadedDocument } from "./docUpload";
import {
  FiChevronDown,
  FiSquare,
  FiTrash2,
  FiEdit2,
  FiMove,
  FiMousePointer,
} from "react-icons/fi";
import DocPreview from "../components/docPreview";
import { Select, SelectItem, Button } from "@heroui/react";

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

type CursorMode = "draw" | "drag";

interface ResizeHandle {
  x: number;
  y: number;
  width: number;
  height: number;
}

type ResizeHandles = {
  [key: string]: ResizeHandle;
};

interface MousePosition {
  x: number;
  y: number;
  pdfWidth: number;
  pdfHeight: number;
}

// Create a memoized DocPreview component
const MemoizedDocPreview = memo(DocPreview);

// Create a memoized drawing overlay component
const DrawingOverlay = memo(
  ({
    rectangles,
    selectedRect,
    currentRect,
    cursorMode,
    getResizeHandles,
    onRectClick,
  }: {
    rectangles: Rectangle[];
    selectedRect: Rectangle | null;
    currentRect: Rectangle | null;
    cursorMode: CursorMode;
    getResizeHandles: (rect: Rectangle) => ResizeHandles;
    onRectClick: (rect: Rectangle) => void;
  }) => (
    <>
      {rectangles.map((rect) => (
        <div
          key={rect.id}
          className={`absolute border-2 ${
            selectedRect?.id === rect.id
              ? "border-primary-500"
              : "border-primary-300"
          }`}
          style={{
            left: `${rect.x}px`,
            top: `${rect.y}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            cursor: cursorMode === "drag" ? "move" : "default",
            pointerEvents: cursorMode === "drag" ? "auto" : "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
            onRectClick(rect);
          }}
        >
          {selectedRect?.id === rect.id && cursorMode === "draw" && (
            <>
              {Object.entries(getResizeHandles(rect)).map(
                ([position, handle]) => (
                  <div
                    key={position}
                    className="absolute w-2 h-2 bg-primary-500 border border-white"
                    style={{
                      left: `${handle.x - rect.x}px`,
                      top: `${handle.y - rect.y}px`,
                      cursor:
                        position.includes("Left") || position.includes("Right")
                          ? "ew-resize"
                          : position.includes("Top") ||
                              position.includes("Bottom")
                            ? "ns-resize"
                            : "nwse-resize",
                      pointerEvents: "auto",
                    }}
                  />
                )
              )}
            </>
          )}
        </div>
      ))}
      {currentRect && (
        <div
          className="absolute border-2 border-primary-500"
          style={{
            left: `${currentRect.x}px`,
            top: `${currentRect.y}px`,
            width: `${currentRect.width}px`,
            height: `${currentRect.height}px`,
          }}
        />
      )}
    </>
  )
);

const DocSchema = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<UploadedDocument | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [selectedRect, setSelectedRect] = useState<Rectangle | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>("draw");
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

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

  const getMousePosition = useCallback((e: React.MouseEvent): MousePosition => {
    if (!pdfContainerRef.current)
      return { x: 0, y: 0, pdfWidth: 0, pdfHeight: 0 };

    // Get the PDF page element
    const pdfPage = pdfContainerRef.current.querySelector(".react-pdf__Page");
    const pdfCanvas = pdfContainerRef.current.querySelector(
      ".react-pdf__Page__canvas"
    );
    if (!pdfPage || !pdfCanvas)
      return { x: 0, y: 0, pdfWidth: 0, pdfHeight: 0 };

    // Get the canvas bounds
    const pageRect = pdfPage.getBoundingClientRect();
    const canvasRect = pdfCanvas.getBoundingClientRect();

    // Calculate position relative to the PDF page
    const x = e.clientX - pageRect.left;
    const y = e.clientY - pageRect.top;

    // Get canvas dimensions
    const pdfWidth = canvasRect.width;
    const pdfHeight = canvasRect.height;

    // Clamp coordinates to canvas bounds
    const clampedX = Math.max(0, Math.min(x, pdfWidth));
    const clampedY = Math.max(0, Math.min(y, pdfHeight));

    return {
      x: clampedX,
      y: clampedY,
      pdfWidth,
      pdfHeight,
    };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const { x, y, pdfWidth, pdfHeight } = getMousePosition(e);

      // Only update cursor position if within PDF bounds
      if (x >= 0 && x <= pdfWidth && y >= 0 && y <= pdfHeight) {
        setCursorPosition({ x: Math.round(x), y: Math.round(y) });
      }

      if (!startPointRef.current && !isDragging) return;

      if (isDragging && selectedRect) {
        if (!dragStartRef.current) return;
        const newX = Math.max(
          0,
          Math.min(x - dragStartRef.current.x, pdfWidth - selectedRect.width)
        );
        const newY = Math.max(
          0,
          Math.min(y - dragStartRef.current.y, pdfHeight - selectedRect.height)
        );

        const updatedRect = {
          ...selectedRect,
          x: newX,
          y: newY,
        };

        setSelectedRect(updatedRect);
        setRectangles((rects) =>
          rects.map((r) => (r.id === selectedRect.id ? updatedRect : r))
        );
        return;
      }

      if (isResizing && selectedRect && resizeHandle && startPointRef.current) {
        e.preventDefault();
        const dx = x - startPointRef.current.x;
        const dy = y - startPointRef.current.y;

        const newRect = { ...selectedRect };

        // Helper function to clamp rectangle within PDF bounds
        const clampRect = (rect: Rectangle) => {
          rect.x = Math.max(0, Math.min(rect.x, pdfWidth - rect.width));
          rect.y = Math.max(0, Math.min(rect.y, pdfHeight - rect.height));
          rect.width = Math.max(5, Math.min(rect.width, pdfWidth - rect.x));
          rect.height = Math.max(5, Math.min(rect.height, pdfHeight - rect.y));
          return rect;
        };

        switch (resizeHandle) {
          case "top":
            newRect.y += dy;
            newRect.height -= dy;
            break;
          case "bottom":
            newRect.height = y - newRect.y;
            break;
          case "left":
            newRect.x += dx;
            newRect.width -= dx;
            break;
          case "right":
            newRect.width = x - newRect.x;
            break;
          case "topLeft":
            newRect.x += dx;
            newRect.y += dy;
            newRect.width -= dx;
            newRect.height -= dy;
            break;
          case "topRight":
            newRect.y += dy;
            newRect.width = x - newRect.x;
            newRect.height -= dy;
            break;
          case "bottomLeft":
            newRect.x += dx;
            newRect.width -= dx;
            newRect.height = y - newRect.y;
            break;
          case "bottomRight":
            newRect.width = x - newRect.x;
            newRect.height = y - newRect.y;
            break;
        }

        if (newRect.width > 0 && newRect.height > 0) {
          const clampedRect = clampRect(newRect);
          setSelectedRect(clampedRect);
          setRectangles((rects) =>
            rects.map((r) => (r.id === clampedRect.id ? clampedRect : r))
          );
        }
        startPointRef.current = { x, y };
      } else if (isDrawing && currentRect) {
        const width = x - currentRect.x;
        const height = y - currentRect.y;

        // Clamp the rectangle dimensions within PDF bounds
        const clampedWidth = Math.min(width, pdfWidth - currentRect.x);
        const clampedHeight = Math.min(height, pdfHeight - currentRect.y);

        setCurrentRect({
          ...currentRect,
          width: clampedWidth,
          height: clampedHeight,
        });
      }
    },
    [isDrawing, isDragging, isResizing, selectedRect, currentRect, resizeHandle]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const { x, y, pdfWidth, pdfHeight } = getMousePosition(e);

      // Only allow drawing/dragging if within PDF bounds
      if (x < 0 || x > pdfWidth || y < 0 || y > pdfHeight) return;

      if (cursorMode === "drag") {
        const clickedRect = rectangles.find(
          (rect) =>
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );

        if (clickedRect) {
          setSelectedRect(clickedRect);
          setIsDragging(true);
          dragStartRef.current = { x: x - clickedRect.x, y: y - clickedRect.y };
          return;
        }
        setSelectedRect(null);
        return;
      }

      // Drawing mode
      if (selectedRect) {
        const handles = getResizeHandles(selectedRect);
        const clickedHandle = Object.entries(handles).find(
          ([_, rect]) =>
            x >= rect.x &&
            x <= rect.x + rect.width &&
            y >= rect.y &&
            y <= rect.y + rect.height
        );

        if (clickedHandle) {
          setIsResizing(true);
          setResizeHandle(clickedHandle[0]);
          startPointRef.current = { x, y };
          return;
        }
      }

      setIsDrawing(true);
      startPointRef.current = { x, y };
      const newRect = {
        id: Date.now().toString(),
        x,
        y,
        width: 0,
        height: 0,
        pageNumber: currentPage,
      };
      setCurrentRect(newRect);
    },
    [cursorMode, selectedRect, rectangles, currentPage]
  );

  const handleMouseUp = () => {
    if (isDrawing && currentRect && currentRect.width && currentRect.height) {
      // Normalize negative width/height
      const normalizedRect = {
        ...currentRect,
        x:
          currentRect.width < 0
            ? currentRect.x + currentRect.width
            : currentRect.x,
        y:
          currentRect.height < 0
            ? currentRect.y + currentRect.height
            : currentRect.y,
        width: Math.abs(currentRect.width),
        height: Math.abs(currentRect.height),
      };

      if (normalizedRect.width > 5 && normalizedRect.height > 5) {
        setRectangles([...rectangles, normalizedRect]);
        setSelectedRect(normalizedRect);
      }
    }

    setIsDrawing(false);
    setIsResizing(false);
    setResizeHandle(null);
    setCurrentRect(null);
    setIsDragging(false);
    startPointRef.current = null;
    dragStartRef.current = null;
  };

  const getResizeHandles = (rect: Rectangle): ResizeHandles => {
    const handleSize = 8;
    return {
      topLeft: {
        x: rect.x - handleSize / 2,
        y: rect.y - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      top: {
        x: rect.x + rect.width / 2 - handleSize / 2,
        y: rect.y - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      topRight: {
        x: rect.x + rect.width - handleSize / 2,
        y: rect.y - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      right: {
        x: rect.x + rect.width - handleSize / 2,
        y: rect.y + rect.height / 2 - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      bottomRight: {
        x: rect.x + rect.width - handleSize / 2,
        y: rect.y + rect.height - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      bottom: {
        x: rect.x + rect.width / 2 - handleSize / 2,
        y: rect.y + rect.height - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      bottomLeft: {
        x: rect.x - handleSize / 2,
        y: rect.y + rect.height - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
      left: {
        x: rect.x - handleSize / 2,
        y: rect.y + rect.height / 2 - handleSize / 2,
        width: handleSize,
        height: handleSize,
      },
    };
  };

  const deleteRectangle = (id: string) => {
    setRectangles(rectangles.filter((rect) => rect.id !== id));
    if (selectedRect?.id === id) {
      setSelectedRect(null);
    }
  };

  const handleRectClick = useCallback((rect: Rectangle) => {
    setSelectedRect(rect);
  }, []);

  // Add currentPage state handler
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-foreground-500">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-170px)]">
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* PDF Preview with Drawing Canvas */}
        <div
          className="h-full relative select-none bg-foreground-100"
          ref={pdfContainerRef}
          style={{ cursor: cursorMode === "draw" ? "crosshair" : "default" }}
        >
          <div className="h-full">
            <MemoizedDocPreview
              selectedDocument={selectedDocument}
              onPageChange={handlePageChange}
              currentPage={currentPage}
            />
          </div>
          <div
            className="absolute z-[1]"
            style={{
              position: "absolute",
              top:
                (
                  pdfContainerRef.current?.querySelector(
                    ".react-pdf__Page"
                  ) as HTMLElement
                )?.offsetTop || 0,
              left:
                (
                  pdfContainerRef.current?.querySelector(
                    ".react-pdf__Page"
                  ) as HTMLElement
                )?.offsetLeft || 0,
              width:
                pdfContainerRef.current?.querySelector(
                  ".react-pdf__Page__canvas"
                )?.clientWidth || "100%",
              height:
                pdfContainerRef.current?.querySelector(
                  ".react-pdf__Page__canvas"
                )?.clientHeight || "100%",
              pointerEvents: "auto",
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <DrawingOverlay
              rectangles={rectangles.filter(
                (rect) => rect.pageNumber === currentPage
              )}
              selectedRect={selectedRect}
              currentRect={currentRect}
              cursorMode={cursorMode}
              getResizeHandles={getResizeHandles}
              onRectClick={handleRectClick}
            />
          </div>
        </div>
      </div>

      {/* Right Panel - Document Selection and Rectangle Management */}
      <div className="w-64 border-l flex flex-col h-full">
        {/* Document Selection and Tools */}
        <div className="p-4 border-b space-y-4">
          <Select
            label="Document"
            labelPlacement="outside"
            selectionMode="single"
            selectedKeys={
              selectedDocument ? new Set([selectedDocument.id]) : new Set()
            }
            onSelectionChange={(keys) => {
              const selectedId = Array.from(keys)[0];
              const selected = documents.find((doc) => doc.id === selectedId);
              if (selected) setSelectedDocument(selected);
            }}
            size="sm"
            placeholder="Select a document"
            classNames={{
              trigger: "w-full",
              value: "w-full",
            }}
          >
            {documents.map((doc) => (
              <SelectItem key={doc.id} textValue={doc.name}>
                <div className="flex flex-col">
                  <span className="text-sm">{doc.name}</span>
                  <span className="text-xs text-foreground-400">
                    {(doc.size / 1024).toFixed(2)} KB
                  </span>
                </div>
              </SelectItem>
            ))}
          </Select>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={cursorMode === "draw" ? "solid" : "flat"}
                onPress={() => setCursorMode("draw")}
                startContent={<FiSquare className="w-4 h-4" />}
                isIconOnly
              ></Button>
              <Button
                size="sm"
                variant={cursorMode === "drag" ? "solid" : "flat"}
                onPress={() => setCursorMode("drag")}
                startContent={<FiMove className="w-4 h-4" />}
                isIconOnly
              ></Button>
            </div>
            <div className="text-xs text-foreground-500">
              {cursorPosition.x}, {cursorPosition.y}
            </div>
          </div>
        </div>

        {/* Rectangle List */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium">Rectangles</h3>
            <Button
              size="sm"
              variant="flat"
              isIconOnly
              onPress={() => setRectangles([])}
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {rectangles.map((rect) => (
              <div
                key={rect.id}
                className={`p-2 rounded border cursor-pointer ${
                  selectedRect?.id === rect.id
                    ? "border-primary-500 bg-primary-50"
                    : "border-foreground-200 hover:border-primary-300 hover:bg-primary-50/50"
                }`}
                onClick={() => {
                  setSelectedRect(rect);
                  // If the rectangle is on a different page, switch to that page
                  if (rect.pageNumber !== currentPage) {
                    setCurrentPage(rect.pageNumber);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">
                    Rectangle {rect.id.slice(-4)}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="flat"
                      isIconOnly
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRect(rect);
                      }}
                    >
                      <FiEdit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      isIconOnly
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRectangle(rect.id);
                      }}
                    >
                      <FiTrash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-foreground-500">
                  <div>Page: {rect.pageNumber}</div>
                  <div>X: {Math.round(rect.x)}</div>
                  <div>Y: {Math.round(rect.y)}</div>
                  <div>Width: {Math.round(rect.width)}</div>
                  <div>Height: {Math.round(rect.height)}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Back and Next Button */}
          <div className="flex flex-row gap-2 w-full justify-end mt-4 pt-4 border-t">
            <Button variant="bordered" onPress={() => {}}>
              Back
            </Button>
            <Button
              variant="solid"
              className="bg-gradient-to-r from-[#49FFDB] to-[#00E5FF]"
              onPress={() => {}}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocSchema;
