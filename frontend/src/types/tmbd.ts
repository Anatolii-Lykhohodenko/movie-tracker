interface MovieBase {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
}
export interface MovieListItem extends MovieBase {
  genre_ids: number[]
}
export interface MovieDetail extends MovieBase {
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  runtime: number | null;
  tagline: string | null;
  budget?: number;
  revenue?: number;
  homepage: string | null
}

export type Movie = MovieListItem | MovieDetail;
export interface MovieInfo {
  movie: MovieDetail;
  similar?: TMDBResponse;
  credits?: Credits;
  video?: Video[];
};

export function isMovieDetail(movie: Movie): movie is MovieDetail {
  return 'genres' in movie;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}
export interface TMDBResponse {
  page: number;
  results: MovieListItem[];
  total_pages: number;
  total_results: number;
}
export interface Filters {
  query: string;
  genre: string;
  sortBy: string;
  rating: string;
}

export interface VideoResponse {
  id: number;
  results: Video[];
}

export interface Video {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}