# FilmGuide 🎬

A modern web application for movie enthusiasts to discover, track, and manage their movie watching experience. Built with Next.js, TypeScript, and TMDB API.

## Features

- 🎯 **Movie Discovery**: Search and browse movies with advanced filtering
- 📱 **Responsive Design**: Beautiful UI that works on all devices
- 🌙 **Dark Mode**: Built-in dark/light theme support
- 🔍 **Advanced Search**: Search with genre filters and real-time suggestions
- 📋 **Watchlist**: Save movies you want to watch
- 📊 **Watch History**: Keep track of movies you've watched
- 🔐 **Authentication**: Secure user authentication with Clerk
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components

## Tech Stack

- **Framework**: Next.js 15.3.2
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **API Integration**: TMDB API
- **Authentication**: Clerk
- **Database**: Supabase
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 22.1.0 or higher
- pnpm 9 or higher
- TMDB API key
- Clerk account
- Supabase account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/filmguide.git
cd filmguide
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:

```bash
pnpm dev
```

## Testing

The project uses Vitest for testing. Run tests with:

```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI
pnpm test:ui

# Generate coverage report
pnpm coverage
```

Current test coverage:

- Components: ~89% coverage
- API Services: ~90% coverage
- User Preferences: ~91% coverage

## Project Structure

```
filmguide/
├── app/                 # Next.js app directory
├── components/         # React components
│   ├── common/        # Shared components
│   ├── movies/        # Movie-related components
│   ├── search/        # Search functionality
│   └── ui/            # UI components
├── lib/               # Utility functions and API services
├── store/             # Zustand store
├── public/            # Static assets
└── types/             # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Clerk](https://clerk.dev/) for authentication
- [Supabase](https://supabase.io/) for database services
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
