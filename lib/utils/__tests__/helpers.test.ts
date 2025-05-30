// lib/utils/__tests__/helpers.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getCachedImage, cacheImage } from "../helpers";

describe("Image Caching Utilities", () => {
  // Reset cache between tests
  beforeEach(() => {
    // Clear any previously cached images
    // We need to access the private cache - using a workaround via global scope
    const globalAny = global as any;
    if (globalAny.imageCache) {
      globalAny.imageCache.clear();
    }
  });

  describe("cacheImage", () => {
    it("should store image data in cache", () => {
      // Arrange
      const url = "https://example.com/test.jpg";
      const data = new ArrayBuffer(8);
      const contentType = "image/jpeg";

      // Act
      cacheImage(url, data, contentType);
      const cachedItem = getCachedImage(url);

      // Assert
      expect(cachedItem).not.toBeNull();
      expect(cachedItem?.data).toBe(data);
      expect(cachedItem?.contentType).toBe(contentType);
      expect(cachedItem?.timestamp).toBeTypeOf("number");
    });

    it("should overwrite existing cached data for the same URL", () => {
      // Arrange
      const url = "https://example.com/test.jpg";
      const initialData = new ArrayBuffer(8);
      const updatedData = new ArrayBuffer(16);
      const contentType = "image/jpeg";

      // Act
      cacheImage(url, initialData, contentType);
      const initialCachedItem = getCachedImage(url);

      cacheImage(url, updatedData, contentType);
      const updatedCachedItem = getCachedImage(url);

      // Assert
      expect(initialCachedItem?.data).toBe(initialData);
      expect(updatedCachedItem?.data).toBe(updatedData);
      expect(updatedCachedItem?.data).not.toBe(initialCachedItem?.data);
    });
  });

  describe("getCachedImage", () => {
    it("should return null for non-existent cache entries", () => {
      // Arrange
      const url = "https://example.com/nonexistent.jpg";

      // Act
      const result = getCachedImage(url);

      // Assert
      expect(result).toBeNull();
    });

    it("should return cached data when available and not expired", () => {
      // Arrange
      const url = "https://example.com/test.jpg";
      const data = new ArrayBuffer(8);
      const contentType = "image/png";

      // Act
      cacheImage(url, data, contentType);
      const result = getCachedImage(url);

      // Assert
      expect(result).not.toBeNull();
      expect(result?.data).toBe(data);
      expect(result?.contentType).toBe(contentType);
    });

    it("should return null for expired cache entries", () => {
      // Arrange
      const url = "https://example.com/test.jpg";
      const data = new ArrayBuffer(8);
      const contentType = "image/jpeg";

      // Mock Date.now to simulate entry creation time
      const realDateNow = Date.now;
      const mockTime = 1000000;
      Date.now = vi.fn().mockReturnValue(mockTime);

      // Create cache entry
      cacheImage(url, data, contentType);

      // Mock Date.now to simulate time after TTL expiration (24 hours + 1 second)
      const ttl = 24 * 60 * 60 * 1000;
      Date.now = vi.fn().mockReturnValue(mockTime + ttl + 1000);

      // Act
      const result = getCachedImage(url);

      // Restore Date.now
      Date.now = realDateNow;

      // Assert
      expect(result).toBeNull();
    });
  });
});
