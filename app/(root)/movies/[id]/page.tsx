import { Metadata, ResolvingMetadata } from 'next';
import { tmdbService } from '@/lib/api/tmdb';
import MoviePage from '@/components/movies/MoviePage';

type Props = {
  params: { id: string }
}

// Generate metadata for the page
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Fetch movie details on the server
  const id = parseInt(params.id);
  try {
    const movie = await tmdbService.getMovieDetails(id);
    
    return {
      title: `${movie.title} | FilmGuide`,
      description: movie.overview?.substring(0, 160) || `Details about ${movie.title}`,
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Movie Details | FilmGuide',
      description: 'View movie details',
    };
  }
}

// Server component
export default function MovieDetailPage({ params }: Props) {
  const id = parseInt(params.id);
  
  return (
    <div>
      <MoviePage id={id} />
    </div>
  );
}