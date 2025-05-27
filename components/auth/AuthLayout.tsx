'use client'

import React, { useEffect, useState } from 'react'
import { usePopularMoviesStore } from '@/store/usePopularMovies'
import { tmdbService } from '@/lib/api/tmdb'
import { Movie } from '@/lib/api/types'
import Image from 'next/image'
import { motion } from 'framer-motion'

export default function AuthLayout({children}: {children: React.ReactNode}) {
  const { movies, fetchPopularMovies } = usePopularMoviesStore()
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Only show theme UI after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const initializeMovies = async () => {
      await fetchPopularMovies()
      setIsLoading(false)
    }
    
    initializeMovies()
  }, [fetchPopularMovies])

  useEffect(() => {
    if (movies.length > 0) {
      // Select a visually appealing movie for the backdrop
      const randomIndex = Math.floor(Math.random() * Math.min(5, movies.length))
      setFeaturedMovie(movies[randomIndex])
    }
  }, [movies])

  return (
    <div className="flex flex-col md:flex-row min-h-screen dark:bg-gray-900 transition-colors duration-200">
      {/* Left side - Auth form */}
      <motion.div 
        className="w-full md:w-1/2 p-8 flex items-center justify-center
                   bg-white dark:bg-gray-900 transition-colors duration-200"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </motion.div>

      {/* Right side - Movie backdrop */}
      <motion.div 
        className="relative w-full md:w-1/2 hidden md:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        {isLoading ? (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 animate-pulse transition-colors duration-200" />
        ) : featuredMovie ? (
          <>
            {/* Movie backdrop image */}
            <div className="absolute inset-0 overflow-hidden">
              {tmdbService.getBackdropURLProxy(featuredMovie.backdrop_path) && (
                <Image
                  src={tmdbService.getBackdropURLProxy(featuredMovie.backdrop_path, 'original') || ''}
                  alt={featuredMovie.title}
                  fill
                  className="object-cover"
                  priority
                />
              )}
              {/* Gradient overlay for readability - different for light/dark mode */}
              <div className="absolute inset-0 bg-gradient-to-r 
                             from-white via-white/60 to-transparent dark:from-black dark:via-black/60 dark:to-transparent
                             transition-colors duration-200" />
            </div>

            {/* Movie details */}
            <motion.div 
              className="absolute inset-0 flex flex-col justify-center px-12 z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <div className="max-w-sm">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  <h3 className="text-lg font-medium text-red-500 mb-2">Featured Film</h3>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4
                            transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.0 }}
                >
                  {featuredMovie.title}
                </motion.h2>
                
                <motion.div 
                  className="flex items-center space-x-3 mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.2 }}
                >
                  <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-md font-bold text-sm">
                    {featuredMovie.vote_average?.toFixed(1)}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm transition-colors duration-200">
                    {featuredMovie.release_date?.substring(0, 4)}
                  </span>
                </motion.div>
                
                <motion.p 
                  className="text-gray-700 dark:text-gray-300 line-clamp-4 transition-colors duration-200"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.4 }}
                >
                  {featuredMovie.overview}
                </motion.p>
                
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 1.6 }}
                >
                  <p className="text-gray-600 dark:text-white/70 text-sm transition-colors duration-200">
                    Join Filmguide to explore this and thousands of other titles.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-900 flex items-center justify-center
                         transition-colors duration-200">
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-200">
              No movie data available
            </p>
          </div>
        )}
      </motion.div>
    </div>
  )
}