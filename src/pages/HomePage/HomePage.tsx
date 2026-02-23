import type React from 'react';
import { useInfiniteQuery, type InfiniteData, type QueryKey } from '@tanstack/react-query';
import { getMoviesWithFilters, getPopularMovies } from '../../services/tmdbService';
import { MovieList } from '../MovieList';
import { Loader } from '../../components/Loader';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type TMDBResponse } from '../../types/tmbd';
import './HomePage.css';
import { useFilterContext } from '../../contexts/FilterContext';
import equal from 'fast-deep-equal';
import { defaultFilters } from '../../components/constants/filters';

export const HomePage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { filters } = useFilterContext();

  const isDefaultFilters = useMemo(() => equal(filters, defaultFilters), [filters]);
  const queryKey = useMemo(
    () => (isDefaultFilters ? 'popular' : JSON.stringify(filters)),
    [filters, isDefaultFilters],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery<TMDBResponse, Error, InfiniteData<TMDBResponse>, QueryKey, number>({
      queryKey: ['movies', queryKey],
      initialPageParam: 1,
      getNextPageParam: (lastPage: TMDBResponse) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      queryFn: ({ pageParam }) =>
        isDefaultFilters
          ? getPopularMovies({ page: pageParam.toString() })
          : getMoviesWithFilters({ filters, page: pageParam.toString() }),
    });

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });


    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener('scroll',  handleScroll)

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


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

  const movies = data?.pages.flatMap(page => page.results) || [];

  return (
    <>
      {movies.length === 0 && !isLoading ? (
        <div className="has-text-centered has-text-grey py-6">
          <p className="is-size-4">🎬 No movies found</p>
          <p className="is-size-6 mt-2">Try adjusting your filters</p>
        </div>
      ) : (
        <MovieList movies={movies} />
      )}

      <div ref={sentinelRef} style={{ height: '1px' }} />

      {isFetchingNextPage && <Loader size="medium" />}

      {!hasNextPage && movies.length > 0 && (
        <p className="has-text-centered has-text-grey py-6">You've reached the end 🎬</p>
      )}

      {showScrollTop && (
        <button
          className="scroll-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <i className="fas fa-arrow-up" />
        </button>
      )}
    </>
  );
};
