/* eslint-disable @typescript-eslint/no-explicit-any */

// app/api/image-proxy/__tests__/route.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import { GET } from "../route";
import * as helpers from "@/lib/utils/helpers";

// Mock Next.js components and utilities
vi.mock("next/server", () => ({
  NextRequest: vi.fn(),
  NextResponse: vi.fn((data) => ({ data })),
}));

// Mock the helper functions
vi.mock("@/lib/utils/helpers", () => ({
  getCachedImage: vi.fn(),
  cacheImage: vi.fn(),
}));

describe("Image Proxy API Route", () => {
  let request: NextRequest;

  beforeEach(() => {
    vi.resetAllMocks();

    // Setup mock request with URL parameters
    request = {
      nextUrl: {
        searchParams: new Map(),
      },
    } as unknown as NextRequest;

    // Setup NextResponse.mockImplementation
    (NextResponse as any).mockImplementation((data: any, options: any) => ({
      body: data,
      ...options,
    }));
  });

  it("should return 400 if url parameter is missing", async () => {
    // Arrange
    request.nextUrl.searchParams.get = vi.fn().mockReturnValue(null);

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toBe("Missing URL parameter");
  });

  it("should return cached image if available", async () => {
    // Arrange
    const imageUrl = "https://example.com/image.jpg";
    request.nextUrl.searchParams.get = vi.fn().mockReturnValue(imageUrl);

    const cachedData = {
      data: new ArrayBuffer(8),
      contentType: "image/jpeg",
      timestamp: Date.now(),
    };
    (helpers.getCachedImage as any).mockReturnValue(cachedData);

    // Act
    const response = await GET(request);

    // Assert
    expect(helpers.getCachedImage).toHaveBeenCalledWith(imageUrl);
    expect(response.body).toBe(cachedData.data);
  });

  it("should fetch and cache image if not in cache", async () => {
    // Arrange
    const imageUrl = "https://example.com/image.jpg";
    request.nextUrl.searchParams.get = vi.fn().mockReturnValue(imageUrl);
    (helpers.getCachedImage as any).mockReturnValue(null);

    // Mock fetch response
    const mockImageBuffer = new ArrayBuffer(16);
    const mockContentType = "image/png";
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(mockImageBuffer),
      headers: {
        get: vi
          .fn()
          .mockImplementation((key) =>
            key === "content-type" ? mockContentType : null,
          ),
      },
    });

    // Act
    const response = await GET(request);

    // Assert
    expect(global.fetch).toHaveBeenCalledWith(
      imageUrl,
      expect.objectContaining({
        cache: "force-cache",
      }),
    );
    expect(helpers.cacheImage).toHaveBeenCalledWith(
      imageUrl,
      mockImageBuffer,
      mockContentType,
    );
    expect(response.body).toBe(mockImageBuffer);
  });

  it("should handle fetch errors properly", async () => {
    // Arrange
    const imageUrl = "https://example.com/image.jpg";
    request.nextUrl.searchParams.get = vi.fn().mockReturnValue(imageUrl);
    (helpers.getCachedImage as any).mockReturnValue(null);

    // Mock fetch error
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(500);
    expect(response.body).toBe("Error fetching image");
    expect(consoleErrorSpy).toHaveBeenCalled();

    // Restore console.error
    consoleErrorSpy.mockRestore();
  });

  it("should handle unsuccessful image responses", async () => {
    // Arrange
    const imageUrl = "https://example.com/image.jpg";
    request.nextUrl.searchParams.get = vi.fn().mockReturnValue(imageUrl);
    (helpers.getCachedImage as any).mockReturnValue(null);

    // Mock unsuccessful fetch response
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    // Act
    const response = await GET(request);

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toBe("Failed to fetch image");
  });

  it("should set a timeout for the fetch request", async () => {
    // Arrange
    const imageUrl = "https://example.com/image.jpg";
    request.nextUrl.searchParams.get = vi.fn().mockReturnValue(imageUrl);
    (helpers.getCachedImage as any).mockReturnValue(null);

    // Mock AbortController
    const mockAbortSignal = {} as AbortSignal;
    const mockAbortController = {
      signal: mockAbortSignal,
      abort: vi.fn(),
    } as unknown as AbortController;
    global.AbortController = vi.fn(
      () => mockAbortController,
    ) as unknown as typeof AbortController;

    // Mock successful fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      headers: {
        get: vi.fn(),
      },
    });

    // Mock setTimeout
    const originalSetTimeout = global.setTimeout;
    const setTimeoutSpy = vi
      .spyOn(global, "setTimeout")
      .mockReturnValue(123 as unknown as NodeJS.Timeout);
    const clearTimeoutSpy = vi
      .spyOn(global, "clearTimeout")
      .mockImplementation(() => {});

    // Act
    await GET(request);

    // Assert
    expect(global.setTimeout).toHaveBeenCalledWith(expect.any(Function), 20000);
    expect(global.fetch).toHaveBeenCalledWith(
      imageUrl,
      expect.objectContaining({
        signal: mockAbortController.signal,
      }),
    );
    expect(global.clearTimeout).toHaveBeenCalledWith(123);

    // Restore setTimeout
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
    global.setTimeout = originalSetTimeout;
  });
});
