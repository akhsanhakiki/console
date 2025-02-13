import { Button, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { BsPersonWorkspace } from "react-icons/bs";
import WorkspaceModal from "./workspaceModal";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useRouter } from "next/navigation";
import { useOrganization } from "@clerk/nextjs";

interface WorkspaceFormData {
  name: string;
}

const EmptyWorkspace = () => {
  const router = useRouter();
  const { organization } = useOrganization();
  const { setWorkspace, fetchWorkspaces } = useWorkspaceStore();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleCreateWorkspace = async (formData: WorkspaceFormData) => {
    try {
      const response = await fetch("/api/workspaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          organizationId: organization?.id || "",
          workspace: {
            name: formData.name,
            extractor: 0,
            pipeline: 0,
            doctype: 0,
            schema: 0,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create workspace");
      }

      const data = await response.json();

      // Refresh workspace list
      await fetchWorkspaces(organization?.id || "");

      // Set workspace and redirect
      if (data && data.id) {
        setWorkspace(data.id.toString());
        router.push("/dashboard");
      } else {
        throw new Error("Invalid workspace data received");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-4 justify-center items-center h-full">
      <BsPersonWorkspace className="text-foreground-600 w-32 h-32 p-8 rounded-3xl " />
      <div className="flex flex-col gap-2 justify-center items-center">
        <p className="text-foreground-800 font-poppins font-medium text-sm">
          No workspaces found
        </p>
        <p className="text-foreground-500 font-poppins font-normal text-sm">
          Create a new workspace to get started
        </p>
      </div>
      <Button
        className="text-foreground-800 border-foreground-300 w-fit"
        variant="bordered"
        onPress={onOpen}
      >
        <FiPlus className="text-foreground-800" />
        New Workspace
      </Button>
      {/* Workspace Creation Modal */}
      <WorkspaceModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleCreateWorkspace}
      />
    </div>
  );
};

export default EmptyWorkspace;
