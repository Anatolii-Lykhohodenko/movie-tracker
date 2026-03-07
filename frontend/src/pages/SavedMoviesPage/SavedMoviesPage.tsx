import type React from 'react';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import './SavedMoviesPage.css';
import { EmptyState } from '../../components/EmplyState';
import { useWatchListContext } from '../../contexts/WatchListContext';
import { useQueries } from '@tanstack/react-query';
import { getMovieById } from '../../services/tmdbService';
import { MovieList } from '../MovieList';
import { useFavouritesContext } from '../../contexts/FavouritesContext';

type Props = {
  type: 'watchlist' | 'favourites';
};

export const SavedMoviesPage: React.FC<Props> = ({ type }) => {
  const isWatchlist = type === 'watchlist';

  const watchlist = useWatchListContext();
  const favourites = useFavouritesContext();
  const { movieIds, clearList } = isWatchlist ? watchlist : favourites;

  const config = {
    watchlist: {
      title: 'My Watchlist',
      icon: 'fa-bookmark',
      emptyTitle: 'Your watchlist is empty',
      emptyDescription: 'Start adding movies you want to watch later!',
      hint: 'Click on a movie to remove it from your watchlist',
    },
    favourites: {
      title: 'My Favourites',
      icon: 'fa-heart',
      emptyTitle: 'No favourites yet',
      emptyDescription: 'Start adding movies you loved!',
      hint: 'Click on a movie to remove it from your favorites',
    },
  }[type];

  const movieQueries = useQueries({
    queries: movieIds.map(movieId => ({
      queryKey: [type === 'watchlist' ? 'watchListMovie' : 'favouriteMovie', movieId],
      queryFn: () => getMovieById(movieId),
    })),
  });

  const isLoading = movieQueries.some(q => q.isLoading);
  const movies = movieQueries.filter(q => q.isSuccess).map(q => q.data!);

  // ========== LOADING STATE ==========
  if (isLoading) {
    return <Loader fullscreen />;
  }

  // ========== EMPTY STATE ==========
  if (movieIds.length === 0) {
    return (
      <EmptyState
        icon="fa-heart-broken"
        title={config.emptyTitle}
        description={config.emptyDescription}
        actionLabel="Browse Movies"
        actionLink="/"
      />
    );
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
                        <i className={`fas ${config.icon} fa-lg`}></i>
                      </span>
                      <span className="has-text-grey" style={{ paddingLeft: '10px' }}>
                        {config.title}
                      </span>
                    </span>
                  </h1>
                  <p className="subtitle is-5 has-text-grey-dark">
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
                      clearList();
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
            <span>{config.hint}</span>
          </p>
        </div>
      </section>
    </div>
  );
};;
