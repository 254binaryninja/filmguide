"use client";

import { format } from "date-fns";
import { MovieDetails } from "@/lib/api/types";
import { motion } from "framer-motion";

const MovieInfoCard = ({ movie }: { movie: MovieDetails }) => {
  const formatRuntime = (minutes?: number) => {
    if (!minutes) return "Unknown";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const director = movie.credits?.crew?.find(
    (person) => person.job === "Director",
  );
  const writers = movie.credits?.crew
    ?.filter(
      (person) =>
        person.job === "Screenplay" ||
        person.job === "Writer" ||
        person.job === "Story",
    )
    .slice(0, 2);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-5 shadow-md">
      <h3 className="font-semibold text-lg mb-4 text-gray-800 dark:text-white">
        Movie Info
      </h3>

      <div className="space-y-3">
        {director && (
          <div className="flex">
            <span className="w-24 text-gray-600 dark:text-gray-400">
              Director:
            </span>
            <span className="font-medium">{director.name}</span>
          </div>
        )}

        {writers && writers.length > 0 && (
          <div className="flex">
            <span className="w-24 text-gray-600 dark:text-gray-400">
              Writers:
            </span>
            <span className="font-medium">
              {writers.map((w) => w.name).join(", ")}
            </span>
          </div>
        )}

        <div className="flex">
          <span className="w-24 text-gray-600 dark:text-gray-400">
            Release:
          </span>
          <span className="font-medium">
            {movie.release_date
              ? format(new Date(movie.release_date), "MMMM d, yyyy")
              : "Unknown"}
          </span>
        </div>

        <div className="flex">
          <span className="w-24 text-gray-600 dark:text-gray-400">
            Runtime:
          </span>
          <span className="font-medium">{formatRuntime(movie.runtime)}</span>
        </div>

        {movie.genres && (
          <div className="flex flex-col">
            <span className="w-24 text-gray-600 dark:text-gray-400 mb-1">
              Genres:
            </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {movie.genres.map((genre) => (
                <motion.span
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                  className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-xs"
                >
                  {genre.name}
                </motion.span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieInfoCard;
