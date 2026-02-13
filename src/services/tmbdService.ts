import type { Movie, TMDBResponse } from "../types/tmbd";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;


const fetchTMDB = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);

  if (!response.ok) {
    throw new Error(
      `TMBD API error occured - ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export const getPopularMovies = () : Promise<TMDBResponse> => {
  return fetchTMDB('/movie/popular');
};

export const getMoviesByQuery = (query: string) : Promise<TMDBResponse> => {
  return fetchTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
}

export const getMovieById = (ID: number) : Promise<Movie> => {
  return fetchTMDB(`/movie/${ID}`);
}