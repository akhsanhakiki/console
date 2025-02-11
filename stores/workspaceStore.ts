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
  workspaces: Record<string, any>[];
  isLoading: boolean;
  error: string | null;
  setOrganization: (orgId: string) => void;
  setWorkspace: (workspaceId: string) => void;
  fetchWorkspaces: (orgId: string) => Promise<void>;
  initializeWorkspace: (orgId: string) => Promise<void>;
};

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
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
      const data = await res.json();
      set({ workspaces: data, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        isLoading: false,
      });
    }
  },
  initializeWorkspace: async (orgId) => {
    await get().fetchWorkspaces(orgId);
    const { workspaces } = get();
    if (workspaces.length > 0 && !get().selectedWorkspace) {
      get().setWorkspace(workspaces[0].id.toString());
    }
  },
}));
