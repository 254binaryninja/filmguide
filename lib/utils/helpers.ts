// Simple in-memory cache for image data
const imageCache = new Map<string, {
  data: ArrayBuffer,
  contentType: string,
  timestamp: number
}>();

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function getCachedImage(url: string) {
  const cached = imageCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached;
  }
  return null;
}

export function cacheImage(url: string, data: ArrayBuffer, contentType: string) {
  imageCache.set(url, {
    data,
    contentType,
    timestamp: Date.now()
  });
}