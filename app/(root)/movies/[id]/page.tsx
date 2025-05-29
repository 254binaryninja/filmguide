import { Metadata } from "next";
import { tmdbService } from "@/lib/api/tmdb";
import MoviePage from "@/components/movies/MoviePage";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  // Fetch movie details on the server
  const { id } = await params;
  const movieId = parseInt(id);

  try {
    const movie = await tmdbService.getMovieDetails(movieId);

    return {
      title: `${movie.title} | FilmGuide`,
      description:
        movie.overview?.substring(0, 160) || `Details about ${movie.title}`,
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Movie Details | FilmGuide",
      description: "View movie details",
    };
  }
}

// Server component
export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  return (
    <div>
      <MoviePage id={movieId} />
    </div>
  );
}
