import { Button, ScrollShadow, Accordion, AccordionItem } from "@heroui/react";
import React from "react";
import { FiChevronRight, FiFolder, FiFile, FiEdit2 } from "react-icons/fi";
import { Rectangle } from "./types";

interface LeftSidebarProps {
  rectangles: Rectangle[];
  currentPage: number;
  numPages: number;
  selectedRect: Rectangle | null;
  setSelectedRect: (rect: Rectangle | null) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  rectangles,
  currentPage,
  numPages,
  selectedRect,
  setSelectedRect,
}) => {
  // Group rectangles by page
  const rectanglesByPage = React.useMemo(() => {
    const pages: { [key: number]: Rectangle[] } = {};
    for (let i = 1; i <= numPages; i++) {
      pages[i] = rectangles.filter((rect) => rect.pageNumber === i);
    }
    return pages;
  }, [rectangles, numPages]);

  return (
    <div className="w-2/12 border-1">
      {/* Tree Structure Header */}
      <div className="p-4 border-b">
        <span className="text-xs font-medium text-foreground-500 font-poppins">
          Document Structure
        </span>
      </div>

      {/* Tree Structure Content */}
      <ScrollShadow className="h-[calc(100vh-10rem)]">
        <Accordion
          variant="shadow"
          defaultExpandedKeys={[currentPage.toString()]}
        >
          {Object.entries(rectanglesByPage).map(([page, pageRectangles]) => (
            <AccordionItem
              key={page}
              aria-label={`Page ${page}`}
              title={
                <div className="flex items-center gap-2 font-poppins">
                  <FiFolder className="text-primary" />
                  <span className="text-sm">Page {page}</span>
                  <span className="text-xs text-foreground-400">
                    ({pageRectangles.length})
                  </span>
                </div>
              }
              className={Number(page) === currentPage ? "bg-primary/5" : ""}
              indicator={<FiChevronRight />}
            >
              <div className="flex flex-col gap-1 pl-6">
                {pageRectangles.map((rect) => (
                  <div
                    key={rect.id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                      selectedRect?.id === rect.id
                        ? "bg-primary/10"
                        : "hover:bg-foreground-100"
                    }`}
                    onClick={() => setSelectedRect(rect)}
                  >
                    <FiFile className="text-foreground-500" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-poppins truncate">
                          {rect.tokens && rect.tokens.length > 0
                            ? rect.tokens[0].text
                            : `Rectangle ${rect.id.slice(-4)}`}
                        </span>
                        {rect.tokens && rect.tokens.length > 1 && (
                          <span className="text-xs text-foreground-400">
                            +{rect.tokens.length - 1}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-foreground-400 font-mono">
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
                    </div>
                    <Button
                      size="sm"
                      variant="light"
                      isIconOnly
                      className="opacity-0 group-hover:opacity-100"
                      onPress={() => setSelectedRect(rect)}
                    >
                      <FiEdit2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollShadow>
    </div>
  );
};
