import React from "react";
import { Skeleton } from "@heroui/react";

const Loading = () => {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Static Header */}
      <div className="flex flex-row gap-2 items-center">
        <h1 className="text-xl font-semibold font-poppins text-foreground-900">
          Playground
        </h1>
      </div>

      <div className="flex flex-col gap-4 w-full h-full flex-grow">
        {/* "New" Section Title Skeleton */}
        <Skeleton className="w-16 h-6 rounded-lg" />

        {/* Pipeline Cards Skeleton */}
        <div className="flex flex-row gap-4 overflow-hidden">
          {[...Array(4)].map((_, index) => (
            <Skeleton
              key={index}
              className="flex-none w-[320px] h-[160px] rounded-xl"
            />
          ))}
        </div>

        <div className="h-1 border-b border-foreground-200" />

        {/* Recent Playgrounds Section */}
        <div className="flex flex-col gap-4">
          {/* Header with Search Skeleton */}
          <div className="flex justify-between items-center">
            <Skeleton className="w-48 h-6 rounded-lg" />
            <Skeleton className="w-64 h-10 rounded-lg" />
          </div>

          {/* Table Skeleton */}
          <div className="flex flex-col gap-2">
            {/* Table Header */}
            <div className="flex gap-4 p-4 bg-background rounded-t-lg">
              <Skeleton className="w-1/4 h-6 rounded-lg" />
              <Skeleton className="w-1/4 h-6 rounded-lg" />
              <Skeleton className="w-1/3 h-6 rounded-lg" />
              <Skeleton className="w-1/6 h-6 rounded-lg" />
            </div>

            {/* Table Rows */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="flex gap-4 p-4 bg-background hover:bg-foreground-100 transition-colors"
              >
                <Skeleton className="w-1/4 h-6 rounded-lg" />
                <Skeleton className="w-1/4 h-6 rounded-lg" />
                <Skeleton className="w-1/3 h-6 rounded-lg" />
                <Skeleton className="w-1/6 h-6 rounded-lg" />
              </div>
            ))}
          </div>

          {/* Pagination Skeleton */}
          <div className="flex justify-between items-center p-2">
            <Skeleton className="w-32 h-6 rounded-lg" />
            <Skeleton className="w-48 h-8 rounded-lg" />
            <Skeleton className="w-32 h-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
