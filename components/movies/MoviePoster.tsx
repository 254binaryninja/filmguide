'use client';

import React, { useState, useEffect } from 'react';
import { MovieDetails } from "@/lib/api/types";
import { tmdbService } from '@/lib/api/tmdb';
import { motion } from 'framer-motion';
import MovieInfoCard from './MovieInfocard';
import { useAuth, useSession, useUser } from '@clerk/nextjs';
import { UserPreferences } from '@/lib/api/userPreferences';


const ActionButtons = ({ 
  isWatchlist, 
  isHistory, 
  onToggleWatchlist, 
  onToggleHistory 
}: {
  isWatchlist: boolean;
  isHistory: boolean;
  onToggleWatchlist: () => void;
  onToggleHistory: () => void;
}) => (
  <div className="flex justify-between mb-6">
    <motion.button 
      onClick={onToggleHistory}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md"
    >
      <svg className={`h-5 w-5 ${isHistory ? 'text-blue-600' : ''}`} fill={isHistory ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
      <span>History</span>
    </motion.button>

    <motion.button 
      onClick={onToggleWatchlist}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-md"
    >
      <svg className={`h-5 w-5 ${isWatchlist ? 'text-red-600' : ''}`} fill={isWatchlist ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
      <span>Watchlist</span>
    </motion.button>
  </div>
);

const MoviePoster = ({ movie }: { movie: MovieDetails }) => {
  const { session } = useSession();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [userPrefInstance, setUserPrefInstance] = useState<UserPreferences | null>(null);
  const [isWatchlist, setIsWatchlist] = useState(false);
  const [isHistory, setIsHistory] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const posterUrl = movie?.poster_path ? tmdbService.getPosterURLProxy(movie.poster_path, "w500") : null;

  // Initialize userPreferences when session changes
  useEffect(() => {
    const initUserPrefs = async () => {
      if (session && isSignedIn && user) {
        try {
          const tokenPromise = session.getToken();
          const userPrefs = new UserPreferences(tokenPromise);
          setUserPrefInstance(userPrefs);
          
          // Load initial states
          await loadUserPreferences(userPrefs);
        } catch (error) {
          console.error('Error initializing user preferences:', error);
        }
      } else {
        setUserPrefInstance(null);
        setIsWatchlist(false);
        setIsHistory(false);
      }
      setIsLoading(false);
    };
    
    initUserPrefs();
  }, [session, isSignedIn, user]);

  // Separate function to load user preferences
  const loadUserPreferences = async (userPrefs: UserPreferences) => {
    if (!user) return;
    
    try {
      // Check if movie is in watchlist
      const watchlistStatus = await userPrefs.isInWatchlist(movie.id, user.id);
      setIsWatchlist(watchlistStatus);
      
      // Check if movie is in history
      const historyStatus = await userPrefs.isInHistory(movie.id, user.id);
      setIsHistory(historyStatus);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  // Toggle watchlist and history states
  const toggleWatchlist = async () => {
    if (!userPrefInstance || !user) return;

    try {
      if (isWatchlist) {
        await userPrefInstance.removeFromWatchlist(movie.id, user.id);
      } else {
        await userPrefInstance.addToWatchlist(movie.id, user.id);
      }
      setIsWatchlist(!isWatchlist);
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  }

  const toggleHistory = async () => {
    if (!userPrefInstance || !user) return;

    try {
      if (isHistory) {
        await userPrefInstance.removeFromHistory(movie.id, user.id);
      } else {
        await userPrefInstance.addToHistory(movie.id, user.id);
      }
      setIsHistory(!isHistory);
    } catch (error) {
      console.error('Error toggling history:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="md:col-span-1">
        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 aspect-[2/3] rounded-lg"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
      className="md:col-span-1"
    >
      <div className="sticky top-24">
        {/* Poster */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="relative aspect-[2/3] mb-6 rounded-lg overflow-hidden shadow-lg dark:shadow-gray-800/30"
        >
          {posterUrl && !imageError ? (
            <img 
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">No poster available</span>
            </div>
          )}
        </motion.div>

        {/* Action Buttons */}
        {isSignedIn && (
          <ActionButtons 
            isWatchlist={isWatchlist}
            isHistory={isHistory}
            onToggleWatchlist={toggleWatchlist}
            onToggleHistory={toggleHistory}
          />
        )}

        {/* Movie Info Card */}
        <MovieInfoCard movie={movie} />
      </div>
    </motion.div>
  );
};

export default MoviePoster