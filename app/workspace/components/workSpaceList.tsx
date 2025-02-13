import {
  Button,
  Card,
  CardBody,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  useDisclosure,
} from "@heroui/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { HiOutlineDotsVertical } from "react-icons/hi";

// Icons
import DocTypeIconOut from "@/public/images/icons/docTypeIconOut";
import PipelineIconOut from "@/public/images/icons/pipelineIconOut";
import ScanIconOut from "@/public/images/icons/scanIconOut";
import SchemaIconOut from "@/public/images/icons/schemaIconOut";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import EmptyWorkspace from "./emptyWorkspace";
import WorkspaceModal from "./workspaceModal";

interface Workspace {
  id: number;
  name: string;
  lastUpdated: string;
  extractor?: number;
  pipeline?: number;
  doctype?: number;
  schema?: number;
}

interface WorkspaceEntity {
  organizationID: string;
  workspaces: Workspace[];
}

interface WorkspaceFormData {
  name: string;
  extractor?: number;
  pipeline?: number;
  doctype?: number;
  schema?: number;
}

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
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<Workspace | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<WorkspaceFormData>({
    name: "",
  });
  const [forceUpdate, setForceUpdate] = useState(0);

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
  }, [organization?.id, user?.id, isOrgLoaded, isUserLoaded, forceUpdate]);

  const handleWorkspaceSelect = async (workspaceId: string) => {
    try {
      // Make sure the workspace exists in our list
      const workspace = workspaces.find((w) => w.id.toString() === workspaceId);
      if (!workspace) {
        console.error("Workspace not found:", workspaceId);
        return;
      }

      // Set the workspace first
      await setWorkspace(workspaceId);

      // Navigate to dashboard immediately after setting workspace
      router.push("/dashboard");
    } catch (error) {
      console.error("Error selecting workspace:", error);
    }
  };

  const handleCreateWorkspace = async (formData: { name: string }) => {
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

      // Refresh workspace list
      if (organization?.id) {
        await fetchWorkspaces(organization.id);
      } else {
        await fetchWorkspaces("");
      }

      // After successful creation, redirect to dashboard if it was empty before
      const data = await response.json();
      if (workspaces.length === 0) {
        setWorkspace(data.id.toString());
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error creating workspace:", error);
      throw error;
    }
  };

  const handleEditWorkspace = async (formData: { name: string }) => {
    try {
      // Update workspace name in storage
      const storageKey = organization?.id || "personal_account";
      const workspaceData = sessionStorage.getItem("workspaceData");
      if (workspaceData && selectedItem) {
        const data = new Map<string, WorkspaceEntity>(
          JSON.parse(workspaceData)
        );
        const orgEntity = data.get(storageKey);

        if (orgEntity) {
          // Update storage
          const updatedWorkspaces = orgEntity.workspaces.map((w) =>
            w.id === selectedItem.id ? { ...w, name: formData.name } : w
          );
          orgEntity.workspaces = updatedWorkspaces;
          data.set(storageKey, orgEntity);
          sessionStorage.setItem(
            "workspaceData",
            JSON.stringify(Array.from(data.entries()))
          );

          // Update local state using the store's update method
          const updatedWorkspaceList = workspaces.map((w) =>
            w.id === selectedItem.id ? { ...w, name: formData.name } : w
          );
          useWorkspaceStore.getState().updateWorkspaces(updatedWorkspaceList);

          // If the edited workspace is currently selected, update the selection
          if (selectedWorkspace === selectedItem.id.toString()) {
            await setWorkspace(selectedItem.id.toString());
          }

          // Close modal and reset state
          onClose();
          setIsEditMode(false);
          setSelectedItem(null);
        }
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
      throw error;
    }
  };

  const handleDeleteWorkspace = async (workspace: Workspace) => {
    if (!confirm("Are you sure you want to delete this workspace?")) {
      return;
    }

    try {
      const storageKey = organization?.id || "personal_account";
      const workspaceData = sessionStorage.getItem("workspaceData");
      if (workspaceData) {
        const data = new Map<string, WorkspaceEntity>(
          JSON.parse(workspaceData)
        );
        const orgEntity = data.get(storageKey);

        if (orgEntity) {
          // Update storage
          const filteredWorkspaces = orgEntity.workspaces.filter(
            (w) => w.id !== workspace.id
          );
          orgEntity.workspaces = filteredWorkspaces;
          data.set(storageKey, orgEntity);
          sessionStorage.setItem(
            "workspaceData",
            JSON.stringify(Array.from(data.entries()))
          );

          // Update local state using the store's update method
          const updatedWorkspaces = workspaces.filter(
            (w) => w.id !== workspace.id
          );
          useWorkspaceStore.getState().updateWorkspaces(updatedWorkspaces);

          // If deleted workspace was selected, clear selection and redirect
          if (selectedWorkspace === workspace.id.toString()) {
            await clearWorkspaceState();
            router.push("/workspace");
          } else if (updatedWorkspaces.length > 0) {
            // If there are remaining workspaces, select the first one
            await setWorkspace(updatedWorkspaces[0].id.toString());
          }
        }
      }
    } catch (error) {
      console.error("Error deleting workspace:", error);
    }
  };

  const handleOptionSelect = (key: string, workspace: Workspace) => {
    if (key === "edit") {
      setSelectedItem(workspace);
      setIsEditMode(true);
      onOpen();
    } else if (key === "delete") {
      handleDeleteWorkspace(workspace);
    }
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
    return <EmptyWorkspace />;
  }

  return (
    <div className="flex flex-col px-4 py-4 w-full h-full gap-4">
      <div className="flex flex-row justify-between items-center">
        <h1 className="text-xl font-semibold">
          {organization
            ? `${organization.name} Workspaces`
            : "Personal Workspaces"}
        </h1>
        <Button
          className="text-foreground-800 border-foreground-300"
          variant="bordered"
          onPress={onOpen}
        >
          <FiPlus className="text-foreground-800" />
          New Workspace
        </Button>
      </div>

      {/* Workspace grid */}
      <div className="flex flex-col gap-2 h-full">
        <div className="gap-4 grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 h-1/4">
          {workspaces.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "bg-foreground-50 overflow-hidden rounded-2xl hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer",
                item.id.toString() === selectedWorkspace
                  ? "border-primary border-2"
                  : "border-foreground-100 border-1"
              )}
              onClick={() => handleWorkspaceSelect(item.id.toString())}
            >
              <div className="p-4 flex flex-col justify-between">
                {/* Workspace Name and Last Updated */}
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col gap-1 flex-grow">
                    <p className="text-foreground-800 font-normal font-poppins text-sm">
                      {item.name}
                    </p>
                    <p className="text-foreground-400 font-normal font-poppins text-xs">
                      {item.lastUpdated}
                    </p>
                  </div>
                  <div
                    className="dropdown-area"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <Dropdown>
                      <DropdownTrigger>
                        <span
                          className="inline-flex cursor-pointer p-2 hover:bg-foreground-100 rounded-lg"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <HiOutlineDotsVertical className="text-foreground-600 w-4 h-4" />
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu
                        onAction={(key) =>
                          handleOptionSelect(key.toString(), item)
                        }
                      >
                        <DropdownItem key="edit">Edit</DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                        >
                          Delete
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                </div>
                {/* Workspace Details */}
                <div className="flex flex-row gap-3 w-full justify-start mt-2">
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
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace Creation/Edit Modal */}
      <WorkspaceModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          setIsEditMode(false);
          setSelectedItem(null);
        }}
        onSubmit={isEditMode ? handleEditWorkspace : handleCreateWorkspace}
        initialData={selectedItem}
        mode={isEditMode ? "edit" : "create"}
      />
    </div>
  );
};

export default WorkshopList;
