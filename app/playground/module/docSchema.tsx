"use client";
import React, { useState, useEffect, useCallback, memo } from "react";
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
import { Rect, Transformer } from "react-konva";

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

type CursorMode = "draw" | "drag";

// Create a memoized rectangle component
const KonvaRectangle = memo(
  ({
    rect,
    isSelected,
    onSelect,
    onChange,
    cursorMode,
    onHoverStart,
    onHoverEnd,
  }: {
    rect: Rectangle;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Rectangle) => void;
    cursorMode: CursorMode;
    onHoverStart: () => void;
    onHoverEnd: () => void;
  }) => {
    const shapeRef = React.useRef<any>(null);
    const transformerRef = React.useRef<any>(null);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
      if (isSelected && transformerRef.current && shapeRef.current) {
        transformerRef.current.nodes([shapeRef.current]);
        transformerRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    return (
      <>
        <Rect
          ref={shapeRef}
          {...rect}
          draggable={true}
          stroke={
            isSelected ? "#0066FF" : isHovered ? "#0066FFB0" : "#0066FF80"
          }
          strokeWidth={isSelected || isHovered ? 2.5 : 2}
          fill={isHovered ? "rgba(0, 102, 255, 0.05)" : "transparent"}
          onMouseEnter={(e) => {
            setIsHovered(true);
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "move";
            }
            onHoverStart();
          }}
          onMouseLeave={(e) => {
            setIsHovered(false);
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "default";
            }
            onHoverEnd();
          }}
          onMouseDown={(e) => {
            e.cancelBubble = true;
            onSelect();
          }}
          onDragStart={(e) => {
            e.target.setAttrs({
              shadowColor: "#0066FF",
              shadowBlur: 6,
              shadowOpacity: 0.3,
            });
          }}
          onDragEnd={(e) => {
            e.target.setAttrs({
              shadowBlur: 0,
              shadowOpacity: 0,
            });
            onChange({
              ...rect,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformStart={(e) => {
            if (cursorMode === "draw") {
              e.target.setAttrs({
                shadowColor: "#0066FF",
                shadowBlur: 6,
                shadowOpacity: 0.3,
              });
            }
          }}
          onTransformEnd={(e) => {
            const node = shapeRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();

            node.scaleX(1);
            node.scaleY(1);
            node.setAttrs({
              shadowBlur: 0,
              shadowOpacity: 0,
            });

            onChange({
              ...rect,
              x: node.x(),
              y: node.y(),
              width: Math.max(5, node.width() * scaleX),
              height: Math.max(5, node.height() * scaleY),
            });
          }}
        />
        {isSelected && cursorMode === "draw" && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              const minWidth = 5;
              const minHeight = 5;
              if (newBox.width < minWidth || newBox.height < minHeight) {
                return oldBox;
              }
              return newBox;
            }}
            enabledAnchors={[
              "top-left",
              "top-right",
              "bottom-left",
              "bottom-right",
              "middle-left",
              "middle-right",
              "top-center",
              "bottom-center",
            ]}
            rotateEnabled={false}
            borderStroke="#0066FF"
            borderStrokeWidth={1.5}
            anchorFill="#FFFFFF"
            anchorStroke="#0066FF"
            anchorStrokeWidth={1.5}
            anchorSize={8}
            keepRatio={false}
            padding={0}
          />
        )}
      </>
    );
  }
);

KonvaRectangle.displayName = "KonvaRectangle";

const DocSchema = () => {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedDocument, setSelectedDocument] =
    useState<UploadedDocument | null>(null);
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [selectedRect, setSelectedRect] = useState<Rectangle | null>(null);
  const [cursorMode, setCursorMode] = useState<CursorMode>("draw");
  const [previousMode, setPreviousMode] = useState<CursorMode>("draw");
  const [currentPage, setCurrentPage] = useState(1);
  const startPointRef = React.useRef<{ x: number; y: number } | null>(null);
  const isHoveringRect = React.useRef(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const stageRef = React.useRef<HTMLDivElement>(null);

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

  // Add a function to check if a point is inside any existing rectangle
  const isPointInsideAnyRect = useCallback(
    (x: number, y: number) => {
      return rectangles.some(
        (rect) =>
          rect.pageNumber === currentPage &&
          x >= rect.x &&
          x <= rect.x + rect.width &&
          y >= rect.y &&
          y <= rect.y + rect.height
      );
    },
    [rectangles, currentPage]
  );

  // Add a function to check if a rectangle overlaps with any existing rectangle
  const doesRectangleOverlap = useCallback(
    (newRect: Rectangle) => {
      return rectangles.some(
        (rect) =>
          rect.pageNumber === currentPage &&
          !(
            newRect.x + newRect.width < rect.x ||
            newRect.x > rect.x + rect.width ||
            newRect.y + newRect.height < rect.y ||
            newRect.y > rect.y + rect.height
          )
      );
    },
    [rectangles, currentPage]
  );

  // Add this function to get coordinates relative to PDF
  const getRelativeCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (!stageRef.current) return { x: 0, y: 0 };

      // Get the stage container's bounds
      const stageRect = stageRef.current.getBoundingClientRect();

      // Find the PDF canvas element
      const pdfCanvas = stageRef.current.querySelector("canvas");
      if (!pdfCanvas) return { x: 0, y: 0 };

      // Get the PDF canvas bounds
      const pdfRect = pdfCanvas.getBoundingClientRect();

      // Calculate coordinates relative to PDF canvas
      return {
        x: Math.round(clientX - pdfRect.left),
        y: Math.round(clientY - pdfRect.top),
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cursorMode === "drag") return;

      const { x, y } = getRelativeCoordinates(e.clientX, e.clientY);

      // Don't start drawing if clicking inside an existing rectangle
      if (isPointInsideAnyRect(x, y)) {
        return;
      }

      setIsDrawing(true);
      startPointRef.current = { x, y };

      // Create initial rectangle with 0 dimensions
      setCurrentRect({
        id: Date.now().toString(),
        x,
        y,
        width: 0,
        height: 0,
        pageNumber: currentPage,
      });
    },
    [cursorMode, currentPage, isPointInsideAnyRect, getRelativeCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { x: mouseX, y: mouseY } = getRelativeCoordinates(
        e.clientX,
        e.clientY
      );
      setCursorPosition({ x: mouseX, y: mouseY });

      if (!isDrawing || !startPointRef.current) return;

      if (!currentRect) return;

      // Calculate width and height based on start point and current position
      const width = mouseX - startPointRef.current.x;
      const height = mouseY - startPointRef.current.y;

      // Update rectangle dimensions
      setCurrentRect({
        ...currentRect,
        width: Math.abs(width),
        height: Math.abs(height),
        x: width < 0 ? mouseX : startPointRef.current.x,
        y: height < 0 ? mouseY : startPointRef.current.y,
      });
    },
    [isDrawing, currentRect, getRelativeCoordinates]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentRect) {
      // Only add the rectangle if it has minimum dimensions
      if (
        currentRect.width > 5 &&
        currentRect.height > 5 &&
        !doesRectangleOverlap(currentRect)
      ) {
        setRectangles([...rectangles, currentRect]);
        setSelectedRect(currentRect);
      }
    }

    setIsDrawing(false);
    setCurrentRect(null);
    startPointRef.current = null;
  }, [isDrawing, currentRect, rectangles, doesRectangleOverlap]);

  const handleRectChange = (newRect: Rectangle) => {
    setRectangles(
      rectangles.map((rect) => (rect.id === newRect.id ? newRect : rect))
    );
    setSelectedRect(newRect);
  };

  const deleteRectangle = (id: string) => {
    setRectangles(rectangles.filter((rect) => rect.id !== id));
    if (selectedRect?.id === id) {
      setSelectedRect(null);
    }
  };

  const handleRectHoverStart = useCallback(() => {
    isHoveringRect.current = true;
    if (cursorMode === "draw") {
      setPreviousMode("draw");
      setCursorMode("drag");
    }
  }, [cursorMode]);

  const handleRectHoverEnd = useCallback(() => {
    isHoveringRect.current = false;
    if (cursorMode === "drag" && previousMode === "draw") {
      setCursorMode("draw");
    }
  }, [cursorMode, previousMode]);

  const handleModeChange = useCallback((newMode: CursorMode) => {
    setCursorMode(newMode);
    setPreviousMode(newMode);
  }, []);

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
        <div
          ref={stageRef}
          className="h-full relative select-none bg-foreground-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => {
            if (isDrawing) {
              handleMouseUp();
            }
          }}
        >
          <DocPreview
            selectedDocument={selectedDocument}
            onPageChange={setCurrentPage}
            currentPage={currentPage}
          >
            {rectangles
              .filter((rect) => rect.pageNumber === currentPage)
              .map((rect) => (
                <KonvaRectangle
                  key={rect.id}
                  rect={rect}
                  isSelected={selectedRect?.id === rect.id}
                  onSelect={() => setSelectedRect(rect)}
                  onChange={handleRectChange}
                  cursorMode={cursorMode}
                  onHoverStart={handleRectHoverStart}
                  onHoverEnd={handleRectHoverEnd}
                />
              ))}
            {currentRect && (
              <Rect
                {...currentRect}
                stroke="#0066FF"
                strokeWidth={2}
                fill="transparent"
              />
            )}
          </DocPreview>
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
                variant={
                  cursorMode === "draw" && !isHoveringRect.current
                    ? "solid"
                    : "flat"
                }
                onPress={() => handleModeChange("draw")}
                startContent={<FiSquare className="w-4 h-4" />}
                isIconOnly
              ></Button>
              <Button
                size="sm"
                variant={
                  cursorMode === "drag" || isHoveringRect.current
                    ? "solid"
                    : "flat"
                }
                onPress={() => handleModeChange("drag")}
                startContent={<FiMove className="w-4 h-4" />}
                isIconOnly
              ></Button>
              <div className="text-xs font-mono text-foreground-600 bg-foreground-100 px-2 py-1 rounded">
                ({cursorPosition.x}, {cursorPosition.y})
              </div>
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
                className={`p-2 rounded border cursor-pointer transition-all duration-150 ${
                  selectedRect?.id === rect.id
                    ? "border-primary-500 bg-primary-50 shadow-sm"
                    : "border-foreground-200 hover:border-primary-300 hover:bg-primary-50/50"
                }`}
                onClick={() => {
                  setSelectedRect(rect);
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
