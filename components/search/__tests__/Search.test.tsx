/* eslint-disable @typescript-eslint/no-explicit-any */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../Search';
import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

// Mock external dependencies
vi.mock('@clerk/nextjs', () => ({
  useUser: vi.fn(),
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

vi.mock('@/lib/api/tmdb', () => ({
  tmdbService: {
    getSearchSuggestions: vi.fn(),
    searchMovies: vi.fn(),
    getMovieGenres: vi.fn(),
    getPosterURLProxy: vi.fn(),
  },
}));

// Create a mock router that can be accessed in tests
const mockRouter = { push: vi.fn() };

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}));

describe('Search Component', () => {
  const mockGenres = {
    genres: [
      { id: 1, name: 'Action' },
      { id: 2, name: 'Comedy' },
    ],
  };

  const mockSuggestions = {
    movies: [
      {
        id: 1,
        title: 'Test Movie 1',
        poster_path: '/test1.jpg',
        release_date: '2023-01-01',
      },
    ],
  };

  const mockSearchResults = {
    results: [
      {
        id: 1,
        title: 'Test Movie 1',
        poster_path: '/test1.jpg',
        release_date: '2023-01-01',
        overview: 'Test overview',
        genre_ids: [1, 2],
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock user authentication
    (useUser as any).mockReturnValue({
      user: { fullName: 'Test User' },
    });

    // Mock genre query
    (useQuery as any).mockImplementation(({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'genres') {
        return {
          data: mockGenres,
          isLoading: false,
        };
      }
      return {
        data: null,
        isLoading: false,
      };
    });
  });

  const openSearchDialog = async () => {
    const searchButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(searchButton);
    
    // Wait for dialog to open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  };

  it('renders search button and dialog', async () => {
    render(<Search />);
    
    // Check for search button
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    
    // Open dialog
    await openSearchDialog();
    
    // Check for dialog title
    expect(screen.getByText('Search Movies')).toBeInTheDocument();
  });

  it('shows personalized placeholder when user is signed in', async () => {
    render(<Search />);
    await openSearchDialog();
    
    const searchInput = screen.getByPlaceholderText(/test user search for movies/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('shows generic placeholder when user is not signed in', async () => {
    (useUser as any).mockReturnValue({ user: null });
    
    render(<Search />);
    await openSearchDialog();
    
    const searchInput = screen.getByPlaceholderText(/search for movies/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('displays genre filters', async () => {
    render(<Search />);
    await openSearchDialog();
    
    // Wait for genres to load
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
      expect(screen.getByText('Comedy')).toBeInTheDocument();
    });
  });

  it('handles search input and shows suggestions', async () => {
    // Mock suggestions query
    (useQuery as any).mockImplementation(({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'searchSuggestions') {
        return {
          data: mockSuggestions,
          isLoading: false,
        };
      }
      return {
        data: null,
        isLoading: false,
      };
    });

    render(<Search />);
    await openSearchDialog();
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Wait for debounce
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });
  });

  it('handles genre selection', async () => {
    render(<Search />);
    await openSearchDialog();
    
    // Wait for genres to load
    await waitFor(() => {
      expect(screen.getByText('Action')).toBeInTheDocument();
    });
    
    // Click on genre
    fireEvent.click(screen.getByText('Action'));
    
    // Check if genre is selected
    expect(screen.getByText('Action')).toHaveClass('bg-primary');
  });

  it('shows loading state while fetching data', async () => {
    (useQuery as any).mockImplementation(() => ({
      isLoading: true,
      data: null,
    }));

    render(<Search />);
    await openSearchDialog();
    
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });

  it('shows error state when search fails', async () => {
    (useQuery as any).mockImplementation(() => ({
      error: new Error('Search failed'),
      data: null,
    }));

    render(<Search />);
    await openSearchDialog();
    
    expect(screen.getByTestId('error-state')).toBeInTheDocument();
  });

  it('navigates to movie details when clicking a movie', async () => {
    // Mock search results
    (useQuery as any).mockImplementation(({ queryKey }: { queryKey: string[] }) => {
      if (queryKey[0] === 'search') {
        return {
          data: mockSearchResults,
          isLoading: false,
          isFetched: true,
        };
      }
      return {
        data: null,
        isLoading: false,
      };
    });

    render(<Search />);
    await openSearchDialog();
    
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Wait for results to load
    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument();
    });
    
    // Click on movie
    fireEvent.click(screen.getByText('Test Movie 1'));
    
    // Check if navigation was called
    expect(mockRouter.push).toHaveBeenCalledWith('/movies/1');
  });
}); 