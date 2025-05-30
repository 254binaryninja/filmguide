/* eslint-disable @typescript-eslint/no-explicit-any */

// components/movies/__tests__/MovieCard.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import MovieCard from "../MovieCard";
import { Movie } from "@/lib/api/types";
import Image from "next/image";

// Mock framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => (
      <div className={className}>{children}</div>
    ),
  },
}));

// Mock next/image
vi.mock("next/image", () => ({
  default: ({ src, alt, className }: any) => (
    <Image
      src={src}
      alt={alt}
      className={className}
      data-testid="movie-poster"
    />
  ),
}));

// Mock next/link
vi.mock("next/link", () => ({
  default: ({ href, children }: any) => (
    <a href={href} data-testid="movie-link">
      {children}
    </a>
  ),
}));

describe("MovieCard", () => {
  const mockMovie: Movie = {
    id: 123,
    title: "Test Movie",
    overview: "This is a test movie description",
    poster_path: "/test-poster.jpg",
    backdrop_path: "/test-backdrop.jpg",
    release_date: "2025-01-15",
    vote_average: 8.5,
    vote_count: 1000,
    genre_ids: [28, 12],
    popularity: 95.4,
  };

  it("should render movie card with correct content", () => {
    // Arrange & Act
    render(<MovieCard movie={mockMovie} />);

    // Assert
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.getByText("2025-01-15")).toBeInTheDocument();
    expect(screen.getByTestId("movie-poster")).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500/test-poster.jpg",
    );
    expect(screen.getByTestId("movie-poster")).toHaveAttribute(
      "alt",
      "Test Movie",
    );
  });

  it("should link to the correct movie detail page", () => {
    // Arrange & Act
    render(<MovieCard movie={mockMovie} />);

    // Assert
    const link = screen.getByTestId("movie-link");
    expect(link).toHaveAttribute("href", "/movies/123");
  });

  it("should handle missing poster path gracefully", () => {
    // Arrange
    const movieWithoutPoster = {
      ...mockMovie,
      poster_path: null,
    };

    // Act
    render(<MovieCard movie={movieWithoutPoster} />);

    // Assert - Should still render even with null poster path
    expect(screen.getByTestId("movie-poster")).toHaveAttribute(
      "src",
      "https://image.tmdb.org/t/p/w500null",
    );
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
  });

  it("should handle missing release date gracefully", () => {
    // Arrange
    const movieWithoutDate = {
      ...mockMovie,
      release_date: "",
    };

    // Act
    render(<MovieCard movie={movieWithoutDate} />);

    // Assert
    expect(screen.getByText("Test Movie")).toBeInTheDocument();
    expect(screen.queryByText("2025-01-15")).not.toBeInTheDocument();

    // Look for the paragraph element that would contain the date
    const dateElement = screen.getByTestId("release-date");
    expect(dateElement.textContent).toBe("");
  });
});
