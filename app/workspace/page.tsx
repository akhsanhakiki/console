"use client";

import React, { useEffect } from "react";
import { Button } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import { Card, CardBody } from "@heroui/react";
import { Divider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { clsx } from "clsx";

// Icons
import ScanIconOut from "@/public/images/icons/scanIconOut";
import PipelineIconOut from "@/public/images/icons/pipelineIconOut";
import DocTypeIconOut from "@/public/images/icons/docTypeIconOut";
import SchemaIconOut from "@/public/images/icons/schemaIconOut";

const Workspace = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const {
    workspaces,
    setWorkspace,
    fetchWorkspaces,
    isLoading,
    selectedWorkspace,
  } = useWorkspaceStore();

  useEffect(() => {
    if (organization?.id) {
      fetchWorkspaces(organization.id);
    }
  }, [organization?.id]);

  const handleWorkspaceSelect = (workspaceId: string) => {
    setWorkspace(workspaceId);
    // Small delay to ensure the state is updated before navigation
    setTimeout(() => {
      router.push("/dashboard");
    }, 100);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col px-4 py-4 w-full h-full gap-4">
        <h1 className="text-xl font-semibold">Loading workspaces...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-4 py-4 w-full h-full gap-4">
      <h1 className="text-xl font-semibold">Select Workspace</h1>
      <div className="flex flex-col gap-2 h-full">
        <div className="gap-4 grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 h-1/4">
          {workspaces.map((item) => (
            <Card
              key={item.id}
              isPressable
              shadow="none"
              onPress={() => handleWorkspaceSelect(item.id.toString())}
              className={clsx(
                "bg-foreground-50 overflow-hidden rounded-2xl hover:shadow-md transition-all duration-200 ease-in-out",
                item.id.toString() === selectedWorkspace
                  ? "border-primary border-2"
                  : "border-foreground-100 border-1"
              )}
            >
              <CardBody className="p-4 flex flex-col justify-between">
                {/* Workspace Name and Last Updated */}
                <div className="flex flex-col gap-1">
                  <p className="text-foreground-800 font-normal font-poppins text-sm">
                    {item.name}
                  </p>
                  <p className="text-foreground-400 font-normal font-poppins text-xs">
                    {item.lastUpdated}
                  </p>
                </div>
                {/* Workspace Details */}
                <div className="flex flex-row gap-3 w-full justify-start">
                  <div className="flex flex-row gap-1 items-center">
                    <ScanIconOut className="w-4 h-4 text-foreground-600" />
                    <p className="text-foreground-600 font-normal font-poppins text-sm">
                      {item.extractor || "0"}
                    </p>
                  </div>
                  <Divider orientation="vertical" />
                  <div className="flex flex-row gap-1 items-center">
                    <PipelineIconOut className="w-4 h-4 text-foreground-600" />
                    <p className="text-foreground-600 font-normal font-poppins text-sm">
                      {item.pipeline || "0"}
                    </p>
                  </div>
                  <Divider orientation="vertical" />
                  <div className="flex flex-row gap-1 items-center">
                    <DocTypeIconOut className="w-4 h-4 text-foreground-600" />
                    <p className="text-foreground-600 font-normal font-poppins text-sm">
                      {item.doctype || "0"}
                    </p>
                  </div>
                  <Divider orientation="vertical" />
                  <div className="flex flex-row gap-1 items-center">
                    <SchemaIconOut className="w-4 h-4 text-foreground-600" />
                    <p className="text-foreground-600 font-normal font-poppins text-sm">
                      {item.schema || "0"}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex w-full justify-end gap-2">
        <Button
          className="text-foreground-800 border-foreground-300"
          variant="bordered"
        >
          <FiPlus className="text-foreground-800" />
          New Workspace
        </Button>
      </div>
    </div>
  );
};

export default Workspace;
