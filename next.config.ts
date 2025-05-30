import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    nodeMiddleware: true,
    serverComponentsExternalPackages: [
      "@clerk/nextjs",
    ],
  },
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
