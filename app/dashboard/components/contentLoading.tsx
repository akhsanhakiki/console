import React from "react";
import { Skeleton } from "@heroui/react";
const contentLoading = () => {
  return (
    <div className="w-full flex flex-col gap-4 h-full">
      <div className="flex flex-col gap-4 flex-grow">
        {/* Card Data */}
        <div className="flex flex-row gap-4">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl p-4 w-1/4"
            >
              <div className="flex flex-row items-center justify-between">
                <Skeleton className="w-24 h-4 rounded-md" />
                <Skeleton className="w-4 h-4 rounded-full" />
              </div>
              <Skeleton className="w-16 h-6 rounded-md" />
            </div>
          ))}
        </div>

        {/* Chart Data */}
        <div className="flex flex-row gap-4 w-full">
          <div className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl w-3/5 p-4">
            <div className="flex flex-row justify-between">
              <Skeleton className="w-40 h-4 rounded-md" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
            <Skeleton className="w-full h-48 rounded-md" />
          </div>

          <div className="flex flex-col gap-4 w-2/5">
            <div className="flex flex-row gap-4">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-2xl gap-4 p-4 w-1/2 bg-foreground-100"
                >
                  <div className="flex flex-row justify-between">
                    <Skeleton className="w-10 h-10 rounded-2xl" />
                    <Skeleton className="w-4 h-4 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-24 h-6 rounded-md" />
                    <Skeleton className="w-32 h-4 rounded-md" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-row gap-4">
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col rounded-2xl gap-4 p-4 w-1/2 bg-foreground-100"
                >
                  <div className="flex flex-row justify-between">
                    <Skeleton className="w-10 h-10 rounded-2xl" />
                    <Skeleton className="w-4 h-4 rounded-full" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Skeleton className="w-24 h-6 rounded-md" />
                    <Skeleton className="w-32 h-4 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Extraction Logs */}
        <div className="flex flex-row gap-4 w-full h-full flex-grow">
          <div className="flex flex-col gap-2 border-1 border-foreground-200 rounded-2xl w-3/5 p-4">
            <div className="flex flex-row justify-between">
              <Skeleton className="w-32 h-4 rounded-md" />
              <Skeleton className="w-4 h-4 rounded-full" />
            </div>
            <Skeleton className="w-full h-48 rounded-md" />
          </div>
          <div className="flex flex-col gap-2 w-2/5">
            {[...Array(2)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col border-1 border-foreground-200 rounded-2xl gap-4 p-4 flex-grow"
              >
                <div className="flex flex-row justify-between">
                  <Skeleton className="w-32 h-4 rounded-md" />
                  <Skeleton className="w-4 h-4 rounded-full" />
                </div>
                <Skeleton className="w-full h-24 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default contentLoading;
