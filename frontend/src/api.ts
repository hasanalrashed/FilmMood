export interface MovieResult {
  id: number;
  title: string;
  year: string;
  poster_path: string | null;
}

export interface MovieData {
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

export const searchMovies = async (query: string): Promise<MovieResult[]> => {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
};

export const getMovie = async (id: number): Promise<MovieData> => {
  const res = await fetch(`/api/movie/${id}`);
  if (!res.ok) throw new Error('Movie details are unavailable right now.');
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data;
};
