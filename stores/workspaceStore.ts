import { create } from "zustand";

interface Workspace {
  id: number;
  name: string;
  organizationID: string;
  lastUpdated: string;
}

type WorkspaceState = {
  selectedOrganization: string | null;
  selectedWorkspace: string | null;
  workspaces: Workspace[];
  isLoading: boolean;
  error: string | null;
  setOrganization: (orgId: string) => void;
  setWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: (orgId: string) => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  selectedOrganization: null,
  selectedWorkspace: null,
  workspaces: [],
  isLoading: false,
  error: null,
  setOrganization: (orgId) => set({ selectedOrganization: orgId }),
  setWorkspace: (workspaceId) => set({ selectedWorkspace: workspaceId }),
  fetchWorkspaces: async (orgId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(`/api/workspaces?orgId=${orgId}`);

      if (!res.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const data = await res.json();
      set({
        workspaces: data,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },
}));
