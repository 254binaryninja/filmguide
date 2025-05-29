"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePopularMoviesStore } from "@/store/usePopularMovies";
import { Movie } from "@/lib/api/types";
import { tmdbService } from "@/lib/api/tmdb";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircleIcon } from "@heroicons/react/24/solid";

export default function FilmGuideHeroSection() {
  const { movies, isLoading, fetchPopularMovies } = usePopularMoviesStore();
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [, setPreviousFeatured] = useState<Movie | null>(null);
  const [thumbnailMovies, setThumbnailMovies] = useState<Movie[]>([]);
  const [, setIsChanging] = useState(false);

  useEffect(() => {
    // Fetch popular movies when component mounts
    fetchPopularMovies();
  }, [fetchPopularMovies]);

  useEffect(() => {
    // set a movie from the top 5 as the featured movie
    if (movies.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * Math.min(5, movies.length),
      );
      setFeaturedMovie(movies[randomIndex]);

      // Set the next 4 movies (excluding the featured one) as thumbnails
      updateThumbnailMovies(movies[randomIndex], movies);
    }
  }, [movies]);

  const updateThumbnailMovies = (featured: Movie, allMovies: Movie[]) => {
    // Get 4 movies excluding the featured one
    const remainingMovies = allMovies.filter(
      (movie) => movie.id !== featured.id,
    );
    setThumbnailMovies(remainingMovies.slice(0, 4));
  };

  const handleThumbnailClick = (movie: Movie) => {
    // Set animation state
    setIsChanging(true);
    setPreviousFeatured(featuredMovie);

    // Small delay to allow animation to show
    setTimeout(() => {
      setFeaturedMovie(movie);
      updateThumbnailMovies(movie, movies);
      setIsChanging(false);
    }, 300);
  };

  if (isLoading || !featuredMovie) {
    return (
      <div className="w-full h-[600px] bg-gray-900 dark:bg-gray-950 animate-pulse flex items-center justify-center">
        <div className="space-y-4 text-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <PlayCircleIcon className="h-16 w-16 text-red-600 mx-auto" />
          </motion.div>
          <p className="text-gray-700 dark:text-gray-300 text-xl font-medium">
            Loading featured movies...
          </p>
        </div>
      </div>
    );
  }

  const backdropUrl = tmdbService.getBackdropURLProxy(
    featuredMovie.backdrop_path,
  );

  return (
    <section className="relative w-full min-h-[700px] mt-20">
      {/* Background Image with Dark Overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={featuredMovie.id}
          className="absolute inset-0 w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {backdropUrl && (
            <Image
              src={backdropUrl}
              alt={featuredMovie.title}
              fill
              priority
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/20 dark:from-black/90 dark:via-transparent dark:to-black/90"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent dark:from-black/80 dark:to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-white/40 to-transparent dark:from-black/90 dark:via-black/60 dark:to-black/30"></div>
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full container mx-auto px-4 py-8 flex flex-col md:flex-row">
        {/* Movie Information (Left Side on Desktop, Top on Mobile) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={featuredMovie.id}
            className="flex-1 flex flex-col justify-center space-y-6 md:pr-12 mb-10 pb-6 md:pb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4 }}
          >
            <div className="space-y-3">
              <motion.div
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white font-bold px-2 py-1 rounded text-sm">
                  {featuredMovie.vote_average?.toFixed(1)} ★
                </span>
                <span className="text-gray-700 text-sm">
                  {new Date(featuredMovie.release_date).getFullYear()}
                </span>
              </motion.div>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {featuredMovie.title}
              </motion.h1>
              <motion.div
                className="flex items-center space-x-2 text-gray-700 text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {featuredMovie.genre_ids?.map((genreId, index) => (
                  <span key={genreId}>
                    {index > 0 && " • "}
                    {genreId}
                  </span>
                ))}
              </motion.div>
            </div>
            <motion.p
              className="text-gray-700 dark:text-gray-200 line-clamp-3 md:line-clamp-4 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {featuredMovie.overview}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href={`/movies/${featuredMovie.id}`}>
                <motion.button
                  className="group bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white py-3 px-6 rounded-lg font-medium transition duration-200 flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  <span>More Details</span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Movie Info Overlay + Thumbnail List (Right Side on Desktop, Bottom on Mobile) */}
        <motion.div
          className="w-full md:w-[350px] lg:w-[400px] flex flex-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Semi-transparent Overlay Box */}
          <motion.div
            className="bg-white/10 dark:bg-black/60 backdrop-blur-md p-5 rounded-lg mb-4 hidden md:block border border-white/10"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">
              {featuredMovie.title}
            </h2>
            <div className="text-gray-300 mb-1">
              {featuredMovie.genre_ids?.join(", ")}
            </div>
            <div className="text-gray-400">
              {new Date(featuredMovie.release_date).getFullYear()}
            </div>
          </motion.div>

          {/* Thumbnails List */}
          <motion.div
            className="bg-white/10 dark:bg-black/60 backdrop-blur-md p-4 rounded-lg border border-white/10"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <h3 className="text-lg font-medium text-white mb-3">
              More to Watch
            </h3>
            <div className="space-y-3">
              {thumbnailMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  onClick={() => handleThumbnailClick(movie)}
                  className="flex items-center space-x-3 p-2 hover:bg-white/20 dark:hover:bg-gray-800/50 rounded-md transition cursor-pointer"
                  whileHover={{ scale: 1.03, x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative w-16 h-24 flex-shrink-0 overflow-hidden rounded">
                    {tmdbService.getPosterURLProxy(
                      movie.poster_path,
                      "w92",
                    ) && (
                      <Image
                        src={
                          tmdbService.getPosterURLProxy(
                            movie.poster_path,
                            "w92",
                          ) || ""
                        }
                        alt={movie.title}
                        fill
                        className="object-cover rounded hover:scale-110 transition duration-300"
                      />
                    )}
                  </div>
                  <div>
                    <h4 className="text-white font-medium line-clamp-1">
                      {movie.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(movie.release_date).getFullYear()}
                    </p>
                    <div className="mt-1 flex items-center">
                      <span className="text-yellow-500 text-xs font-bold mr-1">
                        ★
                      </span>
                      <span className="text-gray-300 text-xs">
                        {movie.vote_average?.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
