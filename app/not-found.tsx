'use client';

import { motion } from "framer-motion";
import { ArrowLeft, Home, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Error404 from "@/public/animations/404-error.json";

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

export default function NotFound() {
  const router = useRouter();
 

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  const floatingVariants = {
    float: {
      y: [-15, 15, -15],
      x: [-5, 5, -5],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px rgba(59, 130, 246, 0.3)",
        "0 0 40px rgba(59, 130, 246, 0.5)",
        "0 0 20px rgba(59, 130, 246, 0.3)"
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <motion.div
          className="max-w-4xl w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Lottie Animation */}
          <motion.div
            className="w-96 h-96 mx-auto mb-8"
            variants={floatingVariants}
            animate="float"
          >
            <Lottie
              animationData={Error404}
              loop={true}
              autoplay={true}
              style={{ width: '100%', height: '100%' }}
            />
          </motion.div>

          {/* Error Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-8xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                404
              </span>
            </h1>
            <h2 className="text-4xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Page Not Found
            </h2>
          </motion.div>

          {/* Error Description */}
          <motion.div
            className="max-w-2xl mx-auto mb-12"
            variants={itemVariants}
          >
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              The page you're looking for seems to have wandered off into the digital wilderness. 
              Don't worry, even the best explorers sometimes take a wrong turn!
            </p>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 mb-8">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">You are here: Lost in cyberspace</span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
            variants={itemVariants}
          >
            <motion.button
              onClick={() => router.push('/')}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-10 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Home className="w-6 h-6" />
              Take Me Home
            </motion.button>

            <motion.button
              onClick={() => router.back()}
              className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-10 py-4 rounded-full font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <ArrowLeft className="w-6 h-6" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Help Text */}
          <motion.div
            className="text-center text-gray-500 dark:text-gray-400"
            variants={itemVariants}
          >
            <p className="text-lg mb-2">Still lost?</p>
            <p className="text-base">
              Contact our support team or check out our{" "}
              <button
                onClick={() => router.push('/contact-us')}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                help center
              </button>
            </p>
          </motion.div>

          {/* Background Decorations */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-10 w-40 h-40 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20"
              animate={{
                scale: [1, 1.3, 1],
                rotate: [0, 360],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute bottom-1/4 right-16 w-32 h-32 bg-purple-200 dark:bg-purple-900 rounded-full opacity-20"
              animate={{
                scale: [1.3, 1, 1.3],
                rotate: [360, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute top-1/2 right-1/4 w-24 h-24 bg-indigo-200 dark:bg-indigo-900 rounded-full opacity-20"
              animate={{
                scale: [1, 1.5, 1],
                y: [-20, 20, -20],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}