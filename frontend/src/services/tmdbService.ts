import type {
  Credits,
  Filters,
  MovieDetail,
  MovieInfo,
  MovieListItem,
  TMDBResponse,
  VideoResponse,
} from '../types/tmbd';

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const fetchTMDB = async <T>(endpoint: string, params: Record<string, string> = {}, isAdult = false): Promise<T> => {
  const url = new URL(`${BASE_URL}${endpoint}`);

  url.searchParams.append('api_key', API_KEY);
  url.searchParams.append('include_adult', String(isAdult));

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`TMDB API error - ${response.status} ${response.statusText}`);
  }

  return response.json();
};

export const getPopularMovies = ({
  page,
  isAdult,
}: {
  page: string;
  isAdult?: boolean;
}): Promise<TMDBResponse> => {
  return fetchTMDB<TMDBResponse>('/movie/popular', { page }, isAdult);
};

export const getMoviesByQuery = ({
  query,
  page,
  isAdult
}: {
  query: string;
  page: string;
  isAdult?: boolean;
}): Promise<TMDBResponse> => {
  return fetchTMDB<TMDBResponse>('/search/movie', {
    query,
    page,
  }, isAdult);
};

export const getMovieById = (id: number): Promise<MovieListItem> => {
  return fetchTMDB<MovieListItem>(`/movie/${id}`);
};

export const getMovieInfoById = async (id: number, isAdult?: boolean): Promise<MovieInfo> => {
  const [movie, similar, credits, video] = await Promise.all([
    fetchTMDB<MovieDetail>(`/movie/${id}`),
    fetchTMDB<TMDBResponse>(`/movie/${id}/similar`, {}, isAdult),
    fetchTMDB<Credits>(`/movie/${id}/credits`),
    getMovieTrailers(id),
  ]);

  return { movie, similar, credits, video };
};

export const getMoviesWithFilters = ({
  filters,
  page,
  isAdult,
}: {
  filters: Filters;
  page: string;
  isAdult?: boolean;
}): Promise<TMDBResponse> => {
  const preparedFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => {
      if (!value) return acc;

      switch (key as keyof Filters) {
        case 'query':
          return { ...acc, with_text_query: value };
        case 'genre':
          return { ...acc, with_genres: value };
        case 'sortBy':
          return { ...acc, sort_by: value };
        case 'rating':
          return { ...acc, 'vote_average.gte': value, 'vote_count.gte': '100' };
        default:
          return acc;
      }
    },
    {} as Record<string, string>,
  );

  return fetchTMDB<TMDBResponse>(
    '/discover/movie',
    {
      ...preparedFilters,
      page,
    },
    isAdult,
  );
};

export const getMovieTrailers = async (movieId: number) => {
  const data = await fetchTMDB<VideoResponse>(`/movie/${movieId}/videos`);
  return data.results.filter((video) => video.site === 'YouTube' && video.type === 'Trailer');
};
