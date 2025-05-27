import Image from "next/image";
import Header from "@/components/header/header";
import FilmGuideHeroSection from "@/components/hero/HeroSection";
import MovieSection from "@/components/movies/MovieSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <FilmGuideHeroSection />
        <MovieSection />
        {/* Other content sections can go here */}
      </main>
    </div>
  );
}
 