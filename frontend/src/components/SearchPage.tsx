import { useState, useEffect } from 'react';
import { Search, Film } from 'lucide-react';
import './SearchPage.css';

interface MovieResult {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
}

interface SearchPageProps {
  onMovieSelect: (id: number) => void;
}

export default function SearchPage({ onMovieSelect }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const debounceTimeout = setTimeout(async () => {
      setError(null);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setResults(data);
      } catch (err) {
        setError('TMDB is unavailable right now.');
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
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Movie title"
          autoFocus
        />
      </div>

      {error && <p className="error-text">{error}</p>}

      {results.length > 0 && (
        <div className="results-dropdown glass animate-fade-in">
          {results.map((movie) => (
            <button
              key={movie.id}
              className="result-item"
              onClick={() => onMovieSelect(movie.id)}
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
