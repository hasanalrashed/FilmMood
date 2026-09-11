import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, Star, Film as FilmIcon } from 'lucide-react';
import './MoviePage.css';

interface MovieData {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
  backdrop_path: string | null;
  runtime: number | null;
  genres: string[];
  rating: number | null;
  moods: Record<string, number>;
}

interface MoviePageProps {
  movieId: number;
  onBack: () => void;
}

export default function MoviePage({ movieId, onBack }: MoviePageProps) {
  const [movie, setMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`/api/movie/${movieId}`);
        if (!res.ok) throw new Error('Movie details are unavailable right now.');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMovie(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  if (loading) {
    return (
      <main className="container movie-container animate-fade-in">
        <div className="loading-skeleton"></div>
      </main>
    );
  }

  if (error || !movie) {
    return (
      <main className="container movie-container animate-fade-in">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={20} /> Back to search
        </button>
        <h1>Movie unavailable</h1>
        <p>{error}</p>
      </main>
    );
  }

  const getMoodVariable = (moodName: string) => {
    const normalized = moodName.toLowerCase().replace(/ /g, '-');
    return `var(--mood-${normalized})`;
  };

  return (
    <>
      {movie.backdrop_path && (
        <div 
          className="movie-backdrop" 
          style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
        ></div>
      )}
      <main className="container movie-container animate-fade-in">
        <button className="back-button glass" onClick={onBack}>
          <ArrowLeft size={20} /> Back to search
        </button>

      <div className="movie-content">
        {movie.poster_path ? (
          <div className="poster-container">
            <img
              className="movie-poster shadow-lg"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster for ${movie.title}`}
            />
          </div>
        ) : (
          <div className="poster-placeholder glass shadow-lg">
            <FilmIcon size={64} color="var(--text-secondary)" />
          </div>
        )}

        <section className="movie-details">
          <h1>
            {movie.title}
            {movie.year && <span className="movie-year">({movie.year})</span>}
          </h1>

          <div className="movie-meta">
            {movie.runtime && (
              <span className="meta-item">
                <Clock size={16} /> {movie.runtime} min
              </span>
            )}
            {movie.rating !== null && (
              <span className="meta-item">
                <Star size={16} color="#FFCC00" /> {movie.rating.toFixed(1)}/10
              </span>
            )}
          </div>

          <div className="movie-genres">
            {movie.genres.length > 0 ? (
              movie.genres.map((genre) => (
                <span key={genre} className="genre-tag glass">
                  {genre}
                </span>
              ))
            ) : (
              <span className="genre-tag glass">Unknown Genre</span>
            )}
          </div>

          <div className="mood-section">
            <h2>Mood profile</h2>
            <div className="mood-list">
              {Object.entries(movie.moods).map(([mood, score]) => (
                <div key={mood} className="mood-row">
                  <div className="mood-label">
                    <span>{mood}</span>
                    <span className="mood-score-text">{score.toFixed(2)}</span>
                  </div>
                  <div className="mood-exact-track">
                    <div
                      className="mood-exact-fill"
                      style={{
                        width: `${score * 100}%`,
                        background: getMoodVariable(mood),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
