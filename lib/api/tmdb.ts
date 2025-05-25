// lib/api/tmdb.ts
import { Genre, Movie, MovieResponse, TVShow, TVShowResponse } from "./types";

class TMDBService {
  private baseURL = 'https://api.themoviedb.org/3';
  private accessToken = process.env.TMDB_ACCESS_TOKEN;

  private async fetchFromTMDB<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
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
