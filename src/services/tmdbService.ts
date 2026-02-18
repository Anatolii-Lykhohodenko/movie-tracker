import type { Credits, MovieDetail, MovieInfo, MovieListItem, TMDBResponse } from '../types/tmbd';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.append('api_key', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API error - ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getPopularMovies = (): Promise<TMDBResponse> => {
  return fetchTMDB<TMDBResponse>('/movie/popular');
};

export const getMoviesByQuery = (query: string): Promise<TMDBResponse> => {
  return fetchTMDB<TMDBResponse>('/search/movie', { query });
};

export const getMovieById = (id: number): Promise<MovieListItem> => {
  return fetchTMDB<MovieListItem>(`/movie/${id}`);
};

export const getMovieInfoById = async (id: number): Promise<MovieInfo> => {
  const [movie, similar, credits] = await Promise.all([
    fetchTMDB<MovieDetail>(`/movie/${id}`),
    fetchTMDB<TMDBResponse>(`/movie/${id}/similar`),
    fetchTMDB<Credits>(`/movie/${id}/credits`),
  ]);

  return { movie, similar, credits };
};