'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import { toast } from "sonner"
import { useSession, useUser } from "@clerk/nextjs"
import { ClockIcon, HeartIcon, TrashIcon } from "@heroicons/react/24/outline"
import { UserPreferences } from "@/lib/api/userPreferences"
import { tmdbService } from "@/lib/api/tmdb"
import Image from "next/image"
import { Movie } from "@/lib/api/types"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

interface PreferenceProps {
    preference: 'history'|'watchlist'
}

export default function Preference({preference}:PreferenceProps) {
    const router = useRouter();
    const { session } = useSession();
    const { user } = useUser();
    const [token, setToken] = useState<Promise<string | null> | null>(null);
    const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
    const [open, setOpen] = useState(false);
    const { isSignedIn } = useAuth();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [movieIds, setMovieIds] = useState<number[]>([]);
    
    // Initialize token and userPreferences when session changes
    useEffect(() => {
        if (session && isSignedIn) {
            const tokenPromise = session.getToken();
            setToken(tokenPromise);
            setUserPreferences(new UserPreferences(tokenPromise));
        } else {
            setToken(null);
            setUserPreferences(null);
        }
    }, [session, isSignedIn]);

    const fetchPreferenceData = async () => {
        if (!isSignedIn || !user || !userPreferences) {
            console.log("Cannot fetch preference data: Missing user or preferences");
            return;
        }
        
        setLoading(true);
        try {
            let ids: number[] = [];
            
            if (preference === 'watchlist') {
                ids = await userPreferences.getWatchlist();
            } else {
                ids = await userPreferences.getHistory();
            }
            
            setMovieIds(ids);
            
            if (ids.length === 0) {
                setMovies([]);
                return;
            }
            
            // Fetch movie details for each ID
            const moviePromises = ids.map(id => tmdbService.getMovieDetails(id));
            const moviesData = await Promise.all(moviePromises);
            setMovies(moviesData);
        } catch (error) {
            console.error(`Failed to fetch ${preference}:`, error);
            toast.error(`Error loading your ${preference}. Please try again later.`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && isSignedIn && userPreferences) {
            fetchPreferenceData();
        }
    }, [open, isSignedIn, userPreferences]);

    const handleRemoveItem = async (movieId: number) => {
        if (!isSignedIn || !user || !userPreferences) return;
        
        try {
            if (preference === 'watchlist') {
                await userPreferences.removeFromWatchlist(movieId, user.id);
            } else {
                await userPreferences.removeFromHistory(movieId, user.id);
            }
            
            // Update the UI
            setMovies(movies.filter(movie => movie.id !== movieId));
            setMovieIds(movieIds.filter(id => id !== movieId));
            toast.success(`Removed from your ${preference}.`);
        } catch (error) {
            console.error(`Failed to remove from ${preference}:`, error);
            toast.error(`Error removing from your ${preference}.`);
        }
    };

    const handleButtonClick = (): Promise<void | undefined> => {
        if (!isSignedIn) {
            toast.error(`You need to be logged in to view your ${preference}.`);
            router.push("/sign-in");
            return Promise.resolve(undefined);
        }
        setOpen(true);
        return Promise.resolve(undefined);
    }
    
    return (
        <Dialog open={open} onOpenChange={(newOpen) => {
            // Only allow opening if user is signed in
            if (newOpen && !isSignedIn) {
                toast.error(`You need to be logged in to view your ${preference}.`);
                router.push("/sign-in");
                return;
            }
            setOpen(newOpen);
        }}>
            <button 
                onClick={handleButtonClick}
                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                aria-label={preference === 'history' ? 'History' : 'Watchlist'}
            >
                {preference === 'history' ? <ClockIcon className="h-5 w-5" /> : <HeartIcon className="h-5 w-5" />}
            </button>
            
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        {preference === 'history' ? 'Your Watch History' : 'Your Watchlist'}
                    </DialogTitle>
                    <DialogDescription>
                        {preference === 'history' 
                            ? 'Movies you\'ve marked as watched' 
                            : 'Movies you want to watch in the future'}
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="border rounded-lg p-3 space-y-3">
                                    <Skeleton className="h-[150px] w-full rounded-md" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : movies.length === 0 ? (
                        <div className="text-center py-10">
                            <div className="mb-4">
                                {preference === 'history' ? (
                                    <ClockIcon className="h-12 w-12 mx-auto text-gray-400" />
                                ) : (
                                    <HeartIcon className="h-12 w-12 mx-auto text-gray-400" />
                                )}
                            </div>
                            <h3 className="text-lg font-medium">
                                {preference === 'history' 
                                    ? 'No watch history yet' 
                                    : 'Your watchlist is empty'}
                            </h3>
                            <p className="text-gray-500 mt-2">
                                {preference === 'history'
                                    ? 'Movies you mark as watched will appear here'
                                    : 'Add movies to your watchlist to keep track of what you want to watch'}
                            </p>
                            <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
                                Browse movies
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {movies.map((movie) => (
                                <div key={movie.id} className="border rounded-lg overflow-hidden relative group">
                                    <Link href={`/movie/${movie.id}`}>
                                        <div className="relative h-[150px]">
                                            {movie.poster_path ? (
                                                <Image 
                                                    src={tmdbService.getPosterURLProxy(movie.poster_path) || '/placeholder-movie.png'}
                                                    alt={movie.title}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 100vw, 33vw"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                                    <span className="text-gray-500">No image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3">
                                            <h3 className="font-medium truncate">{movie.title}</h3>
                                            <p className="text-sm text-gray-500">
                                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                                {movie.vote_average ? ` • ${movie.vote_average.toFixed(1)}★` : ''}
                                            </p>
                                        </div>
                                    </Link>
                                    <button 
                                        onClick={() => handleRemoveItem(movie.id)}
                                        className="absolute top-2 right-2 p-1.5 bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label={`Remove ${movie.title} from ${preference}`}
                                    >
                                        <TrashIcon className="h-4 w-4 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}