import { Button, Divider, ScrollShadow, Snippet } from "@heroui/react";
import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { Rectangle } from "./types";
import DocSample from "@/public/sample/Ezdocs OCR Pages.json";

interface RightSidebarProps {
  currentPage: number;
  numPages: number;
  scale: number;
  rectangles: Rectangle[];
  selectedRect: Rectangle | null;
  setSelectedRect: (rect: Rectangle | null) => void;
  deleteRectangle: (id: string) => void;
  cursorPosition: { x: number; y: number };
  setRectangles: (rectangles: Rectangle[]) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  currentPage,
  numPages,
  scale,
  rectangles,
  selectedRect,
  setSelectedRect,
  deleteRectangle,
  cursorPosition,
  setRectangles,
}) => {
  return (
    <div className="w-2/12 border-1">
      {/* Document Info */}
      <div className="p-4 border-b">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-medium text-foreground-500 font-poppins">
            Document Info
          </span>
          {/* Document name */}
          <div className="flex flex-col gap-1">
            <span className="text-xs text-foreground-500 font-poppins">
              Document name
            </span>
            <span className="text-sm font-normal truncate font-poppins">
              Sample Document
            </span>
          </div>
          {/* Pages and Dimensions */}
          <div className="flex flex-row gap-4">
            {/* Pages */}
            <div className="flex flex-col w-1/2 gap-1">
              <span className="text-xs text-foreground-500 font-poppins">
                Pages
              </span>
              <span className="text-sm font-normal font-poppins">
                {numPages}
              </span>
            </div>
            {/* Dimensions */}
            <div className="flex flex-col w-1/2 gap-1">
              <span className="text-xs text-foreground-500 font-poppins">
                Dimensions
              </span>
              <span className="text-sm font-normal font-poppins">
                {DocSample[currentPage - 1]?.dimensions.width || 0} x{" "}
                {DocSample[currentPage - 1]?.dimensions.height || 0}
              </span>
            </div>
          </div>
          {/* Cursor position */}
          <div className="flex flex-row gap-4">
            <div className="flex flex-col w-full gap-1">
              <span className="text-xs text-foreground-500 font-poppins w-full">
                Cursor position
              </span>
              <div className="flex flex-row gap-2 w-full">
                <div className="flex flex-row text-sm font-normal font-poppins bg-foreground-100 px-2 py-1 rounded gap-1 w-1/2">
                  <span>X:</span>
                  {(() => {
                    const normalizedX =
                      cursorPosition.x /
                      (DocSample[currentPage - 1]?.dimensions.width * scale ||
                        1);
                    return normalizedX >= 0 && normalizedX <= 1
                      ? normalizedX.toFixed(6)
                      : "-";
                  })()}
                </div>
                <div className="flex flex-row text-sm font-normal font-poppins bg-foreground-100 px-2 py-1 rounded gap-1 w-1/2">
                  <span>Y:</span>
                  {(() => {
                    const normalizedY =
                      cursorPosition.y /
                      (DocSample[currentPage - 1]?.dimensions.height * scale ||
                        1);
                    return normalizedY >= 0 && normalizedY <= 1
                      ? normalizedY.toFixed(6)
                      : "-";
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Rectangles List */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-foreground-500 font-poppins">
            Rectangles
          </span>
          <Button
            variant="light"
            className="font-poppins"
            size="sm"
            onPress={() => setRectangles([])}
          >
            Clear all
          </Button>
        </div>
        <ScrollShadow className="flex-1">
          <div className="flex flex-col gap-2 overflow-hidden">
            {rectangles
              .filter((rect) => rect.pageNumber === currentPage)
              .map((rect) => (
                <div
                  key={rect.id}
                  className={`flex flex-col gap-2 p-2 rounded cursor-pointer ${
                    selectedRect?.id === rect.id
                      ? "bg-primary/10"
                      : "hover:bg-foreground-100"
                  }`}
                  onClick={() => setSelectedRect(rect)}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-mono">
                      (
                      {rect.normalizedX >= 0 && rect.normalizedX <= 1
                        ? rect.normalizedX.toFixed(6)
                        : "-"}
                      ,{" "}
                      {rect.normalizedY >= 0 && rect.normalizedY <= 1
                        ? rect.normalizedY.toFixed(6)
                        : "-"}
                      )
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
                  {rect.tokens && rect.tokens.length > 0 && (
                    <div className="text-xs text-foreground-600 bg-foreground-50 p-2 rounded">
                      {rect.tokens.map((token, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center"
                        >
                          <span>{token.text}</span>
                          <span className="text-foreground-400">
                            {Math.round(token.confidence * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </ScrollShadow>
      </div>
    </div>
  );
};
