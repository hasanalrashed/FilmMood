import React, { useState } from 'react';
import SearchPage from './components/SearchPage';
import MoviePage from './components/MoviePage';

function App() {
  const [currentMovieId, setCurrentMovieId] = useState<number | null>(null);

  const handleMovieSelect = (id: number) => {
    setCurrentMovieId(id);
    window.history.pushState({}, '', `/movie/${id}`);
  };

  const handleBackToSearch = () => {
    setCurrentMovieId(null);
    window.history.pushState({}, '', '/');
  };

  // Simple client-side routing based on state, could also use URL parsing for real router-less routing
  React.useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/movie/')) {
        const id = parseInt(path.replace('/movie/', ''), 10);
        if (!isNaN(id)) setCurrentMovieId(id);
      } else {
        setCurrentMovieId(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    handlePopState(); // init
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <>
      {currentMovieId ? (
        <MoviePage movieId={currentMovieId} onBack={handleBackToSearch} />
      ) : (
        <SearchPage onMovieSelect={handleMovieSelect} />
      )}
    </>
  );
}

export default App;
