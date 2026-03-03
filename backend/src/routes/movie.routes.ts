import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { clearWatchlist, getFavorites, getMovieRate, getWatchlist, rateMovie, toggleFavorites, toggleWatchlist } from '../controllers/movie.controller';
const router = Router();

router.use(authMiddleware);

router.get('/watchlist', getWatchlist);
router.delete('/watchlist', clearWatchlist);
router.get('/favorites', getFavorites);
router.post('/:movieId/watchlist', toggleWatchlist);
router.post('/:movieId/favorites', toggleFavorites);
router.post('/:movieId/rate', rateMovie);
router.get('/:movieId/rate', getMovieRate);

export default router;
