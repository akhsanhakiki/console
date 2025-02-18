import { Button } from "@heroui/react";
import React from "react";

interface NavigationFooterProps {
  currentPage: number;
  numPages: number;
  scale: number;
  setCurrentPage: (page: number) => void;
  setScale: (scale: number) => void;
}

export const NavigationFooter: React.FC<NavigationFooterProps> = ({
  currentPage,
  numPages,
  scale,
  setCurrentPage,
  setScale,
}) => {
  return (
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
            onPress={() => setCurrentPage(Math.min(numPages, currentPage + 1))}
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
  );
};
