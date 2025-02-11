import { create } from "zustand";

interface Dashboard {
  documentProcessed: number;
  pipelineCreated: number;
  documentCreated: number;
  schemaCreated: number;
  error: string | null;
}

type DashboardState = {
  documentProcessed: number;
  pipelineCreated: number;
  documentCreated: number;
  schemaCreated: number;
  isLoading: boolean;
  error: string | null;
  setDocumentProcessed: (documentProcessed: number) => void;
  setPipelineCreated: (pipelineCreated: number) => void;
  setDocumentCreated: (documentCreated: number) => void;
  setSchemaCreated: (schemaCreated: number) => void;
  fetchDashboard: (orgId: string, workspaceId: number) => Promise<void>;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  documentProcessed: 0,
  pipelineCreated: 0,
  documentCreated: 0,
  schemaCreated: 0,
  isLoading: false,
  error: null,
  setDocumentProcessed: (documentProcessed) => set({ documentProcessed }),
  setPipelineCreated: (pipelineCreated) => set({ pipelineCreated }),
  setDocumentCreated: (documentCreated) => set({ documentCreated }),
  setSchemaCreated: (schemaCreated) => set({ schemaCreated }),
  fetchDashboard: async (orgId: string, workspaceId: number) => {
    try {
      set({ isLoading: true, error: null });
      const res = await fetch(
        `/api/dashboard?orgId=${orgId}&workspaceId=${workspaceId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch dashboard data");
      }

      const data = await res.json();
      // Since we're filtering by org and workspace, we expect one result
      const dashboardData = data[0] || {
        documentProcessed: 0,
        pipelineCreated: 0,
        documentCreated: 0,
        schemaCreated: 0,
      };

      set({
        documentProcessed: dashboardData.documentProcessed,
        pipelineCreated: dashboardData.pipelineCreated,
        documentCreated: dashboardData.documentCreated,
        schemaCreated: dashboardData.schemaCreated,
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
