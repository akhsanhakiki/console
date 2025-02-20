import React from "react";
import { Skeleton } from "@heroui/react";

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Static Header */}
      <div className="flex flex-row gap-1 items-center">
        <h1 className="text-xl font-semibold font-poppins text-foreground-900">
          Pipeline
        </h1>
      </div>

      {/* Content Area */}
      <div className="w-full h-full flex flex-col">
        {/* Tabs and Search Section */}
        <div className="flex-none mb-4">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
              {/* Tabs Skeleton */}
              <div className="flex gap-4">
                <Skeleton className="w-24 h-8 rounded-lg" />
                <Skeleton className="w-24 h-8 rounded-lg" />
              </div>
              {/* Search Bar Skeleton */}
              <Skeleton className="w-64 h-10 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 min-h-0">
          <div className="flex flex-col h-[calc(100vh-28rem)] overflow-scroll">
            {/* Table Header */}
            <div className="sticky top-0 z-20 bg-background">
              <div className="flex gap-4 p-4 border-b border-divider">
                <Skeleton className="w-1/5 h-6 rounded-lg" />
                <Skeleton className="w-1/5 h-6 rounded-lg" />
                <Skeleton className="w-2/5 h-6 rounded-lg" />
                <Skeleton className="w-1/5 h-6 rounded-lg" />
                <div className="w-8" /> {/* Space for actions column */}
              </div>
            </div>

            {/* Table Rows */}
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 border-b border-divider hover:bg-foreground-100 transition-all duration-200 ease-in-out"
              >
                <Skeleton className="w-1/5 h-5 rounded-lg" />
                <Skeleton className="w-1/5 h-5 rounded-lg" />
                <Skeleton className="w-2/5 h-5 rounded-lg" />
                <Skeleton className="w-1/5 h-5 rounded-lg" />
                <div className="w-8 flex justify-end">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Pagination */}
        <div className="flex-none mt-4">
          <div className="py-2 px-2 flex justify-between items-center">
            <div className="flex items-start gap-2 w-1/5">
              <Skeleton className="w-32 h-5 rounded-lg" />
              <Skeleton className="w-20 h-5 rounded-lg" />
            </div>
            <Skeleton className="w-48 h-8 rounded-lg" />
            <div className="flex w-1/5 justify-end">
              <Skeleton className="w-32 h-9 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
