import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, X } from 'lucide-react';
import { searchMovies } from '../api';
import type { MovieResult } from '../api';
import './SearchPage.css';

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      setIsDropdownOpen(false);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setError(null);
      try {
        const data = await searchMovies(query);
        setResults(data);
        setHasSearched(true);
        setIsDropdownOpen(true);
      } catch (err) {
        setError('TMDB is unavailable right now.');
        setHasSearched(true);
      }
    }, 100);

    return () => clearTimeout(debounceTimeout);
  }, [query]);

  return (
    <>
      <div className="ambient-background">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
      </div>
      <main className="container search-container animate-fade-in">
        <div className="search-header">
          <h1>FilmMood</h1>
          <p>Find out a movie's mood profile.</p>
        </div>

      <div className="search-box-wrapper glass">
        <Search className="search-icon" size={24} color="var(--text-secondary)" />
        <input
          type="search"
          placeholder="Search movie name..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onClick={() => {
            if (query.trim() && results.length > 0) setIsDropdownOpen(true);
          }}
          aria-label="Movie title"
          autoFocus
        />
        {query && (
          <button 
            className="clear-button" 
            onClick={() => {
              setQuery('');
              setResults([]);
              setHasSearched(false);
              setIsDropdownOpen(false);
            }}
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}

      {!error && hasSearched && results.length === 0 && query.trim() !== '' && (
        <p className="no-results-text">No results found for "{query}"</p>
      )}

      {isDropdownOpen && results.length > 0 && (
        <div className="results-dropdown glass animate-fade-in" ref={dropdownRef}>
          {results.map((movie) => (
            <button
              key={movie.id}
              className="result-item"
              onClick={() => navigate(`/movie/${movie.id}`)}
            >
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                  alt={movie.title} 
                  className="result-poster" 
                />
              ) : (
                <Film size={40} className="result-icon-fallback" />
              )}
              <div className="result-info">
                <span className="result-title">{movie.title}</span>
                {movie.year && <span className="result-year">{movie.year}</span>}
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
    </>
  );
}
