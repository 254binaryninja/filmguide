"use client";

import React, { useState } from "react";
import { Cast, MovieDetails } from "@/lib/api/types";
import { useQuery } from "@tanstack/react-query";
import { tmdbService } from "@/lib/api/tmdb";
import { AnimatePresence, motion } from "framer-motion";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import BackdropSection from "./BackdropSection";
import MoviePoster from "./MoviePoster";
import Image from "next/image";

const CastSection = ({ cast }: { cast: Cast[] }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center">
      <svg
        className="h-6 w-6 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
        />
      </svg>
      Cast
    </h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {cast.slice(0, 8).map((person) => (
        <CastMember key={person.id} person={person} />
      ))}
    </div>
    {cast.length > 8 && (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
      >
        Total cast: {cast.length} members
      </motion.button>
    )}
  </div>
);

const CastMember = ({ person }: { person: Cast }) => {
  const [imageError, setImageError] = useState(false);
  const profileUrl = person.profile_path
    ? tmdbService.getPosterURLProxy(person.profile_path, "w185")
    : null;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
    >
      <div className="relative h-40 bg-gray-200 dark:bg-gray-700">
        {profileUrl && !imageError ? (
          <Image
            src={profileUrl}
            alt={person.name}
            width={185}
            height={278}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <h4 className="font-medium text-gray-900 dark:text-white truncate">
          {person.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
          {person.character}
        </p>
      </div>
    </motion.div>
  );
};

const ProductionInfo = ({ movie }: { movie: MovieDetails }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
    {movie.production_companies && movie.production_companies.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Production Companies
        </h3>
        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
          {movie.production_companies.map((company) => (
            <li key={company.id}>{company.name}</li>
          ))}
        </ul>
      </div>
    )}

    {movie.production_countries && movie.production_countries.length > 0 && (
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
          Production Countries
        </h3>
        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
          {movie.production_countries.map((country) => (
            <li key={country.iso_3166_1}>{country.name}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

const LanguagesSection = ({
  languages,
}: {
  languages: MovieDetails["spoken_languages"];
}) => (
  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white flex items-center">
      <svg
        className="h-5 w-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
        />
      </svg>
      Spoken Languages
    </h3>
    <div className="flex flex-wrap gap-2">
      {languages?.map((language) => (
        <span
          key={language.iso_639_1}
          className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full text-sm"
        >
          {language.english_name}
        </span>
      ))}
    </div>
  </div>
);

// Main Component
export default function MoviePage({ id }: { id: number }) {
  // Fetch movie details
  const {
    data: movie,
    isLoading,
    error,
  } = useQuery<MovieDetails>({
    queryKey: ["movie", id],
    queryFn: async () => {
      if (!id) {
        throw new Error("Movie ID is required");
      }
      return await tmdbService.getMovieDetails(id);
    },
  });

  if (isLoading) return <LoadingState />;
  if (error || !movie) return <ErrorState error={error} />;

  return (
    <AnimatePresence mode="wait">
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        {/* Backdrop Section */}
        <BackdropSection movie={movie} />

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Poster and Quick Info */}
            <MoviePoster movie={movie} />

            {/* Right Column - Movie Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-2 space-y-8"
            >
              {/* Overview */}
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                  Overview
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                  {movie.overview || "No overview available."}
                </p>
              </div>

              {/* Cast */}
              {movie.credits?.cast && movie.credits.cast.length > 0 && (
                <CastSection cast={movie.credits.cast} />
              )}

              {/* Production Info */}
              <ProductionInfo movie={movie} />

              {/* Languages */}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <LanguagesSection languages={movie.spoken_languages} />
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
}
