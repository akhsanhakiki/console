"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { MdTune, MdFileUpload } from "react-icons/md";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { Stage, Layer, Rect, Transformer, Image } from "react-konva";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocument } from "pdf-lib";
import DocSample from "@/public/sample/Ezdocs OCR Pages.json";
import {
  Button,
  Input,
  CheckboxGroup,
  Checkbox,
  ScrollShadow,
} from "@heroui/react";

// Initialize PDF.js worker
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf/pdf.worker.js";
}

interface Rectangle {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
}

interface DocumentInfo {
  id: string;
  name: string;
  content: string;
  size: number;
  password?: string;
  format?: string[];
}

type CursorMode = "draw" | "drag";

// Create a memoized rectangle component
const KonvaRectangle = React.memo(
  ({
    rect,
    isSelected,
    onSelect,
    onChange,
    cursorMode,
    onHover,
  }: {
    rect: Rectangle;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Rectangle) => void;
    cursorMode: CursorMode;
    onHover: (isHovering: boolean) => void;
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

    const handleTransform = () => {
      if (!shapeRef.current) return;

      const node = shapeRef.current;
      const scaleX = node.scaleX();
      const scaleY = node.scaleY();

      node.scaleX(1);
      node.scaleY(1);

      onChange({
        ...rect,
        x: node.x(),
        y: node.y(),
        width: Math.max(5, node.width() * scaleX),
        height: Math.max(5, node.height() * scaleY),
      });
    };

    return (
      <>
        <Rect
          ref={shapeRef}
          {...rect}
          draggable={isSelected}
          stroke={
            isSelected ? "#0066FF" : isHovered ? "#0066FFB0" : "#0066FF80"
          }
          strokeWidth={isSelected || isHovered ? 2.5 : 2}
          fill={isHovered ? "rgba(0, 102, 255, 0.05)" : "transparent"}
          onMouseEnter={(e) => {
            setIsHovered(true);
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "pointer";
            }
            onHover(true);
          }}
          onMouseLeave={(e) => {
            setIsHovered(false);
            const stage = e.target.getStage();
            if (stage) {
              stage.container().style.cursor = "default";
            }
            onHover(false);
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
          onDragMove={(e) => {
            onChange({
              ...rect,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onDragEnd={(e) => {
            e.target.setAttrs({
              shadowBlur: 0,
              shadowOpacity: 0,
            });
          }}
          onTransform={handleTransform}
          onTransformStart={(e) => {
            e.target.setAttrs({
              shadowColor: "#0066FF",
              shadowBlur: 6,
              shadowOpacity: 0.3,
            });
          }}
          onTransformEnd={(e) => {
            e.target.setAttrs({
              shadowBlur: 0,
              shadowOpacity: 0,
            });
            handleTransform();
          }}
        />
        {isSelected && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              const minWidth = 5;
              const minHeight = 5;
              const maxWidth = 2000;
              const maxHeight = 2000;

              if (
                newBox.width < minWidth ||
                newBox.height < minHeight ||
                newBox.width > maxWidth ||
                newBox.height > maxHeight
              ) {
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
            ignoreStroke={true}
            centeredScaling={false}
          />
        )}
      </>
    );
  }
);

KonvaRectangle.displayName = "KonvaRectangle";

const DocumentSchema = () => {
  // Document state
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pageImage, setPageImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rectangle editing state
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [selectedRect, setSelectedRect] = useState<Rectangle | null>(null);
  const [cursorMode] = useState<CursorMode>("draw");
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const isHoveringRect = useRef(false);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadImage();
  }, [currentPage]);

  const loadImage = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the current page data
      const currentPageData = DocSample[currentPage - 1];
      if (!currentPageData?.content) {
        throw new Error("No image content found");
      }

      // Create and load the image
      const img = new window.Image();
      img.onload = () => {
        setPageImage(img);
        if (containerRef.current) {
          const containerWidth = containerRef.current.offsetWidth - 64; // Account for padding
          const containerHeight = containerRef.current.offsetHeight - 64;

          // Use the dimensions from the JSON if available, otherwise use image dimensions
          const docWidth = currentPageData.dimensions?.width || img.width;
          const docHeight = currentPageData.dimensions?.height || img.height;

          // Calculate scale to fit container while maintaining aspect ratio
          const scaleX = containerWidth / docWidth;
          const scaleY = containerHeight / docHeight;
          const newScale = Math.min(scaleX, scaleY, 1.0); // Don't scale up beyond original size
          setScale(newScale);

          setStageSize({
            width: docWidth * newScale,
            height: docHeight * newScale,
          });
        }
        setLoading(false);
      };
      img.onerror = () => {
        setError("Failed to load image");
        setLoading(false);
      };
      img.src = `data:image/png;base64,${currentPageData.content}`;

      // Set total pages
      setNumPages(DocSample.length);
    } catch (error) {
      console.error("Error loading image:", error);
      setError(error instanceof Error ? error.message : "Failed to load image");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pageImage && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth - 64;
      const containerHeight = containerRef.current.offsetHeight - 64;

      // Use the dimensions from the JSON if available
      const currentPageData = DocSample[currentPage - 1];
      const docWidth = currentPageData.dimensions?.width || pageImage.width;
      const docHeight = currentPageData.dimensions?.height || pageImage.height;

      setStageSize({
        width: docWidth * scale,
        height: docHeight * scale,
      });
    }
  }, [scale, pageImage, currentPage]);

  // Rectangle management functions
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

  const getRelativeCoordinates = useCallback(
    (clientX: number, clientY: number) => {
      if (!stageRef.current) return { x: 0, y: 0 };

      const pdfCanvas = stageRef.current.querySelector("canvas");
      if (!pdfCanvas) return { x: 0, y: 0 };

      const pdfRect = pdfCanvas.getBoundingClientRect();

      return {
        x: Math.round(clientX - pdfRect.left),
        y: Math.round(clientY - pdfRect.top),
      };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { x, y } = getRelativeCoordinates(e.clientX, e.clientY);

      if (isPointInsideAnyRect(x, y)) return;

      setSelectedRect(null);
      setIsDrawing(true);
      startPointRef.current = { x, y };

      setCurrentRect({
        id: Date.now().toString(),
        x,
        y,
        width: 0,
        height: 0,
        pageNumber: currentPage,
      });
    },
    [currentPage, isPointInsideAnyRect, getRelativeCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const { x: mouseX, y: mouseY } = getRelativeCoordinates(
        e.clientX,
        e.clientY
      );
      setCursorPosition({ x: mouseX, y: mouseY });

      if (!isDrawing || !startPointRef.current || !currentRect) return;

      const width = mouseX - startPointRef.current.x;
      const height = mouseY - startPointRef.current.y;

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
      if (
        currentRect.width > 5 &&
        currentRect.height > 5 &&
        !doesRectangleOverlap(currentRect)
      ) {
        const newRect = { ...currentRect };
        setRectangles([...rectangles, newRect]);
        setSelectedRect(newRect);
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

  return (
    <div className="flex flex-col gap-4">
      {/* Document Schema Header */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <MdTune className="text-2xl w-5 h-5" />
          <h1 className="text-medium font-bold">
            Document schema configuration
          </h1>
        </div>
        <p className="text-sm text-gray-500">
          Configure the document schema of the pipeline
        </p>
      </div>

      {/* Image Viewer and Editor Section */}
      <div className="flex flex-row h-[calc(100vh-240px)]">
        <div className="flex flex-col w-10/12 overflow-hidden">
          <div
            ref={stageRef}
            className="h-full relative select-none bg-foreground-100 flex items-center justify-center"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => {
              if (isDrawing) {
                handleMouseUp();
              }
            }}
          >
            <div
              ref={containerRef}
              className="relative select-none flex items-center justify-center"
              style={{
                backgroundColor: "#f5f5f5",
                width: "100%",
                height: "100%",
                overflow: "auto",
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-500">Loading image...</p>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : (
                pageImage && (
                  <div className="flex items-center justify-center p-4">
                    <Stage
                      width={stageSize.width}
                      height={stageSize.height}
                      style={{
                        backgroundColor: "white",
                        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Layer>
                        <Image
                          image={pageImage}
                          width={stageSize.width}
                          height={stageSize.height}
                          imageSmoothingEnabled={true}
                        />
                        {/* Rectangles */}
                        {rectangles
                          .filter((rect) => rect.pageNumber === currentPage)
                          .map((rect) => (
                            <KonvaRectangle
                              key={rect.id}
                              rect={{
                                ...rect,
                                x: rect.x * scale,
                                y: rect.y * scale,
                                width: rect.width * scale,
                                height: rect.height * scale,
                              }}
                              isSelected={selectedRect?.id === rect.id}
                              onChange={(newRect) => {
                                handleRectChange({
                                  ...newRect,
                                  x: newRect.x / scale,
                                  y: newRect.y / scale,
                                  width: newRect.width / scale,
                                  height: newRect.height / scale,
                                });
                              }}
                              onSelect={() => setSelectedRect(rect)}
                              cursorMode={cursorMode}
                              onHover={(isHovering) =>
                                (isHoveringRect.current = isHovering)
                              }
                            />
                          ))}
                        {/* Current drawing rectangle */}
                        {currentRect && (
                          <Rect
                            x={currentRect.x}
                            y={currentRect.y}
                            width={currentRect.width}
                            height={currentRect.height}
                            stroke="#00ff00"
                            strokeWidth={2}
                          />
                        )}
                      </Layer>
                    </Stage>
                  </div>
                )
              )}
            </div>
          </div>
          {/* Navigation Footer */}
          <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t z-[20] pointer-events-auto">
            <div className="flex justify-between items-center p-2 px-4">
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="flat"
                  onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                  onPress={() =>
                    setCurrentPage(Math.min(numPages, currentPage + 1))
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
                  onPress={() => setScale(Math.max(0.1, scale - 0.1))}
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
                  onPress={() => setScale(Math.min(5, scale + 0.1))}
                  isIconOnly
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-2/12 border-l">
          {/* Document Info */}
          <div className="p-4 border-b">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col">
                <span className="text-xs text-foreground-500">Document</span>
                <span className="text-sm font-medium truncate">
                  Sample Document
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground-500">Pages</span>
                <span className="text-sm font-medium">{numPages}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-foreground-500">Dimensions</span>
                <span className="text-sm font-medium">
                  {DocSample[currentPage - 1]?.dimensions.width || 0} x{" "}
                  {DocSample[currentPage - 1]?.dimensions.height || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Cursor Position */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-xs font-mono text-foreground-600 bg-foreground-100 px-2 py-1 rounded">
                  ({cursorPosition.x}, {cursorPosition.y})
                </div>
              </div>
            </div>
          </div>

          {/* Rectangles List */}
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
            <ScrollShadow className="flex-1">
              <div className="flex flex-col gap-2">
                {rectangles
                  .filter((rect) => rect.pageNumber === currentPage)
                  .map((rect) => (
                    <div
                      key={rect.id}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        selectedRect?.id === rect.id
                          ? "bg-primary/10"
                          : "hover:bg-foreground-100"
                      }`}
                      onClick={() => setSelectedRect(rect)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-mono">
                          ({rect.x}, {rect.y})
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="flat"
                        isIconOnly
                        onPress={() => deleteRectangle(rect.id)}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
              </div>
            </ScrollShadow>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSchema;
