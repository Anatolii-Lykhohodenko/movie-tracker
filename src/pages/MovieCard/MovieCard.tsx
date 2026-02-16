import type React from 'react';
import type { Movie } from '../../types/tmbd';
import styles from './MovieCard.module.scss';
import { Link } from 'react-router-dom';
import { PLACEHOLDER_POSTER } from '../../components/constants/images';
const BASE_IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

interface Props {
  movie: Movie;
}

export const MovieCard: React.FC<Props> = ({ movie }) => {
  const imgUrl = movie?.poster_path ? `${BASE_IMAGE_URL}${movie.poster_path}` : PLACEHOLDER_POSTER;
  // const { isAuthenticated } = useAuth();
  // const { isInWishlist, toggleWishlist } = useWishlist();

  // const inWishlist = isInWishlist(movie.id);

  // const handleWishlistClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   // Заглушка: либо внешний колбэк, либо контекст
  //   onAddToWishlist?.(movie.id);
  //   toggleWishlist(movie);
  // };

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
            {/* {isAuthenticated && (
              <button
                type="button"
                className={`button is-small is-rounded ${styles.wishlistButton}`}
                onClick={handleWishlistClick}
                aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-pressed={inWishlist}
              >
                <span className={`icon ${inWishlist ? 'has-text-danger' : 'has-text-grey'}`}>
                  <i className={inWishlist ? 'fas fa-heart' : 'far fa-heart'} />
                </span>
              </button>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );};
