/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "../header";
import { useAuth } from "@clerk/nextjs";

// Mock Supabase and related dependencies
vi.mock("@/lib/api/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      data: [],
      error: null,
    })),
  },
}));

vi.mock("@/lib/api/userPreferences", () => ({
  getUserPreferences: vi.fn().mockResolvedValue({ data: null, error: null }),
  updateUserPreferences: vi.fn().mockResolvedValue({ data: null, error: null }),
}));

// Mock the Clerk authentication hook
vi.mock("@clerk/nextjs", () => ({
  useAuth: vi.fn(),
  UserButton: () => <div data-testid="user-button">User Button</div>,
  SignInButton: () => <div data-testid="sign-in-button">Sign In Button</div>,
}));

// Mock the framer-motion components
vi.mock("framer-motion", () => ({
  motion: {
    header: ({ children }: { children: React.ReactNode }) => (
      <header>{children}</header>
    ),
    div: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

// Mock the Search component
vi.mock("@/components/search/Search", () => ({
  default: () => <div data-testid="search-component">Search Component</div>,
}));

// Mock the Preference component
vi.mock("@/components/common/Preference", () => ({
  default: ({ preference }: { preference: string }) => (
    <div data-testid={`preference-${preference}`}>Preference: {preference}</div>
  ),
}));

// Mock the ThemeToggle component
vi.mock("@/components/common/ThemeToggle", () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

describe("Header Component", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Mock window.scrollY
    Object.defineProperty(window, "scrollY", {
      value: 0,
      writable: true,
    });
  });

  it("renders the header with logo and navigation elements", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: false });

    render(<Header />);

    // Check for logo
    expect(screen.getByText("FilmGuide")).toBeInTheDocument();

    // Check for navigation elements
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /toggle mobile menu/i }),
    ).toBeInTheDocument();
  });

  it("shows sign in button when user is not authenticated", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: false });

    render(<Header />);

    expect(screen.getByTestId("sign-in-button")).toBeInTheDocument();
    expect(screen.queryByTestId("user-button")).not.toBeInTheDocument();
  });

  it("shows user button when user is authenticated", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: true });

    render(<Header />);

    expect(screen.getByTestId("user-button")).toBeInTheDocument();
    expect(screen.queryByTestId("sign-in-button")).not.toBeInTheDocument();
  });

  it("changes background on scroll", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: false });

    render(<Header />);

    const nav = screen.getByRole("navigation");

    // Initial state - transparent background
    expect(nav).toHaveClass("bg-transparent");

    // Simulate scroll
    Object.defineProperty(window, "scrollY", { value: 100 });
    fireEvent.scroll(window);

    // After scroll - should have background
    expect(nav).toHaveClass("bg-white/80");
  });

  it("handles window resize events", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: false });

    render(<Header />);

    // Mock window.innerWidth
    Object.defineProperty(window, "innerWidth", {
      value: 768,
      writable: true,
    });

    // Trigger resize
    fireEvent.resize(window);

    // Check if mobile menu button is visible
    expect(
      screen.getByRole("button", { name: /toggle mobile menu/i }),
    ).toBeInTheDocument();
  });

  it("renders preference components", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: true });

    render(<Header />);

    expect(screen.getByTestId("preference-watchlist")).toBeInTheDocument();
    expect(screen.getByTestId("preference-history")).toBeInTheDocument();
  });

  it("renders theme toggle component", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: false });

    render(<Header />);

    expect(screen.getByTestId("theme-toggle")).toBeInTheDocument();
  });

  it("renders search component", () => {
    (useAuth as any).mockReturnValue({ isSignedIn: false });

    render(<Header />);

    expect(screen.getByTestId("search-component")).toBeInTheDocument();
  });
});
