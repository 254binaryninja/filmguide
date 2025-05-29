process.env.TMDB_ACCESS_TOKEN = "test-token";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmdbService } from "../tmdb";
import { Movie, MovieResponse, TVShow, TVShowResponse } from "../types";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("TMDBService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN = "test-token";
  });

  describe("getPosterURLProxy", () => {
    it("should return null for null path", () => {
      expect(tmdbService.getPosterURLProxy(null)).toBeNull();
    });

    it("should return correct proxy URL for valid path", () => {
      const path = "/test-poster.jpg";
      const expectedUrl =
        "/api/image-proxy?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw342%2Ftest-poster.jpg";
      expect(tmdbService.getPosterURLProxy(path)).toBe(expectedUrl);
    });
  });

  describe("getBackdropURLProxy", () => {
    it("should return null for null path", () => {
      expect(tmdbService.getBackdropURLProxy(null)).toBeNull();
    });

    it("should return correct proxy URL for valid path", () => {
      const path = "/test-backdrop.jpg";
      const expectedUrl =
        "/api/image-proxy?url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Fw1280%2Ftest-backdrop.jpg";
      expect(tmdbService.getBackdropURLProxy(path)).toBe(expectedUrl);
    });
  });

  describe("getPopularMovies", () => {
    it("should fetch popular movies successfully", async () => {
      const mockResponse: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbService.getPopularMovies();
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/movie/popular"),
        expect.any(Object),
      );
    });

    it("should throw error when API token is not set", async () => {
      process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN = "";
      await expect(tmdbService.getPopularMovies()).rejects.toThrow(
        "TMDB_ACCESS_TOKEN is not set",
      );
    });
  });

  describe("searchMovies", () => {
    it("should search movies successfully", async () => {
      const mockResponse: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbService.searchMovies("test query");
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/search/movie"),
        expect.any(Object),
      );
    });
  });

  describe("getSearchSuggestions", () => {
    it("should return empty array for short query", async () => {
      const result = await tmdbService.getSearchSuggestions("a");
      expect(result).toEqual({ movies: [] });
    });

    it("should return suggestions for valid query", async () => {
      const mockMovies: Movie[] = [{ id: 1, title: "Test Movie" } as Movie];

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ results: mockMovies }),
      });

      const result = await tmdbService.getSearchSuggestions("test");
      expect(result.movies).toEqual(mockMovies);
    });
  });

  describe("getMovieDetails", () => {
    it("should fetch movie details successfully", async () => {
      const mockMovie: Movie = { id: 1, title: "Test Movie" } as Movie;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovie),
      });

      const result = await tmdbService.getMovieDetails(1);
      expect(result).toEqual(mockMovie);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/movie/1"),
        expect.any(Object),
      );
    });
  });

  describe("getPopularTVShows", () => {
    it("should fetch popular TV shows successfully", async () => {
      const mockResponse: TVShowResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbService.getPopularTVShows();
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tv/popular"),
        expect.any(Object),
      );
    });
  });

  describe("getTVShowDetails", () => {
    it("should fetch TV show details successfully", async () => {
      const mockTVShow: TVShow = { id: 1, name: "Test Show" } as TVShow;

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTVShow),
      });

      const result = await tmdbService.getTVShowDetails(1);
      expect(result).toEqual(mockTVShow);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/tv/1"),
        expect.any(Object),
      );
    });
  });

  describe("getMovieGenres", () => {
    it("should fetch movie genres successfully", async () => {
      const mockGenres = { genres: [{ id: 1, name: "Action" }] };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockGenres),
      });

      const result = await tmdbService.getMovieGenres();
      expect(result).toEqual(mockGenres);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/genre/movie/list"),
        expect.any(Object),
      );
    });
  });

  describe("getMoviesByGenre", () => {
    it("should fetch movies by genre successfully", async () => {
      const mockResponse: MovieResponse = {
        page: 1,
        results: [],
        total_pages: 1,
        total_results: 0,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await tmdbService.getMoviesByGenre(1);
      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/discover/movie"),
        expect.any(Object),
      );
    });
  });
});
