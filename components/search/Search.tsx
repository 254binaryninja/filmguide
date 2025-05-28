'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { tmdbService } from '@/lib/api/tmdb';
import { useQuery } from '@tanstack/react-query';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import LoadingState from '../common/LoadingState';
import ErrorState from '../common/ErrorState';
import { useUser } from '@clerk/nextjs';
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import debounce from 'lodash/debounce';

export default function Search() {
  const { user } = useUser();
  const isSignedIn = !!user;
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const router = useRouter();

  // Debounce search term to avoid excessive API calls
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 500),
    []
  );

  // Update debounced search term when input changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  // Get search suggestions
  const { data: suggestions, isLoading: isLoadingSuggestions } = useQuery({
    queryKey: ['searchSuggestions', debouncedSearchTerm],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return { movies: [] };
      return await tmdbService.getSearchSuggestions(debouncedSearchTerm, 5);
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  // Get full search results
  const { data: movies, isLoading: isLoadingMovies, error, isFetched: isMoviesFetched } = useQuery({
    queryKey: ['search', debouncedSearchTerm, selectedGenres],
    queryFn: async () => {
      if (!debouncedSearchTerm || debouncedSearchTerm.length < 2) return { results: [] };
      return await tmdbService.searchMovies(debouncedSearchTerm);
    },
    enabled: debouncedSearchTerm.length >= 2,
  });

  // Get genre list for filters
  const { data: genreData, isLoading: isLoadingGenres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      return await tmdbService.getMovieGenres();
    },
  });

  // Handle genre selection
  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  // Navigate to movie details page
  const handleMovieClick = (movieId: number) => {
    router.push(`/movies/${movieId}`);
    setOpen(false);
  };

  // Filter movies by selected genres if needed
  const filteredMovies = movies?.results && selectedGenres.length > 0
    ? movies.results.filter(movie => 
        movie.genre_ids.some(genreId => selectedGenres.includes(genreId))
      )
    : movies?.results || [];

  // Determine whether to show suggestions or results
  const showResults = debouncedSearchTerm.length >= 2 && isMoviesFetched && !isLoadingMovies;
  const showSuggestions = debouncedSearchTerm.length >= 2 && 
  suggestions && 
  suggestions.movies.length > 0 && 
  !isLoadingSuggestions && 
  !showResults;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
          <MagnifyingGlassIcon className="h-5 w-5" />
          <span className="ml-2 hidden sm:inline text-gray-700 dark:text-white">Search</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Search Movies</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full overflow-hidden">
          {/* Search input */}
          <div className="mb-4">
            <Input
              placeholder={`${
                isSignedIn ? user.fullName + ' Search for movies...' : 'Search for movies...'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
              autoFocus
            />
          </div>
          
          {/* Genre filters */}
          {genreData && (
            <div className="mb-4 flex flex-wrap gap-2">
              {genreData.genres.map((genre) => (
                <Badge 
                  key={genre.id}
                  variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleGenre(genre.id)}
                >
                  {genre.name}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Loading state */}
          {(isLoadingMovies || isLoadingGenres || isLoadingSuggestions) && (
            <div className="py-4">
              <LoadingState />
            </div>
          )}
          
          {/* Error state */}
          {error && <ErrorState error={error} />}
          
          {/* Suggestions when typing - only show if results aren't ready yet */}
          {showSuggestions && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Suggestions</h4>
              <div className="border rounded-md">
                {suggestions.movies.map((movie) => (
                  <div 
                    key={movie.id} 
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex items-center"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    {movie.poster_path ? (
                      <div className="flex-shrink-0 w-10 h-14 relative mr-2">
                        <Image
                          src={tmdbService.getPosterURLProxy(movie.poster_path, 'w92') || '/placeholder.png'}
                          alt={movie.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="rounded"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-14 bg-gray-200 dark:bg-gray-700 rounded mr-2 flex items-center justify-center">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{movie.title}</p>
                      <p className="text-sm text-gray-500">
                        {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown year'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Search results */}
          {showResults && (
            <div className="overflow-y-auto flex-grow">
              <h4 className="text-sm font-medium mb-2">Results</h4>
              {filteredMovies.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredMovies.map((movie) => (
                    <div 
                      key={movie.id} 
                      className="border rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleMovieClick(movie.id)}
                    >
                      <div className="flex">
                        {movie.poster_path ? (
                          <div className="flex-shrink-0 w-16 h-24 relative mr-3">
                            <Image
                              src={tmdbService.getPosterURLProxy(movie.poster_path, 'w154') || '/placeholder.png'}
                              alt={movie.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-24 bg-gray-200 dark:bg-gray-700 rounded mr-3 flex items-center justify-center">
                            <span className="text-xs">No image</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{movie.title}</h3>
                          <p className="text-sm text-gray-500">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown year'}
                          </p>
                          <p className="text-sm mt-1 line-clamp-2">{movie.overview || 'No description available'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>No movies found matching your criteria</p>
                </div>
              )}
            </div>
          )}
          
          {/* Empty state */}
          {debouncedSearchTerm.length < 2 && (
            <div className="text-center py-8 text-gray-500">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Type at least 2 characters to search for movies</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}