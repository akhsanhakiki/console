import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SideNavbar from "@/general-components/sideNavbar";
import { usePathname, useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock HeroUI Tooltip
jest.mock("@heroui/react", () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => children,
}));

describe("SideNavbar", () => {
  beforeEach(() => {
    // Reset mocks before each test
    (usePathname as jest.Mock).mockReturnValue("/modules/dashboard");
  });

  it("renders all navigation items", () => {
    render(<SideNavbar />);

    // Check if main menu items are rendered
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Extract")).toBeInTheDocument();
    expect(screen.getByText("Manage")).toBeInTheDocument();
    expect(screen.getByText("Composer")).toBeInTheDocument();
  });

  it("toggles sidebar expansion", async () => {
    render(<SideNavbar />);

    // Find toggle button by its container class and click it
    const toggleButton = screen.getByRole("button", {
      name: "", // The button doesn't have text, so we leave it empty
    });
    expect(toggleButton).toBeInTheDocument();

    // Initial state should show Menu
    expect(screen.getByText("Menu")).toBeInTheDocument();

    // Click to collapse
    fireEvent.click(toggleButton);

    // Menu text should be hidden
    expect(screen.queryByText("Menu")).not.toBeInTheDocument();
  });

  it("expands submenu when Manage is clicked", () => {
    render(<SideNavbar />);

    const manageButton = screen.getByText("Manage").closest("button");
    expect(manageButton).toBeInTheDocument();
    fireEvent.click(manageButton!);

    expect(screen.getByText("Schema")).toBeInTheDocument();
    expect(screen.getByText("Pipeline")).toBeInTheDocument();
    expect(screen.getByText("Doc Type")).toBeInTheDocument();
  });

  it("highlights active menu item based on current path", () => {
    (usePathname as jest.Mock).mockReturnValue("/modules/extract");
    render(<SideNavbar />);

    // Find the Extract menu item
    const extractLink = screen.getByText("Extract").closest("a");
    expect(extractLink).toHaveClass("bg-foreground-100");
  });

  it("expands sidebar and submenu when clicking Manage in collapsed state", async () => {
    render(<SideNavbar />);

    // Collapse sidebar first
    const toggleButton = screen.getByRole("button", {
      name: "", // Empty name for the button without text
    });
    fireEvent.click(toggleButton);

    // Wait for collapse animation
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify sidebar is collapsed
    expect(screen.queryByText("Menu")).not.toBeInTheDocument();

    // Find Manage button by its icon (since text is hidden in collapsed state)
    const manageButton = screen.getByTestId("manage-button");
    expect(manageButton).toBeInTheDocument();
    fireEvent.click(manageButton);

    // Wait for expansion animation
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Verify expansion
    expect(screen.getByText("Menu")).toBeInTheDocument();
    expect(screen.getByText("Schema")).toBeInTheDocument();
  });
});
