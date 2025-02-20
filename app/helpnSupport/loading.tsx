import React from "react";
import { Skeleton } from "@heroui/react";

const Loading = () => {
  return (
    <div className="flex flex-row gap-6 h-full">
      {/* Left section - Contact Information */}
      <div className="flex flex-col gap-4 w-1/4">
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col gap-3">
          {/* Contact Card Skeletons */}
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="flex flex-row gap-4 border-1 border-foreground-200 rounded-xl px-4 py-2 items-center"
            >
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="flex flex-row gap-2 justify-end pr-4">
          <Skeleton className="h-9 w-24 rounded-lg" />
        </div>
      </div>

      {/* Divider */}
      <div className="w-[1px] bg-foreground-200" />

      {/* Right section - FAQ */}
      <div className="flex flex-col gap-2 w-2/4">
        <Skeleton className="h-6 w-32 mb-2" />
        <div className="flex flex-col gap-2 border-1 border-foreground-200 p-4 rounded-xl">
          {/* FAQ Item Skeletons */}
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 py-3 border-b-1 border-foreground-200"
            >
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
