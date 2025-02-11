import { http, HttpResponse, delay } from "msw";

export const handlers = [
  http.get("/api/workspaces", async ({ request }) => {
    // Convert the request URL string to a URL object
    const url = new URL(request.url);
    const orgId = url.searchParams.get("orgId");

    // Simulate network delay
    await delay(500);

    const workspaces = [
      {
        id: 1,
        name: "Workspace A",
        organizationID: "org_2ssLYh6rviLkJAcZyBtyfsZ8nWh",
        lastUpdated: "2024-01-01",
      },
      {
        id: 2,
        name: "Workspace B",
        organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
        lastUpdated: "2024-01-01",
      },
      {
        id: 3,
        name: "Workspace C",
        organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
        lastUpdated: "2024-01-01",
      },
      {
        id: 4,
        name: "Workspace D",
        organizationID: "org_2ssYf9vp9euHszDoTh0j6cbDB59",
        lastUpdated: "2024-01-01",
      },
    ];

    // Filter workspaces by orgId if provided
    const filteredWorkspaces = orgId
      ? workspaces.filter((w) => w.organizationID === orgId)
      : workspaces;

    return HttpResponse.json(filteredWorkspaces, {
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
