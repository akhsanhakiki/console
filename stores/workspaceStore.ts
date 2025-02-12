import { create } from "zustand";

interface Workspace {
  id: number;
  name: string;
  lastUpdated: string;
  extractor?: number;
  pipeline?: number;
  doctype?: number;
  schema?: number;
}

interface WorkspaceStore {
  workspaces: Workspace[];
  selectedWorkspace: string;
  isLoading: boolean;
  error: string | null;
  setWorkspace: (id: string) => void;
  fetchWorkspaces: (orgId: string) => Promise<void>;
  initializeWorkspace: (orgId: string) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  selectedWorkspace: "",
  isLoading: false,
  error: null,
  setWorkspace: (id) => set({ selectedWorkspace: id }),
  fetchWorkspaces: async (orgId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/workspaces?orgId=${orgId}`);
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      const data = await response.json();
      set({ workspaces: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  initializeWorkspace: (orgId) => {
    set({ selectedWorkspace: "", workspaces: [] });
  },
}));
