"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Home, RefreshCw } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Error500 from "@/public/animations/server-error.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const router = useRouter();
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    // Add a small delay for better UX
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  const floatingVariants = {
    float: {
      y: [-10, 10, -10],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Lottie Animation */}
        <motion.div
          className="w-80 h-80 mx-auto"
          variants={floatingVariants}
          animate="float"
        >
          <Lottie
            animationData={Error500}
            loop={true}
            autoplay={true}
            style={{ width: "100%", height: "100%" }}
          />
        </motion.div>

        {/* Error Title */}
        <motion.div variants={itemVariants}>
          <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              500
            </span>
          </h1>
          <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            Oops! Something went wrong
          </h2>
        </motion.div>

        {/* Error Description */}
        <motion.p
          className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed"
          variants={itemVariants}
        >
          We encountered an unexpected error. Don`&apos;`t worry, our team has
          been notified and is working on a fix.
        </motion.p>

        {/* Error Details (Development only) */}
        {process.env.NODE_ENV === "development" && (
          <motion.div
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8 text-left"
            variants={itemVariants}
          >
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-2">
              Error Details:
            </h3>
            <code className="text-sm text-red-700 dark:text-red-400 break-all">
              {error.message}
            </code>
            {error.digest && (
              <p className="text-xs text-red-600 dark:text-red-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </motion.div>
        )}

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex items-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow disabled:opacity-70"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <RefreshCw
              className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying..." : "Try Again"}
          </motion.button>

          <motion.button
            onClick={() => router.push("/")}
            className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-8 py-4 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Home className="w-5 h-5" />
            Go Home
          </motion.button>

          <motion.button
            onClick={() => router.back()}
            className="flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </motion.button>
        </motion.div>

        {/* Background Decorations */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-red-200 dark:bg-red-900 rounded-full opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 bg-orange-200 dark:bg-orange-900 rounded-full opacity-20"
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
