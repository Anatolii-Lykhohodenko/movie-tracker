import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { getMovieById } from '../../services/tmdbService';
import { useParams } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { MovieCard } from '../MovieCard';

export const MovieDetail: React.FC = () => {
  const { id } = useParams();
  const movieId = Number(id);
  const isValidId = Number.isFinite(movieId) && movieId > 0;
  const { data, isLoading, error } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieById(movieId),
    enabled: isValidId
  });

  if (!isValidId) return <p>Invalid movie id</p>;
  
  if (isLoading) {
    return <Loader />;
  }
  
  if (error) {
    return (
      <div className="notification is-danger">
        <p>Error loading movies: {error.message}</p>
      </div>
    );
  }
  return <> {data ? <MovieCard movie={data} /> : <p>Invalid movie id</p>}</>;
};
