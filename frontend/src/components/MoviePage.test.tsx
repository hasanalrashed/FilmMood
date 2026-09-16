import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import MoviePage from './MoviePage';
import { getMovie } from '../api';

// Mock useParams to return a fake ID
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual as any,
    useParams: () => ({ id: '1' }),
  };
});

vi.mock('../api', () => ({
  getMovie: vi.fn(),
}));

describe('MoviePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    // 1. Arrange: Provide a promise that doesn't resolve immediately to simulate an API request in flight
    vi.mocked(getMovie).mockImplementation(() => new Promise(() => {}));
    
    // 2. Act: Render the component wrapped in a BrowserRouter (required because it uses useNavigate/useParams)
    const { container } = render(<BrowserRouter><MoviePage /></BrowserRouter>);
    
    // 3. Assert: Verify that the skeleton loader element is visible while waiting for data
    expect(container.querySelector('.loading-skeleton')).toBeInTheDocument();
  });

  it('displays movie details after fetching', async () => {
    // 1. Arrange: Setup the mock API to immediately resolve with our test movie data
    vi.mocked(getMovie).mockResolvedValue({
      id: 238,
      title: 'The Godfather',
      year: 1972,
      runtime: 175,
      rating: 9.2,
      genres: ['Crime', 'Drama'],
      poster_path: null,
      backdrop_path: null,
      moods: {
        Dark: 0.9,
        Tense: 0.8
      }
    });
    
    // 2. Act: Render the component
    render(<BrowserRouter><MoviePage /></BrowserRouter>);
    
    // 3. Assert: Wait for the API to resolve and check that all key details appear on the screen
    await waitFor(() => {
      // Check title and year
      expect(screen.getByText('The Godfather')).toBeInTheDocument();
      expect(screen.getByText('(1972)')).toBeInTheDocument();
      
      // Check genres
      expect(screen.getByText('Crime')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
      
      // Check mood profile labels
      expect(screen.getByText('Dark')).toBeInTheDocument();
    });
  });
});
