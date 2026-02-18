import type React from 'react';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_POSTER } from '../../components/constants/images';
import type { Movie } from '../../types/tmbd';
import styles from './MovieCard.module.scss';
import { TMDB_IMAGE_SIZES } from '../../components/constants/images';
import { useWatchListContext } from '../../contexts/WatchListContext';

interface Props {
  movie: Movie;
}

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const { isInWatchlist, toggleWatchlist } = useWatchListContext();
  const imgUrl = movie?.poster_path
    ? `${TMDB_IMAGE_SIZES.poster.large}${movie.poster_path}`
    : PLACEHOLDER_POSTER;
  // const { isAuthenticated } = useAuth();


  return (
    <div
      className="column is-6-mobile is-4-tablet is-3-desktop is-2-widescreen"
      style={{ gap: '1rem', padding: '1rem' }}
    >
      <div
        className={`card ${styles.movieCard}`}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <div className="card-image">
          <figure className={`image is-2by3 ${styles.cardImage}`}>
            <img src={imgUrl} alt={movie.title} style={{ objectFit: 'cover' }} loading="lazy" />
          </figure>
        </div>
        <div className={`card-content ${styles.cardContent}`}>
          <Link to={`/movie/${movie.id}`} className={styles.cardLink}>
            <p className={`title is-4 has-text-weight-semibold mb-2 ${styles.title}`}>
              {movie.title || 'Untitled'}
            </p>
          </Link>

          {movie.overview ? (
            <div
              className={`content is-size-6 mb-2 has-text-grey ${styles.overview}`}
              title={movie.overview}
            >
              {movie.overview}
            </div>
          ) : (
            <div className="content is-size-6 mb-2 has-text-grey-light">
              No description available
            </div>
          )}
          <div className={styles.footer}>
            <div className="is-size-6 has-text-grey-light mb-1">
              <time dateTime={movie?.release_date}>
                {movie.release_date ? movie.release_date.slice(0, 4) : 'TBA'}
              </time>
            </div>
            {movie.vote_average && movie.vote_count > 0 ? (
              <span className="tag">⭐ {movie.vote_average.toFixed(1)}</span>
            ) : (
              <span className="tag">No ratings</span>
            )}
            <div className={styles.cardFooter}>
              <button
                className={`button is-fullwidth ${
                  isInWatchlist(movie.id) ? 'is-danger' : 'is-light'
                }`}
                onClick={e => {
                  e.stopPropagation();
                  toggleWatchlist(movie.id);
                }}
                title={isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <span className="icon">
                  <i className={`fas fa-heart${isInWatchlist(movie.id) ? '' : '-o'}`}></i>
                </span>
                <span className="is-hidden-mobile">
                  {isInWatchlist(movie.id) ? 'In Watchlist' : 'Add to Watchlist'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
