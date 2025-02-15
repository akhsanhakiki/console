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

  const getMousePosition = useCallback((e: React.MouseEvent) => {
    if (!pdfContainerRef.current) return { x: 0, y: 0 };
    const rect = pdfContainerRef.current.getBoundingClientRect();
    const scrollContainer =
      pdfContainerRef.current.querySelector(".overflow-auto");
    const scrollLeft = scrollContainer ? scrollContainer.scrollLeft : 0;
    const scrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;
    return { x, y };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Prevent default browser behavior
      const { x, y } = getMousePosition(e);
      setCursorPosition({ x: Math.round(x), y: Math.round(y) });

      if (!startPointRef.current && !isDragging) return;

      if (isDragging && selectedRect) {
        if (!dragStartRef.current) return;
        const newX = x - dragStartRef.current.x;
        const newY = y - dragStartRef.current.y;

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
          setSelectedRect(newRect);
          setRectangles((rects) =>
            rects.map((r) => (r.id === newRect.id ? newRect : r))
          );
        }
        startPointRef.current = { x, y };
      } else if (isDrawing && currentRect) {
        setCurrentRect({
          ...currentRect,
          width: x - currentRect.x,
          height: y - currentRect.y,
        });
      }
    },
    [isDrawing, isDragging, isResizing, selectedRect, currentRect, resizeHandle]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const { x, y } = getMousePosition(e);

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
        pageNumber: 1,
      };
      setCurrentRect(newRect);
    },
    [cursorMode, selectedRect, rectangles]
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

  if (documents.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-foreground-500">
        No documents uploaded yet
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <div className="flex flex-col flex-grow">
        {/* Document selector */}
        <div className="p-4 border-b relative">
          <div className="flex items-center justify-between">
            <div
              className="flex-1 flex items-center justify-between p-2 border rounded cursor-pointer hover:border-primary-500"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="text-sm font-medium">
                {selectedDocument ? selectedDocument.name : "Select a document"}
              </span>
              <FiChevronDown
                className={`w-4 h-4 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  className={`p-2 rounded ${cursorMode === "draw" ? "bg-primary-100" : "hover:bg-background-100"}`}
                  onClick={() => setCursorMode("draw")}
                  title="Draw Mode"
                >
                  <FiSquare className="w-4 h-4 text-foreground-500" />
                </button>
                <button
                  className={`p-2 rounded ${cursorMode === "drag" ? "bg-primary-100" : "hover:bg-background-100"}`}
                  onClick={() => setCursorMode("drag")}
                  title="Move Mode"
                >
                  <FiMove className="w-4 h-4 text-foreground-500" />
                </button>
              </div>
              <div className="text-xs text-foreground-500">
                X: {cursorPosition.x}, Y: {cursorPosition.y}
              </div>
            </div>
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

        {/* PDF Preview with Drawing Canvas */}
        <div
          className="flex-1 relative select-none"
          ref={pdfContainerRef}
          style={{ cursor: cursorMode === "draw" ? "crosshair" : "default" }}
        >
          <div
            className="absolute inset-0 z-10"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <DrawingOverlay
              rectangles={rectangles}
              selectedRect={selectedRect}
              currentRect={currentRect}
              cursorMode={cursorMode}
              getResizeHandles={getResizeHandles}
              onRectClick={handleRectClick}
            />
          </div>
          <div className="h-full pointer-events-none">
            <MemoizedDocPreview selectedDocument={selectedDocument} />
          </div>
        </div>
      </div>

      {/* Right Panel - Rectangle Management */}
      <div className="w-64 border-l p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Rectangles</h3>
          <button
            className="p-2 rounded hover:bg-background-100"
            onClick={() => setRectangles([])}
          >
            <FiTrash2 className="w-4 h-4 text-foreground-500" />
          </button>
        </div>
        <div className="space-y-2">
          {rectangles.map((rect) => (
            <div
              key={rect.id}
              className={`p-2 rounded border ${
                selectedRect?.id === rect.id
                  ? "border-primary-500 bg-primary-50"
                  : "border-foreground-200"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">
                  Rectangle {rect.id.slice(-4)}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 rounded hover:bg-background-100"
                    onClick={() => setSelectedRect(rect)}
                  >
                    <FiEdit2 className="w-3 h-3 text-foreground-500" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-background-100"
                    onClick={() => deleteRectangle(rect.id)}
                  >
                    <FiTrash2 className="w-3 h-3 text-foreground-500" />
                  </button>
                </div>
              </div>
              <div className="text-xs text-foreground-500">
                <div>X: {Math.round(rect.x)}</div>
                <div>Y: {Math.round(rect.y)}</div>
                <div>Width: {Math.round(rect.width)}</div>
                <div>Height: {Math.round(rect.height)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocSchema;
