import React, { useState, useRef } from "react";
import { Stage, Layer, Image, Rect, Line } from "react-konva";
import {
  Rectangle,
  Token,
  StageSize,
  TableColumn,
  TableColumnDrag,
} from "./types";
import { KonvaRectangle } from "./KonvaRectangle";
import DocSample from "@/public/sample/Ezdocs OCR Pages.json";

interface DocumentViewerProps {
  pageImage: HTMLImageElement | null;
  stageSize: StageSize;
  loading: boolean;
  error: string | null;
  tokens: Token[];
  rectangles: Rectangle[];
  currentRect: Rectangle | null;
  selectedRect: Rectangle | null;
  currentPage: number;
  scale: number;
  stageRef: React.RefObject<HTMLDivElement>;
  containerRef: React.RefObject<HTMLDivElement>;
  isDrawing: boolean;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: () => void;
  handleRectChange: (rect: Rectangle) => void;
  setSelectedRect: (rect: Rectangle | null) => void;
  isHoveringRect?: (isHovering: boolean) => void;
  isSelectingToken: boolean;
  selectedToken: Token | null;
  setSelectedToken: (token: Token | null) => void;
  onRectangleComplete?: (rect: Rectangle) => void;
  isEditingTableHeader: boolean;
  tableHeaderRect: Rectangle | null;
  tableColumns: TableColumn[];
  setTableColumns: (columns: TableColumn[]) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  pageImage,
  stageSize,
  loading,
  error,
  tokens,
  rectangles,
  currentRect,
  selectedRect,
  currentPage,
  scale,
  stageRef,
  containerRef,
  isDrawing,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleRectChange,
  setSelectedRect,
  isHoveringRect,
  isSelectingToken,
  selectedToken,
  setSelectedToken,
  onRectangleComplete,
  isEditingTableHeader,
  tableHeaderRect,
  tableColumns,
  setTableColumns,
}) => {
  const [hoveredToken, setHoveredToken] = React.useState<Token | null>(null);
  const [columnDrag, setColumnDrag] = useState<TableColumnDrag | null>(null);
  const [hoveredColumnBorder, setHoveredColumnBorder] = useState<string | null>(
    null
  );

  const handleRectComplete = () => {
    if (currentRect && onRectangleComplete && isEditingTableHeader) {
      onRectangleComplete(currentRect);
    }
  };

  React.useEffect(() => {
    if (!isDrawing && currentRect) {
      handleRectComplete();
    }
  }, [isDrawing, currentRect]);

  const handleColumnResize = (e: MouseEvent) => {
    if (!columnDrag || !tableHeaderRect || !stageRef.current) return;

    const canvas = stageRef.current.querySelector("canvas");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / stageSize.width;
    const deltaX = mouseX - columnDrag.startX;

    // Find the current column
    const currentColumnIndex = tableColumns.findIndex(
      (col) => col.id === columnDrag.columnId
    );
    if (
      currentColumnIndex === -1 ||
      currentColumnIndex === tableColumns.length - 1
    )
      return;

    const currentColumn = tableColumns[currentColumnIndex];
    const remainingColumns = tableColumns.slice(currentColumnIndex + 1);
    const totalRemainingWidth = remainingColumns.reduce(
      (sum, col) => sum + col.normalizedWidth,
      0
    );

    // Convert minimum width from pixels to normalized width
    const minWidthPx = 50;
    const tableWidthPx = tableHeaderRect.normalizedWidth * stageSize.width;
    const minWidth = minWidthPx / tableWidthPx;

    // Calculate maximum width leaving space for other columns at minimum width
    const maxWidth = 1 - minWidth * (tableColumns.length - 1);
    const newWidth = Math.max(
      minWidth,
      Math.min(maxWidth, columnDrag.initialWidth + deltaX)
    );
    const widthDelta = newWidth - currentColumn.normalizedWidth;

    // If width didn't change, no need to update
    if (widthDelta === 0) return;

    // Calculate new widths for remaining columns proportionally
    const scale = (totalRemainingWidth - widthDelta) / totalRemainingWidth;
    const updatedColumns = [...tableColumns];

    // Update current column width
    updatedColumns[currentColumnIndex] = {
      ...currentColumn,
      normalizedWidth: newWidth,
    };

    // Update remaining columns proportionally while respecting minimum width
    let accumulatedX = currentColumn.normalizedX + newWidth;
    let remainingSpace = 1 - accumulatedX;
    const columnsToAdjust = remainingColumns.length;

    remainingColumns.forEach((col, idx) => {
      // For the last column, use all remaining space
      if (idx === columnsToAdjust - 1) {
        const lastColumnWidth = Math.max(minWidth, remainingSpace);
        updatedColumns[currentColumnIndex + 1 + idx] = {
          ...col,
          normalizedX: accumulatedX,
          normalizedWidth: lastColumnWidth,
        };
        accumulatedX += lastColumnWidth;
      } else {
        // For other columns, maintain proportion but respect minimum width
        const adjustedWidth = Math.max(minWidth, col.normalizedWidth * scale);
        updatedColumns[currentColumnIndex + 1 + idx] = {
          ...col,
          normalizedX: accumulatedX,
          normalizedWidth: adjustedWidth,
        };
        accumulatedX += adjustedWidth;
        remainingSpace -= adjustedWidth;
      }
    });

    setTableColumns(updatedColumns);
  };

  // Add event listeners for column resizing
  React.useEffect(() => {
    if (!columnDrag) return;

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleColumnResize(e);
    };

    const handleMouseUp = () => {
      setColumnDrag(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [columnDrag, tableColumns, tableHeaderRect, stageSize.width]);

  return (
    <div
      ref={stageRef}
      className="relative flex-1 select-none bg-foreground-100"
      onMouseDown={
        !isSelectingToken && (isEditingTableHeader || !isDrawing)
          ? handleMouseDown
          : undefined
      }
      onMouseMove={
        !isSelectingToken && (isEditingTableHeader || !isDrawing)
          ? handleMouseMove
          : undefined
      }
      onMouseUp={
        !isSelectingToken && (isEditingTableHeader || !isDrawing)
          ? handleMouseUp
          : undefined
      }
      onMouseLeave={() => {
        if (isDrawing) {
          handleMouseUp();
        }
      }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 select-none overflow-auto bg-foreground-100"
      >
        <div
          style={{
            minWidth: "100%",
            minHeight: "100%",
            width: stageSize.width > 0 ? stageSize.width + 128 : "100%",
            height: stageSize.height > 0 ? stageSize.height + 128 : "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-500">Loading image...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center">
              <p className="text-sm text-red-500">{error}</p>
            </div>
          ) : (
            pageImage && (
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
                  {/* OCR Tokens */}
                  {tokens.map((token) => {
                    const currentPageData = DocSample[currentPage - 1];
                    const docWidth = currentPageData.dimensions?.width;
                    const docHeight = currentPageData.dimensions?.height;

                    if (!docWidth || !docHeight) return null;

                    const originalX = token.bounding_box.x * docWidth;
                    const originalY = token.bounding_box.y * docHeight;
                    const originalWidth = token.bounding_box.width * docWidth;
                    const originalHeight =
                      token.bounding_box.height * docHeight;

                    const x = originalX * scale;
                    const y = originalY * scale;
                    const width = originalWidth * scale;
                    const height = originalHeight * scale;

                    const isHovered = hoveredToken?.id === token.id;
                    const isSelected = selectedToken?.id === token.id;

                    return (
                      <Rect
                        key={token.id}
                        x={x}
                        y={y}
                        width={width}
                        height={height}
                        stroke={
                          isSelectingToken
                            ? isSelected
                              ? "#0066FF"
                              : isHovered
                                ? "#0066FFB0"
                                : "#0066FF40"
                            : "#0066FF80"
                        }
                        strokeWidth={isSelected || isHovered ? 2 : 1.5}
                        fill={
                          isSelectingToken
                            ? isSelected
                              ? "rgba(0, 102, 255, 0.1)"
                              : isHovered
                                ? "rgba(0, 102, 255, 0.05)"
                                : "transparent"
                            : "transparent"
                        }
                        onMouseEnter={() => {
                          if (isSelectingToken) {
                            setHoveredToken(token);
                            const stage =
                              stageRef.current?.querySelector("canvas");
                            if (stage) {
                              stage.style.cursor = "pointer";
                            }
                          }
                        }}
                        onMouseLeave={() => {
                          if (isSelectingToken) {
                            setHoveredToken(null);
                            const stage =
                              stageRef.current?.querySelector("canvas");
                            if (stage) {
                              stage.style.cursor = "default";
                            }
                          }
                        }}
                        onClick={() => {
                          if (isSelectingToken) {
                            setSelectedToken(token);
                          }
                        }}
                      />
                    );
                  })}
                  {/* User drawn Rectangles */}
                  {rectangles
                    .filter((rect) => rect.pageNumber === currentPage)
                    .map((rect) => {
                      const screenRect = {
                        ...rect,
                        x: rect.normalizedX * stageSize.width,
                        y: rect.normalizedY * stageSize.height,
                        width: rect.normalizedWidth * stageSize.width,
                        height: rect.normalizedHeight * stageSize.height,
                      };

                      return (
                        <KonvaRectangle
                          key={rect.id}
                          rect={screenRect}
                          isSelected={selectedRect?.id === rect.id}
                          onChange={(newRect) => {
                            handleRectChange(newRect);
                          }}
                          onSelect={() => setSelectedRect(rect)}
                          cursorMode="draw"
                          onHover={isHoveringRect || (() => {})}
                        />
                      );
                    })}
                  {/* Table Header Rectangle */}
                  {tableHeaderRect &&
                    tableHeaderRect.pageNumber === currentPage && (
                      <Rect
                        x={tableHeaderRect.normalizedX * stageSize.width}
                        y={tableHeaderRect.normalizedY * stageSize.height}
                        width={
                          tableHeaderRect.normalizedWidth * stageSize.width
                        }
                        height={
                          tableHeaderRect.normalizedHeight * stageSize.height
                        }
                        stroke="#00C853"
                        strokeWidth={2}
                        dash={[5, 5]}
                      />
                    )}
                  {/* Current drawing rectangle */}
                  {currentRect && (
                    <Rect
                      x={currentRect.normalizedX * stageSize.width}
                      y={currentRect.normalizedY * stageSize.height}
                      width={currentRect.normalizedWidth * stageSize.width}
                      height={currentRect.normalizedHeight * stageSize.height}
                      stroke="#00ff00"
                      strokeWidth={2}
                    />
                  )}
                  {/* Table Columns */}
                  {tableHeaderRect &&
                    tableColumns.map((column, index) => {
                      if (index === tableColumns.length - 1) return null; // Don't draw after last column

                      const headerX =
                        tableHeaderRect.normalizedX * stageSize.width;
                      const headerY =
                        tableHeaderRect.normalizedY * stageSize.height;
                      const columnX =
                        headerX +
                        column.normalizedX *
                          tableHeaderRect.normalizedWidth *
                          stageSize.width;
                      const columnWidth =
                        column.normalizedWidth *
                        tableHeaderRect.normalizedWidth *
                        stageSize.width;
                      const columnHeight = stageSize.height - headerY;

                      return (
                        <React.Fragment key={column.id}>
                          <Rect
                            x={columnX}
                            y={headerY}
                            width={columnWidth}
                            height={columnHeight}
                            stroke={
                              hoveredColumnBorder === column.id
                                ? "#0066FF"
                                : "#0066FF80"
                            }
                            strokeWidth={
                              hoveredColumnBorder === column.id ? 2 : 1
                            }
                            dash={[5, 5]}
                            fill="transparent"
                            onMouseEnter={(e) => {
                              setHoveredColumnBorder(column.id);
                              const stage = e.target.getStage();
                              if (stage) {
                                stage.container().style.cursor = "col-resize";
                              }
                            }}
                            onMouseLeave={(e) => {
                              setHoveredColumnBorder(null);
                              const stage = e.target.getStage();
                              if (stage) {
                                stage.container().style.cursor = "default";
                              }
                            }}
                          />
                          {/* Right border for resizing */}
                          <Rect
                            x={columnX + columnWidth - 4}
                            y={headerY}
                            width={8}
                            height={columnHeight}
                            fill="transparent"
                            onMouseEnter={(e) => {
                              setHoveredColumnBorder(column.id);
                              const stage = e.target.getStage();
                              if (stage) {
                                stage.container().style.cursor = "col-resize";
                              }
                            }}
                            onMouseLeave={(e) => {
                              setHoveredColumnBorder(null);
                              const stage = e.target.getStage();
                              if (stage) {
                                stage.container().style.cursor = "default";
                              }
                            }}
                            onMouseDown={(e) => {
                              e.cancelBubble = true;
                              const stage = e.target.getStage();
                              if (!stage) return;

                              const rect = stage
                                .container()
                                .getBoundingClientRect();
                              const mouseX =
                                (e.evt.clientX - rect.left) / stageSize.width;
                              setColumnDrag({
                                columnId: column.id,
                                startX: mouseX,
                                initialWidth: column.normalizedWidth,
                              });
                            }}
                          />
                        </React.Fragment>
                      );
                    })}
                  {/* Last Column */}
                  {tableHeaderRect && tableColumns.length > 0 && (
                    <Rect
                      x={
                        tableHeaderRect.normalizedX * stageSize.width +
                        tableColumns[tableColumns.length - 1].normalizedX *
                          tableHeaderRect.normalizedWidth *
                          stageSize.width
                      }
                      y={tableHeaderRect.normalizedY * stageSize.height}
                      width={
                        tableColumns[tableColumns.length - 1].normalizedWidth *
                        tableHeaderRect.normalizedWidth *
                        stageSize.width
                      }
                      height={
                        stageSize.height -
                        tableHeaderRect.normalizedY * stageSize.height
                      }
                      stroke="#0066FF80"
                      strokeWidth={1}
                      dash={[5, 5]}
                      fill="transparent"
                    />
                  )}
                </Layer>
              </Stage>
            )
          )}
        </div>
      </div>
    </div>
  );
};
