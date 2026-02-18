import type React from 'react';
import { Link } from 'react-router-dom';
// import { MovieList } from '../../components/MovieList';
import { Loader } from '../../components/Loader';
import './WatchlistPage.css';
import { EmptyState } from '../../components/EmplyState';
import { useWatchListContext } from '../../contexts/WatchListContext';
import { useQueries } from '@tanstack/react-query';
import { getMovieById } from '../../services/tmdbService';
import { MovieList } from '../MovieList';

export const WatchlistPage: React.FC = () => {
  const { watchListMovieIds, clearWatchList } = useWatchListContext();
  const movieQueries = useQueries({
    queries: watchListMovieIds.map(movieId => ({
      queryKey: ['movie', movieId],
      queryFn: () => getMovieById(movieId),
    })),
  });
  
  const isLoading = movieQueries.some(q => q.isLoading);
  const movies = movieQueries.filter(q => q.isSuccess).map(q => q.data!);


  // ========== EMPTY STATE ==========
  if (watchListMovieIds.length === 0) {
    return (
      <EmptyState
        icon="fa-heart-broken"
        title="Your watchlist is empty"
        description="Start adding movies you want to watch later!"
        actionLabel="Browse Movies"
        actionLink="/"
      />
    );
  }

  // ========== LOADING STATE ==========
  if (isLoading) {
    return <Loader fullscreen />;
  }

  // ========== MAIN CONTENT ==========
  return (
    <div className="watchlist-page">
      <section className="section watchlist-header">
        <div className="container">
          <div className="level">
            <div className="level-left">
              <div className="level-item">
                <div>
                  <h1 className="title is-2">
                    <span className="icon-text">
                      <span className="icon has-text-danger">
                        <i className="fas fa-heart fa-lg"></i>
                      </span>
                      <span>My Watchlist</span>
                    </span>
                  </h1>
                  <p className="subtitle is-5 has-text-grey-light">
                    {movies.length} {movies.length === 1 ? 'movie' : 'movies'} saved
                  </p>
                </div>
              </div>
            </div>

            <div className="level-right">
              <div className="level-item">
                <div className="buttons">
                  {/* Clear All button */}
                  <button
                    className="button is-outlined is-danger"
                    onClick={() => {
                        clearWatchList();
                    }}
                  >
                    <span className="icon">
                      <i className="fas fa-trash"></i>
                    </span>
                    <span>Clear All</span>
                  </button>

                  <Link to="/" className="button is-primary">
                    <span className="icon">
                      <i className="fas fa-home"></i>
                    </span>
                    <span>Back to Home</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <hr className="watchlist-divider" />
        </div>
      </section>

      {/* Movies Grid */}
      {/* <section className="section watchlist-content">
        <div className="container">
        </div>
      </section> */}
      <MovieList movies={movies} />

      <section className="section watchlist-footer">
        <div className="container has-text-centered">
          <p className="has-text-grey-light">
            <span className="icon">
              <i className="fas fa-info-circle"></i>
            </span>
            <span>Click on a movie to remove it from your watchlist</span>
          </p>
        </div>
      </section>
    </div>
  );
};
