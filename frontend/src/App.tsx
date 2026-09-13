import { Routes, Route } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import MoviePage from './components/MoviePage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/movie/:id" element={<MoviePage />} />
    </Routes>
  );
}

export default App;
