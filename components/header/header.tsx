'use client'

import { cn } from "@/lib/utils";
import { ClockIcon, StarIcon, FilmIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useTheme } from "next-themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import ThemeToggle from "../providers/ThemeToggle";
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { UserButton, useAuth,SignInButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";


export default function Header() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [scrolling, setScrolling] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const router = useRouter();
    const { isSignedIn } = useAuth();

    // Ensures that the component is rendered client-side
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolling(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    //Check if the component is mounted to avoid hydration issues
    if (!mounted) {
        return null;
    }

    const handleHistory = () => {
        if (!isSignedIn) {
            toast.error("You need to be logged in to view your history.");
            router.push("/sign-in");
            return;
        }
        router.push("/history");
    }

    const handleWatchlist = () => {
        if (!isSignedIn) {
            toast.error("You need to be logged in to view your watchlist.");
            router.push("/sign-in");
            return;
        }
        router.push("/watchlist");
    }

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <nav className={cn(
                "fixed z-50 top-0 left-0 w-full transition-all duration-300",
                scrolling
                    ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-md py-2"
                    : "bg-transparent py-4"
            )}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and primary navigation */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center">
                                <FilmIcon className="h-8 w-8 text-red-600" />
                                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                                    FilmGuide
                                </span>
                            </Link>

                            {/* Desktop Navigation */}
                            <div className="hidden md:block ml-10">
                                <div className="flex items-center space-x-4">
                                    <Link 
                                        href="/movies"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                                    >
                                        Movies
                                    </Link>
                                    <Link 
                                        href="/tv-shows"
                                        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-red-600 dark:hover:text-red-500 transition-colors"
                                    >
                                        TV Shows
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Search Bar Placeholder - Will be replaced with actual search component */}
                        <div className="flex-1 max-w-lg mx-4">
                            <div className="relative">
                                <div className="flex items-center h-10 rounded-full bg-gray-100 dark:bg-gray-800 px-4 transition-all">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    <span className="ml-3 text-sm text-gray-400 dark:text-gray-500">
                                        Search for movies, TV shows, and more...
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Right side - user menu, theme toggle */}
                        <div className="flex items-center">
                            <div className="hidden md:flex items-center space-x-3">
                                <button 
                                    onClick={handleWatchlist}
                                    className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="Watchlist"
                                >
                                    <StarIcon className="h-5 w-5" />
                                </button>
                                <button 
                                    onClick={handleHistory}
                                    className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
                                    aria-label="History"
                                >
                                    <ClockIcon className="h-5 w-5" />
                                </button>
                                <ThemeToggle />
                                <div className="ml-1">
                                    { isSignedIn ? (
                                        <UserButton />
                                    ) : (
                                        <SignInButton/>
                                    )}
                                </div>
                            </div>

                            {/* Mobile menu button */}
                            <div className="md:hidden flex items-center">
                                <button
                                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                                    className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                                    aria-label="Toggle mobile menu"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {showMobileMenu ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {showMobileMenu && (
                        <motion.div 
                            className="md:hidden"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
                                <Link 
                                    href="/movies" 
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    Movies
                                </Link>
                                <Link 
                                    href="/tv-shows" 
                                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    onClick={() => setShowMobileMenu(false)}
                                >
                                    TV Shows
                                </Link>
                                <div className="pt-2 pb-1 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between px-3 py-2">
                                        <div className="flex items-center space-x-3">
                                            <button 
                                                onClick={() => {
                                                    handleWatchlist();
                                                    setShowMobileMenu(false);
                                                }}
                                                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                aria-label="Watchlist"
                                            >
                                                <StarIcon className="h-5 w-5" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    handleHistory();
                                                    setShowMobileMenu(false);
                                                }}
                                                className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800"
                                                aria-label="History"
                                            >
                                                <ClockIcon className="h-5 w-5" />
                                            </button>
                                            <ThemeToggle />
                                        </div>
                                        { isSignedIn ? (
                                            <UserButton />
                                           ):(
                                            <SignInButton/>
                                          )
                                        }
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </motion.header>
    );
}