import { create } from "zustand";

interface DashboardData {
  organizationID: string;
  workspaceID: number;
  documentProcessed: number;
  pipelineCreated: number;
  documentCreated: number;
  schemaCreated?: number;
}

interface DashboardStore {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;
  fetchDashboardData: (orgId: string, workspaceId: string) => Promise<void>;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,
  fetchDashboardData: (orgId, workspaceId) => {
    set({ isLoading: true, error: null });
    return fetch(`/api/dashboard?orgId=${orgId}&workspaceId=${workspaceId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch dashboard data");
        return response.json();
      })
      .then((data) => {
        set({ dashboardData: data[0], isLoading: false });
      })
      .catch((error) => {
        set({ error: error.message, isLoading: false });
        throw error;
      });
  },
}));
