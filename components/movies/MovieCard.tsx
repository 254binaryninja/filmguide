import React from "react";
import { Movie } from "@/lib/api/types";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function MovieCard({ movie }: { movie: Movie }) {
  return (
    <motion.div
      className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden shadow-lg"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/movies/${movie.id}`}>
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-white text-lg font-semibold">{movie.title}</h3>
          <p className="text-gray-300 text-sm" data-testid="release-date">
            {movie.release_date ? movie.release_date : ""}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
