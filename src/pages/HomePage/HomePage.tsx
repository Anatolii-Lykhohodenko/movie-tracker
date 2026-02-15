import type React from 'react';
import { SearchBar } from '../../components/SearchBar';
import { useQuery } from '@tanstack/react-query';
import { getMoviesByQuery, getPopularMovies } from '../../services/tmdbService';
import { MovieList } from '../MovieList';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '../../components/Loader';

export const HomePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const { data, isLoading, error } = useQuery({
    queryKey: ['movies', queryParam || 'popular'],
    queryFn: () => (queryParam ? getMoviesByQuery(queryParam) : getPopularMovies()),
  });


  const handleSearchQuery = (query: string) => {
    if (query) {
      setSearchParams({ query })
    } else {
      setSearchParams({})
    }
  }

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

  return (
    <>
      <p>HomePage</p>
      <SearchBar onSearch={handleSearchQuery} />
      <MovieList movies={data?.results || []} />
    </>
  );
}; 

