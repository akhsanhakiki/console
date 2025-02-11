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
];
