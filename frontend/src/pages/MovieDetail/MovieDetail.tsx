import type React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { getMovieInfoById } from '../../services/tmdbService';
import { Loader } from '../../components/Loader';
import { PLACEHOLDER_POSTER } from '../../components/constants/images';
import { TMDB_IMAGE_SIZES } from '../../components/constants/images';
import { MovieList } from '../MovieList';
import './MovieDetail.css';
import { useWatchListContext } from '../../contexts/WatchListContext';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useFavouritesContext } from '../../contexts/FavouritesContext';
import api from '../../services/api';
import axios from 'axios';

type Review = {
  rating: number;
  comment: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
};

enum SortType {
  Best = 'best',
  Worst = 'worst',
  Latest = 'latest',
}

export const MovieDetail: React.FC = () => {
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [sortType, setSortType] = useState<SortType>(SortType.Latest);
  const { isInWatchlist, toggleWatchlist } = useWatchListContext();
  const { isInFavourites, toggleFavourites } = useFavouritesContext();
  const { user } = useAuthContext();
  const { id } = useParams();
  const movieId = Number(id);
  const isValidId = Number.isFinite(movieId) && movieId > 0;

  const {
    data: movieData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieInfoById(movieId, user?.isAdult),
    enabled: isValidId,
  });

  const { data: reviewData, isLoading: isReviewLoading } = useQuery({
    queryKey: ['reviews', movieId],
    queryFn: () => api.get(`/movies/${movieId}/rate`),
    enabled: isValidId,
  });

  const myReview = reviewData?.data?.ratingData?.ratings.find((review: Review) => {
    return review.user.id === user?.id;
  });

  const [isShowForm, setIsShowForm] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (myReview) {
      setIsShowForm(false);
      setComment(myReview.comment ?? '');
      setRating(myReview.rating ?? 0);
    }
  }, [myReview?.updatedAt]);

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

  if (error || !movieData) {
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

  const sortedReviews = [...(reviewData?.data?.ratingData?.ratings ?? [])].sort(
    (a: Review, b: Review) => {
      if (a.user.id === user?.id) return -1;
      if (b.user.id === user?.id) return 1;

      if (sortType === 'best') return b.rating - a.rating;
      if (sortType === 'worst') return a.rating - b.rating;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    },
  );

  const { movie, similar, credits, video } = movieData;

  if (!movie) return null;

  const handleReviewSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post(`/movies/${movie.id}/rate`, { comment, rating });
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      setIsShowForm(false);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Login failed');
      }
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewDelete = async () => {
    setIsDeleting(true);
    try {
      await api.delete(`/movies/${movie.id}/rate`);
      queryClient.invalidateQueries({ queryKey: ['reviews', movieId] });
      setIsShowForm(true);
      setComment('');
      setRating(0);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Login failed');
      }
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  const backdropUrl = movie.backdrop_path
    ? `${TMDB_IMAGE_SIZES.backdrop.large}${movie.backdrop_path}`
    : null;

  const posterUrl = movie.poster_path
    ? `${TMDB_IMAGE_SIZES.poster.large}${movie.poster_path}`
    : PLACEHOLDER_POSTER;

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';
  const trailerKey = video ? video[0].key : null;

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
            <div className="hero-tags-row mt-4">
              {trailerKey && (
                <button
                  className="button is-warning is-small"
                  onClick={() => setIsTrailerOpen(true)}
                >
                  <span className="icon">
                    <i className="fas fa-play"></i>
                  </span>
                  <span>Watch Trailer</span>
                </button>
              )}
              <div className="tags are-medium mb-0">
                {movie.vote_average > 0 && (
                  <span className="tag is-warning is-light">
                    ⭐ {movie.vote_average.toFixed(1)}
                  </span>
                )}
                {!!movie.runtime && (
                  <span className="tag is-info is-light">⏱️ {movie.runtime} min</span>
                )}
                <span className="tag is-light">📅 {year}</span>
              </div>
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
              <div className="content">
                <h2 className="title is-4">Overview</h2>
                <p className="is-size-6 has-text-justified">
                  {movie.overview || 'No description available.'}
                </p>
              </div>
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
                    {movie.budget && movie.budget > 0 ? (
                      <tr>
                        <td>
                          <strong>Budget</strong>
                        </td>
                        <td>${movie.budget.toLocaleString()}</td>
                      </tr>
                    ) : null}
                    {movie.revenue && movie.revenue > 0 ? (
                      <tr>
                        <td>
                          <strong>Revenue</strong>
                        </td>
                        <td>${movie.revenue.toLocaleString()}</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="watchlist-button-wrapper">
                {movie.homepage && movie.homepage.length > 0 && (
                  <a
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button is-medium is-success"
                  >
                    <span className="icon">
                      <i className="fas fa-eye"></i>
                    </span>
                    <span>Watch</span>
                  </a>
                )}
                {user && (
                  <button
                    className={`button is-medium ${isInWatchlist(movie.id) ? 'is-danger' : 'is-warning'}`}
                    onClick={() => toggleWatchlist(movie.id)}
                    title={isInWatchlist(movie.id) ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  >
                    <span className="icon">
                      <i className="fas fa-bookmark"></i>
                    </span>
                    <span>{isInWatchlist(movie.id) ? 'Watchlist ✓' : 'Watchlist'}</span>
                  </button>
                )}
                {user && (
                  <button
                    className={`button is-medium ${isInFavourites(movie.id) ? 'is-danger' : 'is-primary'}`}
                    onClick={() => toggleFavourites(movie.id)}
                    title={
                      isInFavourites(movie.id) ? 'Remove from Favourites' : 'Add to Favourites'
                    }
                  >
                    <span className="icon">
                      <i className="fas fa-heart"></i>
                    </span>
                    <span>{isInFavourites(movie.id) ? 'Favourite ✓' : 'Favourite'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CAST SECTION ========== */}
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

      {/* ========== REVIEWS SECTION ========== */}
      <section className="section reviews-section">
        <div className="container">
          <div className="reviews-title-row">
            <h2 className="title is-4 mb-0">Reviews</h2>
            {sortedReviews.length > 0 && (
              <div className="buttons reviews-sort-group mb-0">
                {(
                  [
                    [SortType.Latest, '🕐 Latest'],
                    [SortType.Best, '★ Best'],
                    [SortType.Worst, '☆ Worst'],
                  ] as const
                ).map(([val, label]) => (
                  <button
                    key={val}
                    className={`button is-small ${sortType === val ? 'is-primary' : 'is-light'}`}
                    onClick={() => setSortType(val)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {user && isShowForm && !isReviewLoading && (
            <form className="review-form-wrapper" onSubmit={handleReviewSubmit}>
              <h3 className="review-form-heading">Leave a Review</h3>

              {/* Star rating */}
              <div className="star-rating">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(star => (
                  <button
                    key={star}
                    className={`star-btn ${star <= rating ? 'active' : ''}`}
                    type="button"
                    onClick={() => setRating(star)}
                  >
                    <i className="fas fa-star" />
                  </button>
                ))}
                <span className="star-label">{rating} / 10</span>
              </div>

              {/* Comment textarea */}
              <textarea
                className="review-textarea"
                placeholder="Share your thoughts about this movie..."
                rows={4}
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              />

              <button
                className="button is-primary review-submit"
                type="submit"
                disabled={isSubmitting}
              >
                <span className="icon">
                  <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} />
                </span>
                <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </form>
          )}

          {/* Reviews list */}
          <div className="reviews-list">
            {isReviewLoading ? (
              <Loader size="medium" />
            ) : sortedReviews.length > 0 ? (
              sortedReviews.map((review: Review) => {
                const {
                  user: reviewUser,
                  updatedAt,
                  rating: reviewRating,
                  comment: reviewComment,
                } = review;

                const date = new Date(updatedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                });
                return (
                  <div key={`${reviewUser.name}${updatedAt}`} className="review-card">
                    <div className="review-header">
                      <div className="review-avatar">
                        {reviewUser.avatar ? (
                          <img src={review.user.avatar} alt={reviewUser.name} />
                        ) : (
                          reviewUser.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="review-meta">
                        <span className="review-username">{reviewUser.name}</span>
                        <span className="review-date">{date}</span>
                      </div>
                      <div className="review-rating">
                        <span className="review-stars">
                          {'★'.repeat(reviewRating)}
                          {'☆'.repeat(10 - reviewRating)}
                        </span>
                        <span className="review-score">{reviewRating} / 10</span>
                      </div>
                      {Number(reviewUser.id) === Number(user?.id) && (
                        <>
                          <button
                            className={`button is-small edit-review-btn ${isShowForm ? 'is-light' : 'is-warning is-light'}`}
                            onClick={() => setIsShowForm(prev => !prev)}
                            title={isShowForm ? 'Cancel edit' : 'Edit review'}
                          >
                            <span className="icon">
                              <i className={`fas ${isShowForm ? 'fa-times' : 'fa-edit'}`} />
                            </span>
                          </button>
                          <button
                            className="button is-small edit-review-btn is-danger is-light"
                            onClick={handleReviewDelete}
                            disabled={isDeleting}
                            title="Delete review"
                          >
                            <span className="icon">
                              <i
                                className={`fas ${isDeleting ? 'fa-spinner fa-spin' : 'fa-trash'}`}
                              />
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                    <p className="review-comment">{reviewComment}</p>
                  </div>
                );
              })
            ) : (
              <div className="reviews-empty">
                <i className="fas fa-comment-slash reviews-empty-icon" />
                <p className="reviews-empty-text">No reviews yet</p>
                <p className="reviews-empty-sub">Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========== RECOMMENDATIONS SECTION ========== */}
      {similar?.results && similar.results.length > 0 && (
        <section className="section recommendations-section">
          <div className="container">
            <h2 className="title is-4 mb-5 has-text-grey">You might also like</h2>
            <MovieList movies={similar.results} />
          </div>
        </section>
      )}

      {trailerKey && isTrailerOpen && (
        <div className="trailer-overlay" onClick={() => setIsTrailerOpen(false)}>
          <div className="trailer-wrapper">
            <button className="trailer-close" onClick={() => setIsTrailerOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="trailer-modal" onClick={e => e.stopPropagation()}>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                allowFullScreen
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
