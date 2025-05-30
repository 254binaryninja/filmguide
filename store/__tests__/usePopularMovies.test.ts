// store/__tests__/usePopularMovies.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the tmdb service
vi.mock("../../lib/api/tmdb", () => ({
  tmdbService: {
    getPopularMovies: vi.fn(),
  },
}));

// Import after mocking
import { usePopularMoviesStore } from "../usePopularMovies";
import { tmdbService } from "../../lib/api/tmdb";

// Get reference to the mocked function
const mockGetPopularMovies = vi.mocked(tmdbService.getPopularMovies);

describe("usePopularMoviesStore", () => {
  const mockMovieResponse = {
    results: [
      {
        id: 1,
        title: "Movie 1",
        overview: "Overview 1",
        poster_path: "/poster1.jpg",
        backdrop_path: "/backdrop1.jpg",
        release_date: "2025-01-01",
        vote_average: 8.1,
        vote_count: 300,
        genre_ids: [1, 2],
        popularity: 80,
        adult: false,
        original_language: "en",
        original_title: "Movie 1",
        video: false,
      },
    ],
    page: 1,
    total_pages: 10,
    total_results: 100,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    const state = usePopularMoviesStore.getState();
    state.movies = [];
    state.isLoading = false;
    state.error = null;
    state.totalPages = 0;
    state.currentPage = 1;
  });

  it("sets loading, then updates state on successful fetch", async () => {
    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    const promise = usePopularMoviesStore.getState().fetchPopularMovies();

    // Check loading state immediately
    expect(usePopularMoviesStore.getState().isLoading).toBe(true);

    await promise;

    const state = usePopularMoviesStore.getState();
    expect(state.movies).toEqual(mockMovieResponse.results);
    expect(state.isLoading).toBe(false);
    expect(state.totalPages).toBe(mockMovieResponse.total_pages);
    expect(state.currentPage).toBe(1);
    expect(state.error).toBeNull();
    expect(mockGetPopularMovies).toHaveBeenCalledWith(1);
  });

  it("sets error state on fetch failure", async () => {
    const testError = new Error("Fetch failed");
    mockGetPopularMovies.mockRejectedValueOnce(testError);

    await usePopularMoviesStore.getState().fetchPopularMovies();

    const state = usePopularMoviesStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.error).toEqual(testError);
    expect(state.movies).toEqual([]);
  });

  it("fetches the correct page", async () => {
    const page3Response = { ...mockMovieResponse, page: 3 };
    mockGetPopularMovies.mockResolvedValueOnce(page3Response);

    await usePopularMoviesStore.getState().fetchPopularMovies(3);

    const state = usePopularMoviesStore.getState();
    expect(state.currentPage).toBe(3);
    expect(mockGetPopularMovies).toHaveBeenCalledWith(3);
  });

  it("resets state on new fetch", async () => {
    // First, set some error state
    const state = usePopularMoviesStore.getState();
    state.error = new Error("Previous error");
    state.movies = [{ id: 999 } as any];

    mockGetPopularMovies.mockResolvedValueOnce(mockMovieResponse);

    await usePopularMoviesStore.getState().fetchPopularMovies();

    const finalState = usePopularMoviesStore.getState();
    expect(finalState.error).toBeNull();
    expect(finalState.movies).toEqual(mockMovieResponse.results);
  });
});
