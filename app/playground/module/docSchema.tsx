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
  }: {
    rect: Rectangle;
    isSelected: boolean;
    onSelect: () => void;
    onChange: (newAttrs: Rectangle) => void;
    cursorMode: CursorMode;
  }) => {
    const shapeRef = React.useRef<any>(null);
    const transformerRef = React.useRef<any>(null);

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
          draggable={cursorMode === "drag"}
          stroke={isSelected ? "#0066FF" : "#0066FF80"}
          strokeWidth={2}
          fill="transparent"
          onMouseDown={onSelect}
          onDragEnd={(e) => {
            onChange({
              ...rect,
              x: e.target.x(),
              y: e.target.y(),
            });
          }}
          onTransformEnd={(e) => {
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
          }}
        />
        {isSelected && cursorMode === "draw" && (
          <Transformer
            ref={transformerRef}
            boundBoxFunc={(oldBox, newBox) => {
              // Limit resize
              const minWidth = 5;
              const minHeight = 5;
              if (newBox.width < minWidth || newBox.height < minHeight) {
                return oldBox;
              }
              return newBox;
            }}
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
  const [currentPage, setCurrentPage] = useState(1);
  const startPointRef = React.useRef<{ x: number; y: number } | null>(null);

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

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (cursorMode === "drag") return;

      const stage = e.currentTarget;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

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
    [cursorMode, currentPage]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDrawing || !currentRect || !startPointRef.current) return;

      const stage = e.target as HTMLElement;
      const rect = stage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const width = x - startPointRef.current.x;
      const height = y - startPointRef.current.y;

      setCurrentRect({
        ...currentRect,
        width,
        height,
      });
    },
    [isDrawing, currentRect]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing && currentRect) {
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
    setCurrentRect(null);
    startPointRef.current = null;
  }, [isDrawing, currentRect, rectangles]);

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
          className="h-full relative select-none bg-foreground-100"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
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
