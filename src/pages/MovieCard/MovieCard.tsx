import type React from 'react';
import type { Movie } from '../../types/tmbd';

interface Props {
  movie: Movie
}

export const MovieCard: React.FC<Props> = ({ movie }) => <p>{movie.title}</p>;
