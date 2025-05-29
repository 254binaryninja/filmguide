"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlayCircleIcon } from "@heroicons/react/24/outline";

// Components
const LoadingState = () => (
  <div className="w-full h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.1, 1],
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 1.5, ease: "linear" },
          scale: { repeat: Infinity, duration: 1.2 },
        }}
      >
        <PlayCircleIcon className="h-16 w-16 text-red-600 mx-auto" />
      </motion.div>
      <p className="text-gray-700 dark:text-gray-300 text-xl font-medium mt-4">
        Loading movie details...
      </p>
    </motion.div>
  </div>
);

export default LoadingState;
