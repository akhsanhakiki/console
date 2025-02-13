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
  updateWorkspaces: (workspaces: Workspace[]) => void;
}

export const useWorkspaceStore = create<WorkspaceStore>((set) => ({
  workspaces: [],
  selectedWorkspace: "",
  isLoading: false,
  error: null,
  setWorkspace: async (id) => {
    try {
      // Set loading state first
      set((state) => ({
        ...state,
        isLoading: true,
        error: null,
      }));

      // Update the selected workspace
      set((state) => {
        // Find the workspace in the current list to ensure it exists
        const workspaceExists = state.workspaces.find(
          (w) => w.id.toString() === id
        );

        if (!workspaceExists) {
          console.warn(`Workspace with id ${id} not found in current state`);
          // Don't set the workspace if it doesn't exist
          return {
            ...state,
            error: "Selected workspace not found",
            isLoading: false,
          };
        }

        // Store the selected workspace in session storage
        sessionStorage.setItem("selectedWorkspace", id);

        return {
          ...state,
          selectedWorkspace: id,
          error: null,
          isLoading: false,
        };
      });
    } catch (error) {
      set((state) => ({
        ...state,
        error: (error as Error).message,
        isLoading: false,
      }));
      throw error;
    }
  },
  fetchWorkspaces: async (orgId) => {
    set((state) => ({ ...state, isLoading: true, error: null }));
    try {
      const url = orgId ? `/api/workspaces?orgId=${orgId}` : "/api/workspaces";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      const data = await response.json();

      set((state) => {
        // If we have workspaces and no workspace is selected, select the first one
        const shouldSelectFirst = data.length > 0 && !state.selectedWorkspace;

        return {
          ...state,
          workspaces: data,
          selectedWorkspace: shouldSelectFirst
            ? data[0].id.toString()
            : state.selectedWorkspace,
          isLoading: false,
        };
      });
    } catch (error) {
      set((state) => ({
        ...state,
        error: (error as Error).message,
        isLoading: false,
      }));
    }
  },
  initializeWorkspace: async (orgId) => {
    set((state) => ({
      ...state,
      selectedWorkspace: "",
      workspaces: [],
      isLoading: true,
      error: null,
    }));
    try {
      const url = orgId ? `/api/workspaces?orgId=${orgId}` : "/api/workspaces";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch workspaces");
      const data = await response.json();
      set((state) => ({
        ...state,
        workspaces: data,
        isLoading: false,
      }));
    } catch (error) {
      set((state) => ({
        ...state,
        error: (error as Error).message,
        isLoading: false,
      }));
    }
  },
  clearWorkspaceState: () => {
    set((state) => ({
      ...state,
      workspaces: [],
      selectedWorkspace: "",
      error: null,
    }));
  },
  updateWorkspaces: (workspaces) => {
    set((state) => ({
      ...state,
      workspaces: [...workspaces],
    }));
  },
}));
