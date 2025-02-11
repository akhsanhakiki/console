import { render, screen } from "@testing-library/react";
import { HeaderBar } from "@/general-components/header";
import "@testing-library/jest-dom";

// Mock components
jest.mock("@/public/images/general/ezdocsLogo", () => {
  return function DummyLogo() {
    return <div data-testid="ezdocs-logo" />;
  };
});

jest.mock("@heroui/avatar", () => ({
  Avatar: function DummyAvatar({ className }: { className: string }) {
    return <div data-testid="avatar" className={className} />;
  },
}));

describe("HeaderBar", () => {
  it("renders all required components", () => {
    render(<HeaderBar />);

    // Check if main components are rendered
    expect(screen.getByTestId("ezdocs-logo")).toBeInTheDocument();
    expect(screen.getByTestId("avatar")).toBeInTheDocument();
  });

  it("has correct layout container", () => {
    render(<HeaderBar />);

    // Check if header has correct base styling
    expect(screen.getByRole("banner")).toHaveClass("sticky top-0");
  });
});
