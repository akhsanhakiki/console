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
  setWorkspace: (id: string) => Promise<void>;
  fetchWorkspaces: (orgId: string) => Promise<void>;
  initializeWorkspace: (orgId: string) => Promise<void>;
  clearWorkspaceState: () => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  selectedWorkspace: "",
  isLoading: false,
  error: null,
  setWorkspace: async (id) => {
    set({ isLoading: true });
    try {
      set({ selectedWorkspace: id, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  fetchWorkspaces: async (orgId) => {
    set({ isLoading: true, error: null });
    try {
      const url = orgId ? `/api/workspaces?orgId=${orgId}` : "/api/workspaces";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      const data = await response.json();
      set({ workspaces: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  initializeWorkspace: async (orgId) => {
    set({ selectedWorkspace: "", workspaces: [], isLoading: true });
    try {
      const url = orgId ? `/api/workspaces?orgId=${orgId}` : "/api/workspaces";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      const data = await response.json();
      set({ workspaces: data, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  clearWorkspaceState: () => {
    set({ workspaces: [], selectedWorkspace: "", error: null });
  },
}));
