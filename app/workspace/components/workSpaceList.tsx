import { Button } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Divider } from "@heroui/react";
import { FiPlus } from "react-icons/fi";
import clsx from "clsx";

// Icons
import ScanIconOut from "@/public/images/icons/scanIconOut";
import PipelineIconOut from "@/public/images/icons/pipelineIconOut";
import DocTypeIconOut from "@/public/images/icons/docTypeIconOut";
import SchemaIconOut from "@/public/images/icons/schemaIconOut";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import EmptyWorkshop from "./emptyWorkspace";

const WorkshopList = () => {
  const router = useRouter();
  const { organization, isLoaded: isOrgLoaded } = useOrganization();
  const { user, isLoaded: isUserLoaded } = useUser();
  const {
    workspaces,
    setWorkspace,
    fetchWorkspaces,
    isLoading,
    selectedWorkspace,
    clearWorkspaceState,
  } = useWorkspaceStore();

  useEffect(() => {
    // Wait until both org and user data are loaded
    if (!isOrgLoaded || !isUserLoaded) return;

    // Clear existing workspace state when context changes
    clearWorkspaceState();

    const fetchData = async () => {
      if (organization?.id) {
        // Organization context
        await fetchWorkspaces(organization.id);
      } else if (user?.id) {
        // Personal account context - only fetch personal workspaces
        await fetchWorkspaces("");
      }
    };

    fetchData();
  }, [organization?.id, user?.id, isOrgLoaded, isUserLoaded]);

  const handleWorkspaceSelect = (workspaceId: string) => {
    setWorkspace(workspaceId);
    router.push("/dashboard");
  };

  const handleCreateWorkspace = () => {
    // TODO: Implement workspace creation
    console.log(
      "Creating new workspace for:",
      organization?.id || "personal account"
    );
  };

  // Show loading state while Clerk loads user/org data
  if (!isOrgLoaded || !isUserLoaded || isLoading) {
    return (
      <div className="flex flex-col px-4 py-4 w-full h-full gap-4">
        <h1 className="text-xl font-semibold">Loading workspaces...</h1>
      </div>
    );
  }

  // Show empty state if no workspaces
  if (workspaces.length === 0) {
    return <EmptyWorkshop />;
  }

  return (
    <div className="flex flex-col px-4 py-4 w-full h-full gap-4">
      <h1 className="text-xl font-semibold">
        {organization
          ? `${organization.name} Workspaces`
          : "Personal Workspaces"}
      </h1>
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
          onClick={handleCreateWorkspace}
        >
          <FiPlus className="text-foreground-800" />
          New Workspace
        </Button>
      </div>
    </div>
  );
};

export default WorkshopList;
