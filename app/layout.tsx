// app/layout.tsx
import React from "react";
import { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProviders";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: {
    default: "Film Guide",
    template: "%s | Film Guide",
  },
  description:
    "Discover, track, and personalize your movie and TV show experience with Film Guide.",
  metadataBase: new URL("https://filmguide.vercel.app"),
  keywords: [
    "movies",
    "TV shows",
    "film recommendations",
    "watchlist",
    "favorites",
    "Film Guide",
  ],
  authors: [{ name: "Arnold Musandu", url: "https://ubuntudev.systems" }],
  openGraph: {
    title: "Film Guide",
    description:
      "Your personalized hub for discovering and managing movies and TV shows.",
    url: "https://filmguide.vercel.app",
    siteName: "Film Guide",
    images: [
      {
        url: "https://filmguide.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Film Guide Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Film Guide",
    description:
      "Discover and manage your favorite movies and TV shows with Film Guide.",
    images: ["https://filmguide.vercel.app/og-image.png"],
    creator: "@arnoldmusandu",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider>
      <ClerkProvider>
        <html lang="en" suppressHydrationWarning>
          <body className="antialiased">
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster richColors />
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </ReactQueryProvider>
  );
}
