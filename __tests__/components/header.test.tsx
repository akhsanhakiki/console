import { render, screen } from "@testing-library/react";
import { HeaderBar } from "@/general-components/header";
import "@testing-library/jest-dom";
import EzdocsLogo from "@/public/images/general/ezdocsLogo";
import { ReactNode } from "react";

// These mocks are necessary as they require external services/Next.js runtime
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
    pathname: "/",
  }),
  usePathname: () => "/",
}));

jest.mock("@clerk/nextjs", () => ({
  SignInButton: ({ children }: { children: ReactNode }) => (
    <button className="sign-in-button">{children || "Sign In"}</button>
  ),
  SignedIn: ({ children }: { children: ReactNode }) => (
    <div className="signed-in">{children}</div>
  ),
  SignedOut: ({ children }: { children: ReactNode }) => (
    <div className="signed-out">{children}</div>
  ),
  UserButton: () => <button className="user-button">User Profile</button>,
  ClerkLoading: ({ children }: { children: ReactNode }) => (
    <div className="clerk-loading">{children}</div>
  ),
  OrganizationSwitcher: () => (
    <div className="org-switcher">
      <select>
        <option value="org1">Organization 1</option>
        <option value="org2">Organization 2</option>
      </select>
    </div>
  ),
  useOrganization: () => ({
    organization: {
      id: "org_123",
      name: "Test Organization",
      memberships: [],
      membershipList: [],
    },
    isLoaded: true,
  }),
  useOrganizationList: () => ({
    userMemberships: [
      {
        organization: {
          id: "org_123",
          name: "Test Organization",
        },
        role: "admin",
      },
    ],
    isLoaded: true,
  }),
}));

jest.mock("@/stores/workspaceStore", () => ({
  useWorkspaceStore: () => ({
    workspaces: [
      {
        id: 1,
        name: "Development Workspace",
        organizationID: "org_123",
        description: "Main development workspace",
      },
    ],
    selectedWorkspace: "1",
    isLoading: false,
    error: null,
    fetchWorkspaces: jest.fn(),
    setWorkspace: jest.fn(),
    initializeWorkspace: jest.fn(),
    clearWorkspaceState: jest.fn(),
  }),
}));

describe("HeaderBar", () => {
  it("renders with correct structure and styling", () => {
    render(<HeaderBar />);

    // Check if main components are present with correct structure
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("sticky", "top-0");

    // Logo section
    const logoContainer = screen.getByTestId("ezdocs-logo");
    expect(logoContainer).toBeInTheDocument();
    expect(logoContainer).toHaveClass("w-1/5");
    expect(screen.getByText("ezdocs.ai")).toBeInTheDocument();

    // Workspace management section
    const workspaceMng = screen.getByTestId("workspace-management");
    expect(workspaceMng).toBeInTheDocument();
    expect(workspaceMng).toHaveClass("w-3/5");

    // Check workspace selector content
    expect(screen.getByText("Development Workspace")).toBeInTheDocument();
    expect(screen.getByText("Organization 1")).toBeInTheDocument();
    expect(screen.getByText("Organization 2")).toBeInTheDocument();

    // Avatar/User section
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("w-1/5");

    // Verify Clerk components are rendered
    expect(screen.getByText("User Profile")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument(); // Organization switcher
  });

  it("displays correct workspace information", () => {
    render(<HeaderBar />);

    // Verify workspace management shows correct information
    const workspaceSection = screen.getByTestId("workspace-management");
    expect(workspaceSection).toHaveTextContent("Development Workspace");
    expect(workspaceSection).toHaveTextContent("Organization 1");
  });

  it("maintains responsive layout classes", () => {
    render(<HeaderBar />);

    // Verify responsive layout classes
    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "sticky",
      "top-0",
      "z-50",
      "w-full",
      "bg-background",
      "font-poppins"
    );

    // Verify flex layout
    const container = header.firstChild as HTMLElement;
    expect(container).toHaveClass(
      "flex",
      "h-16",
      "items-center",
      "justify-between",
      "px-4",
      "sm:px-6",
      "lg:px-6"
    );
  });
});
