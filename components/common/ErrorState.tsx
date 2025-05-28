'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';



const ErrorState = ({ error }: { error: Error | null }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="w-full h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4"
  >
    <motion.div
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ repeat: Infinity, duration: 1.5 }}
      className="text-red-600 mb-4"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </motion.div>
    <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Error Loading Movie</h1>
    <p className="text-gray-600 dark:text-gray-400 mb-6">
      {error instanceof Error ? error.message : "An unexpected error occurred."}
    </p>
    <Link href="/">
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
      >
        Return to Home
      </motion.button>
    </Link>
  </motion.div>
);

export default ErrorState;