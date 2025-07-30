# FilmGuide 🎬

A modern web application for movie enthusiasts to discover, track, and manage their movie watching experience. Built with Next.js, TypeScript, and TMDB API.

## 🚀 Notable Features

- ✨ **Framer Motion Animations** – Smooth, elegant transitions and micro-interactions enhance the user experience.
- 🎥 **Custom Error Pages with Lottie Animations** – Branded 404 and error fallback pages for delightful failure states.
- 💤 **Lazy Loading for Images** – Optimized performance and bandwidth savings via progressive loading.
- ⚙️ **Smart Caching Strategy** – Custom TMDB service layer with React Query and proxy-based image caching.
- 👤 **Progressive Authentication UX** – Browse as a guest; login only when personalization is needed (Watchlist/History).
- 🔍 **Debounced Search Dialog** – Real-time search with throttling to reduce API calls and improve responsiveness.
- 💅 **Clean, Modular Architecture** – Service-based design with typed contracts, separation of concerns, and scalable patterns.
- 🧪 **Comprehensive Testing** – Unit-tested components, services, and state using Vitest + React Testing Library.
- 📦 **CI/CD with GitHub Actions + Vercel** – Automated lint, test, and deploy pipeline for continuous delivery.
- 🔐 **Secure Authentication** – Clerk-powered login/session management with protected routes via middleware.

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
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **API Integration**: TMDB API
- **Authentication**: Clerk
- **Database**: Supabase
- **Testing**: Vitest + React Testing Library
- **Package Manager**: pnpm
- **Observability**: Sentry

## UI Testing

**FilmGuide uses [storybook JS](https://storybook.js.org/) version 8.16.4 for UI testing by taking advantage of storybook's isolated test environments**

It spins up it's own server on port 6006 in order to view and play around with the components in a sandboxed environment.

You can tweak it's behaviour in package.json here is it's current config.

Here are the current components being tested
[Stories](stories)

```Json
    "storybook": "storybook dev -p 6006",
    "build-storybook": "storybook build"
```

```bash
pnpm storybook
```

## Observability 📊

> **FilmGuide uses [Sentry](https://sentry.io) for comprehensive application monitoring and error tracking.**

<div align="center">
  <img src="https://sentry-brand.storage.googleapis.com/sentry-logo-black.png" alt="Sentry Logo" width="300" />
</div>

### Key Benefits:

- 🔍 **Real-time Error Monitoring**: Instant alerts on application errors
- 📈 **Performance Tracking**: Monitor application performance metrics
- 🔄 **Session Replay**: Understand user interactions that lead to issues
- 📱 **Cross-platform Support**: Tracking across web and mobile experiences
- 🔒 **Security & Compliance**: GDPR, SOC 2, and HIPAA compliant

> Sentry configuration files can be found at:
>
> - [`sentry.edge.config.ts`](./sentry.edge.config.ts)
> - [`sentry.server.config.ts`](./sentry.server.config.ts)

## Getting Started

### Prerequisites

- Node.js 22.1.0 or higher
- **pnpm 10.12.1 or higher** (required - this project uses pnpm as the package manager)
- TMDB Access Token
- Clerk account
- Supabase account and a project instance

> **Note**: This project uses pnpm as the package manager. If you don't have pnpm installed, you can install it globally with:
>
> ```bash
> npm install -g pnpm
> ```
>
> Or enable Corepack (built into Node.js 16.9+) which will automatically use the correct version:
>
> ```bash
> corepack enable
> ```

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
NEXT_PUBLIC_TMDB_ACCESS_TOKEN=your_tmdb_access_token
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> **Note:** See `.env.example` for a template of all required environment variables.

4. Start the development server:

```bash
pnpm run dev
```

## Testing

The project uses Vitest for testing. Run tests with:

```bash
# Run tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Generate coverage report
pnpm run coverage
```

Current test coverage:

- See the [TEST_SUMMARY.md](_tests_/TEST_SUMMARY.md)
- On testing guidance see the [TEST_README](_tests_/README.md)

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

## CI/CD Pipeline

This project uses GitHub Actions for CI/CD:

- **Continuous Integration**: Runs on every PR and push to main

  - Linting and code quality checks
  - Unit and integration tests
  - Build verification

- **Continuous Deployment**: Automatically deploys to Vercel on successful builds from the main branch

### Required GitHub Repository Secrets

For CI/CD to work properly, add these secrets to your GitHub repository:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Your Clerk publishable key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`:Your Supabase anon key/api key
- `CLERK_SECRET_KEY`: Your Clerk secret key
- `NEXT_PUBLIC_TMDB_ACCESS_TOKEN`: Your TMDB access token
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

## Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [Clerk](https://clerk.dev/) for authentication
- [Supabase](https://supabase.com/) for database services/Postgres Instance
- [Next.js](https://nextjs.org/) for the framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
