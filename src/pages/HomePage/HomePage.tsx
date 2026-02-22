import type React from 'react';
import { SearchBar } from '../../components/SearchBar';
import { useInfiniteQuery, type InfiniteData, type QueryKey } from '@tanstack/react-query';
import { getMoviesByQuery, getPopularMovies } from '../../services/tmdbService';
import { MovieList } from '../MovieList';
import { useSearchParams } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { useEffect, useRef, useState } from 'react';
import { type TMDBResponse } from '../../types/tmbd';
import './HomePage.css';

export const HomePage: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useInfiniteQuery<TMDBResponse, Error, InfiniteData<TMDBResponse>, QueryKey, number>({
      queryKey: ['movies', queryParam || 'popular'],
      initialPageParam: 1,
      getNextPageParam: (lastPage: TMDBResponse) =>
        lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
      queryFn: ({ pageParam }) =>
        queryParam
          ? getMoviesByQuery({ query: queryParam, page: pageParam.toString() })
          : getPopularMovies({ page: pageParam.toString() }),
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

  const handleSearchQuery = (query: string) => {
    if (query) {
      setSearchParams({ query });
    } else {
      setSearchParams({});
    }
  };

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
      <SearchBar onSearch={handleSearchQuery} />
      <MovieList movies={movies} />

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
