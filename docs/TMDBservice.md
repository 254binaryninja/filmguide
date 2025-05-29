# TMDBService Documentation

## Overview

The `TMDBService` class provides a clean, typed interface for interacting with The Movie Database (TMDB) API. This service handles all API communication, error handling, and response parsing to provide standardized access to movie and TV show data.

## Class Structure

```typescript
class TMDBService {
  private baseURL = "https://api.themoviedb.org/3";
  private accessToken = process.env.TMDB_ACCESS_TOKEN;

  // Methods...
}

export const tmdbService = new TMDBService();
```
