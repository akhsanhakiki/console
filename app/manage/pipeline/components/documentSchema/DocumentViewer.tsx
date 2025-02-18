import React from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import { Rectangle, Token, StageSize } from "./types";
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
}) => {
  const [hoveredToken, setHoveredToken] = React.useState<Token | null>(null);

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
                </Layer>
              </Stage>
            )
          )}
        </div>
      </div>
    </div>
  );
};
