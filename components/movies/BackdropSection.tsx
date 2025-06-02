"use client";

import React, { useState } from "react";
import { tmdbService } from "@/lib/api/tmdb";
import { motion } from "framer-motion";
import Image from "next/image";
import { format } from "date-fns";
import { MovieDetails } from "@/lib/api/types";
import { useRouter } from "next/navigation";

const MovieMetadata = ({
  movie,
  formatRuntime,
}: {
  movie: MovieDetails;
  formatRuntime: (minutes?: number) => string;
}) => (
  <div className="flex flex-wrap items-center gap-4 text-gray-300">
    {movie.release_date && (
      <span className="flex items-center">
        <svg
          className="h-4 w-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {format(new Date(movie.release_date), "yyyy")}
      </span>
    )}
    {movie.runtime && (
      <span className="flex items-center">
        <svg
          className="h-4 w-4 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {formatRuntime(movie.runtime)}
      </span>
    )}
    <span className="flex items-center">
      <svg
        className="h-4 w-4 mr-1 text-yellow-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
      {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)
    </span>
  </div>
);

const BackdropSection = ({ movie }: { movie: MovieDetails }) => {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const backdropUrl = movie?.backdrop_path
    ? tmdbService.getBackdropURLProxy(movie.backdrop_path, "w1280")
    : null;
  console.log("Backdrop URL:", backdropUrl); // Debug log

  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative w-full h-[50vh] md:h-[70vh]"
    >
      {/* Back Button */}
      <div className="absolute top-20 left-4 z-20">
        <button
          onClick={handleBack}
          className="flex items-center justify-center bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          aria-label="Go back"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      {backdropUrl && !imageError ? (
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={backdropUrl}
            alt={movie.title || "Movie backdrop"}
            className="w-full h-full object-cover"
            width={1280}
            height={720}
            onError={(e) => {
              console.error("Error loading backdrop Image:", e);
              console.error("Backdrop image failed to load:", backdropUrl);
              setImageError(true);
            }}
            onLoad={() => {
              console.log("Backdrop image loaded successfully:", backdropUrl);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-transparent to-transparent opacity-20"></div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-gray-900">
          <div className="absolute inset-0 opacity-20 bg-pattern-dots"></div>
        </div>
      )}

      {/* Movie Title Overlay */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 left-0 right-0 p-6 md:p-12"
      >
        <div className="container mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 drop-shadow-lg">
            {movie.title}
          </h1>
          <MovieMetadata movie={movie} formatRuntime={formatRuntime} />
          {movie.tagline && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-300 italic mt-2"
            >
              &quot;{movie.tagline}&quot;
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BackdropSection;
