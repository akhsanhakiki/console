import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import SideNavbar from "@/general-components/sideNavbar";
import { usePathname, useRouter } from "next/navigation";
import "@testing-library/jest-dom";

// Mock next/navigation with more realistic behavior
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
  useRouter: jest.fn(() => ({
    push: mockPush,
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  })),
}));

// We can use the real Tooltip component if it's simple enough
// If it causes issues, we can keep the mock but make it more realistic
jest.mock("@heroui/react", () => ({
  Tooltip: ({
    children,
    content,
  }: {
    children: React.ReactNode;
    content: string;
  }) => (
    <div className="tooltip-wrapper" title={content}>
      {children}
    </div>
  ),
}));

describe("SideNavbar", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    (usePathname as jest.Mock).mockReturnValue("/dashboard");
  });

  it("renders with correct initial structure and styling", () => {
    render(<SideNavbar />);

    // Check main container styling
    const container = screen.getByTestId("sidebar-container");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass(
      "flex",
      "flex-col",
      "h-full",
      "bg-background",
      "border-r",
      "border-foreground-200",
      "w-64"
    );

    // Check header section
    const menuText = screen.getByText("Menu");
    expect(menuText).toHaveClass(
      "text-base",
      "font-medium",
      "text-foreground-600",
      "pl-2",
      "transition-opacity",
      "duration-200",
      "ease-in-out",
      "truncate",
      "font-poppins"
    );

    // Check navigation section
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("flex-1", "px-2");
  });

  it("renders all navigation items with correct text", () => {
    render(<SideNavbar />);

    // Check main menu items
    const menuItems = [
      "Dashboard",
      "Playground",
      "Manage",
      "Composer",
      "Integration",
      "Settings",
      "Change Log",
      "Documentation",
      "Help & Support",
    ];

    menuItems.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it("handles sidebar expansion and collapse", () => {
    render(<SideNavbar />);

    const container = screen.getByTestId("sidebar-container");
    const toggleButton = screen.getAllByRole("button")[0]; // Get the first button (toggle button)

    // Initial state - expanded
    expect(container).toHaveClass("w-64");

    // Click to collapse
    fireEvent.click(toggleButton);
    expect(container).toHaveClass("w-16");

    // Click to expand
    fireEvent.click(toggleButton);
    expect(container).toHaveClass("w-64");
  });

  it("manages submenu state correctly", () => {
    render(<SideNavbar />);

    // Click Manage button to expand submenu
    const manageButton = screen.getByTestId("manage-button");
    fireEvent.click(manageButton);

    // Check if submenu items are visible
    const subMenuItems = ["Pipeline", "Doc Type", "Schema"];
    subMenuItems.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    // Click again to collapse
    fireEvent.click(manageButton);

    // After collapse, submenu items should not be in the document
    subMenuItems.forEach((text) => {
      expect(screen.queryByText(text)).not.toBeInTheDocument();
    });
  });

  it("highlights active menu item based on current path", () => {
    render(<SideNavbar />);

    // Dashboard should be active since pathname is "/dashboard"
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveClass(
      "bg-foreground-100",
      "text-foreground-900"
    );

    // Other items should not be active
    const settingsLink = screen.getByText("Settings").closest("a");
    expect(settingsLink).not.toHaveClass("bg-foreground-100");
  });

  it("handles navigation with proper routing", () => {
    render(<SideNavbar />);

    // Check Dashboard link
    const dashboardLink = screen.getByRole("link", { name: /dashboard/i });
    expect(dashboardLink).toHaveAttribute("href", "/dashboard");

    // Check Settings link
    const settingsLink = screen.getByRole("link", { name: /settings/i });
    expect(settingsLink).toHaveAttribute("href", "/settings");
  });

  it("maintains accessibility features", () => {
    render(<SideNavbar />);

    // Check ARIA roles
    expect(screen.getByRole("navigation")).toBeInTheDocument();

    // Check button accessibility
    const toggleButton = screen.getAllByRole("button")[0]; // Get the first button (toggle button)
    expect(toggleButton).toHaveClass(
      "py-2",
      "rounded-lg",
      "text-foreground-600",
      "hover:text-foreground-900"
    );

    // Check link accessibility
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(0);
    links.forEach((link) => {
      expect(link).toHaveClass("group", "flex", "items-center", "gap-2");
    });

    // Check disabled items
    const composerLink = screen.getByText("Composer").closest("a");
    expect(composerLink).toHaveClass("opacity-50", "cursor-not-allowed");
  });
});
