import { http, HttpResponse, delay } from "msw";

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

// Initialize from sessionStorage or use default data
const loadPersistedData = () => {
  if (typeof window !== "undefined") {
    const persistedData = sessionStorage.getItem("workspaceData");
    if (persistedData) {
      const parsed = JSON.parse(persistedData);
      return new Map<string, WorkspaceEntity>(parsed);
    }
  }
  return new Map<string, WorkspaceEntity>();
};

const saveToStorage = (data: Map<string, WorkspaceEntity>) => {
  if (typeof window !== "undefined") {
    const serialized = JSON.stringify(Array.from(data.entries()));
    sessionStorage.setItem("workspaceData", serialized);
  }
};

const globalEntities = loadPersistedData();

// Initialize with default data if empty
if (globalEntities.size === 0) {
  const defaultEntities: WorkspaceEntity[] = [
    {
      organizationID: "org_2ssLYh6rviLkJAcZyBtyfsZ8nWh",
      workspaces: [
        {
          id: 1,
          name: "Workspace A",
          lastUpdated: "2024-01-01",
          extractor: 10,
          pipeline: 10,
          doctype: 10,
          schema: 10,
        },
      ],
    },
    {
      organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
      workspaces: [
        {
          id: 2,
          name: "Workspace B",
          lastUpdated: "2024-01-01",
          extractor: 20,
          pipeline: 20,
          doctype: 20,
          schema: 20,
        },
        {
          id: 3,
          name: "Workspace C",
          lastUpdated: "2024-01-01",
          extractor: 30,
          pipeline: 30,
          doctype: 30,
          schema: 30,
        },
        {
          id: 4,
          name: "Workspace D",
          lastUpdated: "2024-01-01",
          extractor: 40,
          pipeline: 40,
          doctype: 40,
          schema: 40,
        },
      ],
    },
  ];

  defaultEntities.forEach((entity) => {
    globalEntities.set(entity.organizationID, entity);
  });
  saveToStorage(globalEntities);
}

export const handlers = [
  http.get("/api/workspaces", async ({ request }) => {
    const url = new URL(request.url);
    const orgId = url.searchParams.get("orgId");

    await delay(500);

    // For personal account, use the special key
    const storageKey = orgId || "personal_account";

    // Get organization workspaces from global entities
    const orgEntity = globalEntities.get(storageKey);
    const workspaces = orgEntity?.workspaces || [];

    return HttpResponse.json(workspaces, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.post("/api/workspaces", async ({ request }) => {
    const body = await request.json();
    const { organizationId, workspace } = body as {
      organizationId: string;
      workspace: Workspace;
    };

    // For personal account, use a special key
    const storageKey = organizationId || "personal_account";

    // Get existing organization data or create new
    let orgEntity = globalEntities.get(storageKey);
    if (!orgEntity) {
      orgEntity = {
        organizationID: storageKey,
        workspaces: [],
      };
    }

    // Create new workspace with generated ID
    const newWorkspace = {
      ...workspace,
      id: Date.now(), // Use timestamp to ensure unique IDs
      lastUpdated: new Date().toISOString().split("T")[0],
    };

    // Add new workspace
    orgEntity.workspaces.push(newWorkspace);

    // Update global entities
    globalEntities.set(storageKey, orgEntity);

    // Persist to storage
    saveToStorage(globalEntities);

    return HttpResponse.json(newWorkspace, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),

  http.get("/api/dashboard", async ({ request }) => {
    const url = new URL(request.url);
    const orgId = url.searchParams.get("orgId");
    const workspaceId = url.searchParams.get("workspaceId");

    await delay(500);

    const dashboard = [
      {
        organizationID: "org_2ssLYh6rviLkJAcZyBtyfsZ8nWh",
        workspaceID: 1,
        documentProcessed: 100,
        pipelineCreated: 120,
        documentCreated: 130,
        schemaCreated: 140,
      },
      {
        organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
        workspaceID: 2,
        documentProcessed: 200,
        pipelineCreated: 220,
        documentCreated: 230,
        schemaCreated: 240,
      },
      {
        organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
        workspaceID: 3,
        documentProcessed: 300,
        pipelineCreated: 320,
        documentCreated: 330,
        schemaCreated: 340,
      },
      {
        organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
        workspaceID: 4,
        documentProcessed: 400,
        pipelineCreated: 420,
        documentCreated: 430,
        schemaCreated: 440,
      },
    ];

    const filteredDashboard = dashboard.filter((d) => {
      if (orgId && workspaceId) {
        return (
          d.organizationID === orgId && d.workspaceID === Number(workspaceId)
        );
      }
      if (orgId) {
        return d.organizationID === orgId;
      }
      return true;
    });

    return HttpResponse.json(filteredDashboard, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
];
