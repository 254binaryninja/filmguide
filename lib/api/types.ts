// lib/types.ts
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
}

export interface MovieResponse {
  page: number
  results: MovieResult[]
  total_results?: number
  total_pages?: number
}

export interface MovieResult {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string | null
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
}

export interface UserMovieData {
  favorites: number[]
  watchlist: number[]
  ratings: Record<number, number> // movieId -> rating (1-5)
  watchHistory: number[]
}

export interface Genre {
  id: number
  name: string
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
}

export interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_results?: number;
  total_pages?: number;
}
