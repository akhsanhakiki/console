import React from "react";
import { Skeleton, Divider } from "@heroui/react";

const Loading = () => {
  // Create an array of 8 items to show as loading skeletons
  const skeletonItems = Array(8).fill(null);

  return (
    <div className="flex flex-row gap-8">
      {/* Version History Section */}
      <div className="flex flex-col gap-2 min-w-[240px]">
        <h2 className="text-base font-medium font-poppins mb-4 text-foreground-500">
          Version History
        </h2>
        {skeletonItems.map((_, index) => (
          <Skeleton
            key={index}
            className="rounded-xl w-full min-h-[64px]"
            disableAnimation={false}
          >
            <div className="w-full h-16 rounded-xl bg-default-200"></div>
          </Skeleton>
        ))}
      </div>

      <Divider orientation="vertical" className="h-auto" />

      {/* Release Details Section */}
      <div className="flex flex-col gap-4 flex-1 max-w-[800px]">
        <h2 className="text-base font-medium font-poppins mb-4 text-foreground-500">
          Release Details
        </h2>
        <div className="flex flex-col gap-6">
          {/* Title Skeleton */}
          <Skeleton className="w-3/4 rounded-lg">
            <div className="h-8 rounded-lg bg-default-200"></div>
          </Skeleton>

          {/* Description Skeleton */}
          <Skeleton className="w-full rounded-lg">
            <div className="h-20 rounded-lg bg-default-200"></div>
          </Skeleton>

          {/* Remarks Skeletons */}
          <div className="flex flex-col gap-3">
            {Array(7)
              .fill(null)
              .map((_, index) => (
                <Skeleton key={index} className="w-full rounded-lg">
                  <div className="h-6 rounded-lg bg-default-200"></div>
                </Skeleton>
              ))}
          </div>

          <div className="h-1 border-b border-foreground-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
