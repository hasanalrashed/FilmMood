import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import SearchPage from './SearchPage';
import { searchMovies } from '../api';

vi.mock('../api', () => ({
  searchMovies: vi.fn(),
}));

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the search input', () => {
    // 1. Act: Render the SearchPage component wrapped in a Router
    render(<BrowserRouter><SearchPage /></BrowserRouter>);
    
    // 2. Assert: Check that the main title and the search input are visible on screen
    expect(screen.getByPlaceholderText('Search movie name...')).toBeInTheDocument();
    expect(screen.getByText('FilmMood')).toBeInTheDocument();
  });

  it('calls searchMovies and displays results', async () => {
    // 1. Arrange: Setup the mock search API to return "The Godfather"
    vi.mocked(searchMovies).mockResolvedValue([
      { id: 238, title: 'The Godfather', year: '1972', poster_path: null }
    ]);
    
    // 2. Act: Render the page and simulate a user typing into the search box
    render(<BrowserRouter><SearchPage /></BrowserRouter>);
    const input = screen.getByPlaceholderText('Search movie name...');
    fireEvent.change(input, { target: { value: 'godfather' } });
    
    // 3. Assert: Wait for the search debounce/API call to finish and verify the result is shown
    await waitFor(() => {
      expect(screen.getByText('The Godfather')).toBeInTheDocument();
    });
  });
});
