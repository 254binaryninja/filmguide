/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { UserPreferences } from "../userPreferences";
import { getSupabaseClient } from "../supabase";

// Mock getSupabaseClient
vi.mock("../supabase", () => ({
  getSupabaseClient: vi.fn(),
}));

describe("UserPreferences", () => {
  let userPreferences: UserPreferences;
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Create a proper mock that chains methods correctly
    mockSupabase = {
      from: vi.fn().mockImplementation(() => ({
        select: vi.fn().mockImplementation(() => ({
          match: vi.fn().mockResolvedValue({ data: [], error: null }),
        })),
        insert: vi.fn().mockResolvedValue({ error: null }),
        delete: vi.fn().mockImplementation(() => ({
          match: vi.fn().mockResolvedValue({ error: null }),
        })),
      })),
    };

    vi.mocked(getSupabaseClient).mockResolvedValue(mockSupabase);
    userPreferences = new UserPreferences(Promise.resolve("test-token"));
  });

  describe("getWatchlist", () => {
    it("should fetch watchlist successfully", async () => {
      const mockData = [
        { user_id: "user1", movie_id: 1 },
        { user_id: "user1", movie_id: 2 },
      ];

      // Mock the chain: from().select()
      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.getWatchlist();
      expect(result).toEqual([1, 2]);
      expect(mockSupabase.from).toHaveBeenCalledWith("watchlist");
      expect(selectMock).toHaveBeenCalledWith("user_id, movie_id");
    });

    it("should return empty array on error", async () => {
      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: new Error("Test error") });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.getWatchlist();
      expect(result).toEqual([]);
    });
  });

  describe("isInWatchlist", () => {
    it("should return true when movie is in watchlist", async () => {
      const mockData = [{ movie_id: 1 }];

      // Mock the chain: from().select().match()
      const matchMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      const selectMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.isInWatchlist(1, "user1");
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith("watchlist");
      expect(selectMock).toHaveBeenCalled();
      expect(matchMock).toHaveBeenCalledWith({ movie_id: 1, user_id: "user1" });
    });

    it("should return false when movie is not in watchlist", async () => {
      const matchMock = vi.fn().mockResolvedValue({ data: [], error: null });
      const selectMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.isInWatchlist(1, "user1");
      expect(result).toBe(false);
    });
  });

  describe("addToWatchlist", () => {
    it("should add movie to watchlist successfully", async () => {
      const insertMock = vi.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({ insert: insertMock });

      await userPreferences.addToWatchlist(1, "user1");
      expect(mockSupabase.from).toHaveBeenCalledWith("watchlist");
      expect(insertMock).toHaveBeenCalledWith([
        { movie_id: 1, user_id: "user1" },
      ]);
    });

    it("should throw error when adding fails", async () => {
      const testError = new Error("Test error");
      const insertMock = vi.fn().mockResolvedValue({ error: testError });
      mockSupabase.from.mockReturnValue({ insert: insertMock });

      await expect(userPreferences.addToWatchlist(1, "user1")).rejects.toThrow(
        "Failed to add movie to watchlist: Test error",
      );
    });
  });

  describe("removeFromWatchlist", () => {
    it("should remove movie from watchlist successfully", async () => {
      const matchMock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ delete: deleteMock });

      await userPreferences.removeFromWatchlist(1, "user1");

      expect(mockSupabase.from).toHaveBeenCalledWith("watchlist");
      expect(deleteMock).toHaveBeenCalled();
      expect(matchMock).toHaveBeenCalledWith({ movie_id: 1, user_id: "user1" });
    });

    it("should throw error when removal fails", async () => {
      const testError = new Error("Test error");
      const matchMock = vi.fn().mockResolvedValue({ error: testError });
      const deleteMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ delete: deleteMock });

      await expect(
        userPreferences.removeFromWatchlist(1, "user1"),
      ).rejects.toThrow("Failed to remove movie from watchlist: Test error");
    });
  });

  describe("getHistory", () => {
    it("should fetch history successfully", async () => {
      const mockData = [
        { user_id: "user1", movie_id: 1 },
        { user_id: "user1", movie_id: 2 },
      ];

      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.getHistory();
      expect(result).toEqual([1, 2]);
      expect(mockSupabase.from).toHaveBeenCalledWith("history");
      expect(selectMock).toHaveBeenCalledWith("user_id, movie_id");
    });

    it("should return empty array on error", async () => {
      const selectMock = vi
        .fn()
        .mockResolvedValue({ data: null, error: new Error("Test error") });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.getHistory();
      expect(result).toEqual([]);
    });
  });

  describe("isInHistory", () => {
    it("should return true when movie is in history", async () => {
      const mockData = [{ movie_id: 1 }];

      const matchMock = vi
        .fn()
        .mockResolvedValue({ data: mockData, error: null });
      const selectMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.isInHistory(1, "user1");
      expect(result).toBe(true);
      expect(mockSupabase.from).toHaveBeenCalledWith("history");
      expect(selectMock).toHaveBeenCalled();
      expect(matchMock).toHaveBeenCalledWith({ movie_id: 1, user_id: "user1" });
    });

    it("should return false when movie is not in history", async () => {
      const matchMock = vi.fn().mockResolvedValue({ data: [], error: null });
      const selectMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ select: selectMock });

      const result = await userPreferences.isInHistory(1, "user1");
      expect(result).toBe(false);
    });
  });

  describe("addToHistory", () => {
    it("should add movie to history successfully", async () => {
      const insertMock = vi.fn().mockResolvedValue({ error: null });
      mockSupabase.from.mockReturnValue({ insert: insertMock });

      await userPreferences.addToHistory(1, "user1");
      expect(mockSupabase.from).toHaveBeenCalledWith("history");
      expect(insertMock).toHaveBeenCalledWith([
        { movie_id: 1, user_id: "user1" },
      ]);
    });

    it("should throw error when adding fails", async () => {
      const testError = new Error("Test error");
      const insertMock = vi.fn().mockResolvedValue({ error: testError });
      mockSupabase.from.mockReturnValue({ insert: insertMock });

      await expect(userPreferences.addToHistory(1, "user1")).rejects.toThrow(
        "Failed to add movie to history: Test error",
      );
    });
  });

  describe("removeFromHistory", () => {
    it("should remove movie from history successfully", async () => {
      const matchMock = vi.fn().mockResolvedValue({ error: null });
      const deleteMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ delete: deleteMock });

      await userPreferences.removeFromHistory(1, "user1");

      expect(mockSupabase.from).toHaveBeenCalledWith("history");
      expect(deleteMock).toHaveBeenCalled();
      expect(matchMock).toHaveBeenCalledWith({ movie_id: 1, user_id: "user1" });
    });

    it("should throw error when removal fails", async () => {
      const testError = new Error("Test error");
      const matchMock = vi.fn().mockResolvedValue({ error: testError });
      const deleteMock = vi.fn().mockReturnValue({ match: matchMock });
      mockSupabase.from.mockReturnValue({ delete: deleteMock });

      await expect(
        userPreferences.removeFromHistory(1, "user1"),
      ).rejects.toThrow("Failed to remove movie from history: Test error");
    });
  });
});
