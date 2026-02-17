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
}

export type Movie = MovieListItem | MovieDetail;
export interface MovieInfo {
  movie: MovieDetail;
  recommendations?: TMDBResponse;
  credits?: Credits;
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
