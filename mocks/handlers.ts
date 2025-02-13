import { http, HttpResponse, delay } from "msw";

export const handlers = [
  http.get("/api/workspaces", async ({ request }) => {
    const url = new URL(request.url);
    const orgId = url.searchParams.get("orgId");

    await delay(500);

    const entities = [
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

    // If no orgId is provided (personal account), return empty array
    if (!orgId) {
      return HttpResponse.json([], {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Find organization and return its workspaces
    const orgWorkspaces =
      entities.find((e) => e.organizationID === orgId)?.workspaces || [];

    return HttpResponse.json(orgWorkspaces, {
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
