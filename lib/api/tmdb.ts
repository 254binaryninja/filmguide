// lib/api/tmdb.ts
import { Genre, Movie, MovieResponse, TVShow, TVShowResponse } from "./types";


class TMDBService {
  private baseURL = 'https://api.themoviedb.org/3';
  private baseImageURL = 'https://image.tmdb.org/t/p';
  

  // Helper methods for image URLs

getPosterURLProxy(path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w342'): string | null {
  if (!path) return null;
  const imageUrl = `${this.baseImageURL}/${size}${path}`;
  return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
}

getBackdropURLProxy(path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'): string | null {
  if (!path) return null;
  const imageUrl = `${this.baseImageURL}/${size}${path}`;
  const proxyUrl = `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`; // Debug log
  return proxyUrl;
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async fetchFromTMDB<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const accessToken = process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN!;
    if (!accessToken) {
      throw new Error('TMDB_ACCESS_TOKEN is not set in environment variables.');
    }
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.status_message || response.statusText;
      throw new Error(`TMDB API Error: ${errorMessage}`);
    }

    return response.json();
  }

  // Movies
  async getPopularMovies(page = 1): Promise<MovieResponse> {
    return this.fetchFromTMDB<MovieResponse>('/movie/popular', { page });
  }

  async searchMovies(query: string, page = 1): Promise<MovieResponse> {
    return this.fetchFromTMDB<MovieResponse>('/search/movie', { query, page });
  }

  async getSearchSuggestions(query: string, limit = 5): Promise<{movies: Movie[] }> {
    if (!query || query.trim().length < 2) {
      return { movies: [] };
    }
    
    const [movieResults ] = await Promise.all([
      this.fetchFromTMDB<MovieResponse>('/search/movie', { query, page: 1 })
    ]);
    
    return {
      movies: movieResults.results.slice(0, limit)
    };
  }

  async getMovieDetails(id: number): Promise<Movie> {
    return this.fetchFromTMDB<Movie>(`/movie/${id}`, { append_to_response: 'credits,keywords' });
  }

  // TV Shows
  async getPopularTVShows(page = 1): Promise<TVShowResponse> {
    return this.fetchFromTMDB<TVShowResponse>('/tv/popular', { page });
  }

  async searchTVShows(query: string, page = 1): Promise<TVShowResponse> {
    return this.fetchFromTMDB<TVShowResponse>('/search/tv', { query, page });
  }

  async getTVShowDetails(id: number): Promise<TVShow> {
    return this.fetchFromTMDB<TVShow>(`/tv/${id}`, { append_to_response: 'credits,keywords' });
  }

  // Genres
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromTMDB<{ genres: Genre[] }>('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.fetchFromTMDB<{ genres: Genre[] }>('/genre/tv/list');
  }
  
  // Movies by Genre
  async getMoviesByGenre(genreId: number, page = 1): Promise<MovieResponse> {
    return this.fetchFromTMDB<MovieResponse>('/discover/movie', { 
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    });
  }

  // TV Shows by Genre
  async getTVShowsByGenre(genreId: number, page = 1): Promise<TVShowResponse> {
    return this.fetchFromTMDB<TVShowResponse>('/discover/tv', { 
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    });
  }
}

export const tmdbService = new TMDBService();
