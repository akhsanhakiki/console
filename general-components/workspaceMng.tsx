import {
  ClerkLoading,
  OrganizationSwitcher,
  useOrganization,
  useOrganizationList,
} from "@clerk/nextjs";
import React, { useState, useRef, useEffect } from "react";
import { HiOutlineSlash } from "react-icons/hi2";
import { HiChevronDown } from "react-icons/hi";
import { useWorkspaceStore } from "@/stores/workspaceStore";

interface Workspace {
  id: number;
  name: string;
  organizationID: string;
  lastUpdated: string;
}

const WorkspaceMng = () => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Get current organization
  const { organization } = useOrganization();
  const { userMemberships, isLoaded } = useOrganizationList();

  // Get workspace store state and actions
  const {
    workspaces,
    selectedWorkspace,
    isLoading,
    error,
    fetchWorkspaces,
    setWorkspace,
    initializeWorkspace,
  } = useWorkspaceStore();

  // Initialize workspace when organization changes
  useEffect(() => {
    if (organization?.id) {
      initializeWorkspace(organization.id);
    }
  }, [organization?.id]);

  // Fetch workspaces when organization changes
  useEffect(() => {
    if (organization?.id) {
      fetchWorkspaces(organization.id);
    }
  }, [organization?.id]);

  // Find active workspace
  const activeWorkspace =
    workspaces.find((w) => w.id.toString() === selectedWorkspace) ||
    workspaces[0];

  const handleWorkspaceSelect = (workspace: Workspace) => {
    setWorkspace(workspace.id.toString());
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const WorkspacePanel = () => {
    if (isLoading) {
      return (
        <div className="absolute top-full mt-1 w-48 flex flex-col justify-center items-center gap-1 bg-background rounded-md shadow-md border border-foreground-200 py-2">
          <p className="text-xs text-foreground-500 px-4 py-2">Loading...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="absolute top-full mt-1 w-48 flex flex-col justify-center items-center gap-1 bg-background rounded-md shadow-md border border-foreground-200 py-2">
          <p className="text-xs text-foreground-500 px-4 py-2">
            Error loading workspaces
          </p>
        </div>
      );
    }

    if (!organization || workspaces.length === 0) {
      return (
        <div className="absolute top-full mt-1 w-48 flex flex-col justify-center items-center gap-1 bg-background rounded-md shadow-md border border-foreground-200 py-2">
          <p className="text-xs text-foreground-500 px-4 py-2">
            No workspaces available
          </p>
        </div>
      );
    }

    return (
      <div className="absolute top-full mt-1 w-48 flex flex-col justify-center items-center gap-1 bg-background rounded-md shadow-md border border-foreground-200 py-2">
        {workspaces.map((workspace) => (
          <div
            key={workspace.id}
            className={`flex flex-row items-center w-full gap-1 px-4 py-2 hover:bg-foreground-100 cursor-pointer ${
              activeWorkspace?.id === workspace.id ? "bg-foreground-50" : ""
            }`}
            onClick={() => handleWorkspaceSelect(workspace as Workspace)}
          >
            <p className="text-xs font-medium text-foreground-500 font-poppins">
              {workspace.name}
            </p>
          </div>
        ))}
      </div>
    );
  };

  if (!isLoaded) {
    return <ClerkLoading>Loading...</ClerkLoading>;
  }

  return (
    <div className="flex flex-row justify-center w-full items-center gap-1">
      <OrganizationSwitcher
        appearance={{
          elements: {
            rootBox: "flex",
          },
        }}
      />
      <div className="flex flex-row items-center gap-1">
        <HiOutlineSlash className="w-5 h-5 text-foreground-400" />
      </div>
      <div ref={panelRef} className="relative">
        <div
          className="flex flex-row items-center gap-1 px-2 py-1 rounded-md hover:bg-foreground-100 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <p className="text-xs font-medium text-foreground-500 font-poppins">
            {activeWorkspace?.name || "Select Workspace"}
          </p>
          <HiChevronDown
            className={`w-4 h-4 text-foreground-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
        {isOpen && <WorkspacePanel />}
      </div>
    </div>
  );
};

export default WorkspaceMng;
