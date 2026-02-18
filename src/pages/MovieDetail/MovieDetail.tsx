import type React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getMovieInfoById } from '../../services/tmdbService';
import { Loader } from '../../components/Loader';
import { PLACEHOLDER_POSTER } from '../../components/constants/images';
import { TMDB_IMAGE_SIZES } from '../../components/constants/images';
import { MovieList } from '../MovieList';
import './MovieDetail.css';
import { useWatchListContext } from '../../contexts/WatchListContext';

export const MovieDetail: React.FC = () => {
  const { isInWatchlist, toggleWatchlist } = useWatchListContext();
  const { id } = useParams();
  const movieId = Number(id);
  const isValidId = Number.isFinite(movieId) && movieId > 0;

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieInfoById(movieId),
    enabled: isValidId,
  });

  if (!isValidId) {
    return (
      <div className="section">
        <div className="container">
          <div className="notification is-warning">
            <p>Invalid movie ID</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <Loader fullscreen />;

  if (error || !data) {
    return (
      <div className="section">
        <div className="container">
          <div className="notification is-danger">
            <p>Error loading movie: {error?.message}</p>
          </div>
        </div>
      </div>
    );
  }

  const { movie, similar, credits } = data;

  if (!movie) return null;

  const backdropUrl = movie.backdrop_path 
    ? `${TMDB_IMAGE_SIZES.backdrop.large}${movie.backdrop_path}` 
    : null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_SIZES.poster.large}${movie.poster_path}`
    : PLACEHOLDER_POSTER;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  return (
    <div className="movie-detail-page">
      {/* ========== HERO SECTION ========== */}
      <section
        className="hero is-large movie-hero"
        style={{
          backgroundImage: backdropUrl ? `url(${backdropUrl})` : 'none',
          backgroundColor: backdropUrl ? 'transparent' : '#363636',
        }}
      >
        <div className="hero-overlay"></div>

        <div className="hero-body">
          <div className="container">
            <Link to="/" className="button is-light mb-4">
              <span className="icon">
                <i className="fas fa-arrow-left"></i>
              </span>
              <span>Back</span>
            </Link>

            <h1 className="title is-1 has-text-white">{movie.title}</h1>

            {movie.tagline && <p className="subtitle is-4 has-text-white-ter">"{movie.tagline}"</p>}

            <div className="tags are-medium mt-4">
              {movie.vote_average > 0 && (
                <span className="tag is-warning is-light">⭐ {movie.vote_average.toFixed(1)}</span>
              )}

              {movie.runtime && (
                <span className="tag is-info is-light">⏱️ {movie.runtime} min</span>
              )}

              <span className="tag is-light">📅 {year}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTENT SECTION ========== */}
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third-desktop is-half-tablet">
              <figure className="image movie-poster">
                <img src={posterUrl} alt={movie.title} style={{ borderRadius: '8px' }} />
              </figure>
            </div>

            <div className="column">
              {/* Overview */}
              <div className="content">
                <h2 className="title is-4">Overview</h2>
                <p className="is-size-6 has-text-justified">
                  {movie.overview || 'No description available.'}
                </p>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="mt-5">
                  <h3 className="title is-5">Genres</h3>
                  <div className="tags">
                    {movie.genres.map(genre => (
                      <span key={genre.id} className="tag is-info is-medium">
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Details Table */}
              <div className="mt-5">
                <h3 className="title is-5">Details</h3>
                <table className="table is-striped is-fullwidth">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Release Date</strong>
                      </td>
                      <td>{movie.release_date || 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Runtime</strong>
                      </td>
                      <td>{movie.runtime ? `${movie.runtime} minutes` : 'N/A'}</td>
                    </tr>
                    <tr>
                      <td>
                        <strong>Rating</strong>
                      </td>
                      <td>
                        {movie.vote_average > 0
                          ? `⭐ ${movie.vote_average.toFixed(1)} / 10`
                          : 'Not rated yet'}
                      </td>
                    </tr>
                    {movie.budget && movie.budget > 0 && (
                      <tr>
                        <td>
                          <strong>Budget</strong>
                        </td>
                        <td>${movie.budget.toLocaleString()}</td>
                      </tr>
                    )}
                    {movie.revenue && movie.revenue > 0 && (
                      <tr>
                        <td>
                          <strong>Revenue</strong>
                        </td>
                        <td>${movie.revenue.toLocaleString()}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Watchlist Button */}
              <div className="mt-5">
                <button
                  className={`button is-large ${
                    isInWatchlist(movie.id) ? 'is-danger' : 'is-primary'
                  }`}
                  onClick={() => toggleWatchlist(movie.id)}
                >
                  <span className="icon">
                    <i className={`fas fa-heart${isInWatchlist(movie.id) ? '' : '-o'}`}></i>
                  </span>
                  <span>
                    {isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CAST SECTION (ОТДЕЛЬНАЯ!) ========== */}
      {credits && credits.cast && credits.cast.length > 0 && (
        <section className="section cast-full-section">
          <div className="container">
            <h3 className="title is-5">Cast</h3>
            <div className="cast-scroll-container">
              {credits.cast.slice(0, 10).map(actor => {
                const avatarUrl = actor.profile_path
                  ? `${TMDB_IMAGE_SIZES.poster.small}${actor.profile_path}`
                  : null;

                return (
                  <div key={actor.id} className="cast-card">
                    {avatarUrl ? (
                      <div className="cast-avatar">
                        <img src={avatarUrl} alt={actor.name} loading="lazy" />
                      </div>
                    ) : (
                      <div className="cast-avatar-fallback">
                        {actor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="cast-info">
                      <div className="cast-name" title={actor.name}>
                        {actor.name}
                      </div>
                      <div className="cast-character" title={actor.character}>
                        {actor.character}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
      {/* ========== RECOMMENDATIONS SECTION ========== */}
      {similar?.results && similar.results.length > 0 && (
        <section className="section recommendations-section">
          <div className="container">
            <h2 className="title is-4 mb-5 has-text-black">You might also like</h2>
            <MovieList movies={similar.results} />
          </div>
        </section>
      )}
    </div>
  );
};
