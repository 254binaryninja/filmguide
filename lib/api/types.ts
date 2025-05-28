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
  genres?: Genre[]
  runtime?: number
  tagline?: string
  credits?: Credits
  production_companies?: ProductionCompany[]
  production_countries?: ProductionCountry[]
  spoken_languages?: SpokenLanguage[]
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

// New types for Cast and Crew
export interface Credits {
  cast: Cast[]
  crew: Crew[]
}

export interface Cast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
  gender?: number
  credit_id: string
  known_for_department?: string
  popularity?: number
}

export interface Crew {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
  credit_id: string
  gender?: number
  known_for_department?: string
  popularity?: number
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
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


// Types
export interface MovieDetails extends Movie {
  genres?: Genre[];
  runtime?: number;
  tagline?: string;
  credits?: {
    cast: Cast[];
    crew: Crew[];
  };
  production_companies?: {
    id: number;
    name: string;
    logo_path: string | null;
    origin_country: string;
  }[];
  production_countries?: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages?: {
    english_name: string;
    iso_639_1: string;
    name: string;
  }[];
}