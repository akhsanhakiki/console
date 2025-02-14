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
import { useRouter, usePathname } from "next/navigation";
import { Divider } from "@heroui/react";

interface Workspace {
  id: number;
  name: string;
  organizationID: string;
  lastUpdated: string;
}

const WorkspaceMng = () => {
  const router = useRouter();
  const pathname = usePathname();
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
    clearWorkspaceState,
  } = useWorkspaceStore();

  // Check if we're on the workspace selection page
  const isWorkspacePage = pathname === "/workspace";

  // Effect to handle organization changes and personal account switches
  useEffect(() => {
    const handleOrgChange = async () => {
      try {
        // Reset workspace state
        await clearWorkspaceState();

        // Force a client-side refresh to ensure clean state
        router.refresh();

        if (organization?.id) {
          // Organization context
          await initializeWorkspace(organization.id);
        } else {
          // Personal account context - initialize with empty state
          await initializeWorkspace("");
        }

        // Always redirect to workspace selection to ensure proper state
        // router.replace("/workspace");
      } catch (error) {
        console.error("Error handling organization change:", error);
      }
    };

    // Only run if Clerk is loaded
    if (isLoaded) {
      handleOrgChange();
    }
  }, [organization?.id, isLoaded]);

  // Remove the separate fetch effect as it's now handled in handleOrgChange
  useEffect(() => {
    if (!selectedWorkspace && workspaces.length > 0 && !isWorkspacePage) {
      setWorkspace(workspaces[0].id.toString());
    } else if (!selectedWorkspace && !isWorkspacePage) {
      // No workspaces available or switching context, redirect to workspace selection
      //router.replace("/workspace");
    }
  }, [workspaces.length, selectedWorkspace, isWorkspacePage]);

  // Find active workspace based on selectedWorkspace
  const activeWorkspace =
    workspaces.find((w) => w.id.toString() === selectedWorkspace) ||
    workspaces[0];

  // Handle workspace selection and redirect to dashboard
  const handleWorkspaceSelect = async (workspace: Workspace) => {
    try {
      setIsOpen(false);

      // Set new workspace first
      await setWorkspace(workspace.id.toString());

      // Force a re-fetch of workspace data
      if (organization?.id) {
        await fetchWorkspaces(organization.id);
      } else {
        await fetchWorkspaces("");
      }

      // Navigate to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error switching workspace:", error);
    }
  };

  // Effect to handle clicks outside the panel to close it
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

  // Component to render the workspace selection panel
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
        <Divider className="my-1" />
        <div
          className="flex flex-row items-center w-full gap-1 px-4 py-2 hover:bg-foreground-100 cursor-pointer"
          onClick={() => {
            router.push("/workspace");
            setIsOpen(false);
          }}
        >
          <p className="text-xs font-medium text-foreground-500 font-poppins">
            View All Workspaces
          </p>
        </div>
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
        afterCreateOrganizationUrl="/workspace"
        afterLeaveOrganizationUrl="/workspace"
        afterSelectOrganizationUrl="/workspace"
      />
      {!isWorkspacePage && workspaces.length > 0 && (
        <>
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
              <HiChevronDown className="w-4 h-4 text-foreground-500 transition-transform duration-200" />
            </div>
            {isOpen && <WorkspacePanel />}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkspaceMng;
