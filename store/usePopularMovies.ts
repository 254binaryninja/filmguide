import { create } from "zustand";
import { tmdbService } from "@/lib/api/tmdb";
import { Movie } from "@/lib/api/types";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default queryClient;

interface PopularMoviesState {
  movies: Movie[];
  isLoading: boolean;
  error: {} | null;
  totalPages: number;
  currentPage: number;
  fetchPopularMovies: (page?: number) => Promise<void>;
}

export const usePopularMoviesStore = create<PopularMoviesState>((set) => ({
  movies: [],
  isLoading: false,
  error: null,
  totalPages: 0,
  currentPage: 1,
  fetchPopularMovies: async (page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const data = await queryClient.fetchQuery({
        queryKey: ["popularmovies-store", page],
        queryFn: () => tmdbService.getPopularMovies(page),
      });
      set({
        movies: data.results,
        isLoading: false,
        totalPages: data.total_pages,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching popular movies:", error);
      set({ isLoading: false, error });
    }
  },
}));
