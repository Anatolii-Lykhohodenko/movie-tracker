import { Request, Response } from 'express';
import prisma from '../prisma';
import { ratingSchema } from '../schemas/movie.schema';
import { Prisma } from '@prisma/client';

export const getWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    const watchlistMovies = await prisma.userMovie.findMany({
      select: { movieId: true },
      where: { userId, inWatchlist: true },
    });

    const movieIds = watchlistMovies.map(m => m.movieId);
    return res.status(200).json({ movieIds });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const clearWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    await prisma.userMovie.updateMany({
      where: { userId, inWatchlist: true },
      data: { inWatchlist: false },
    });

    return res.status(200).json({ message: 'WatchList cleared successfully' });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const toggleWatchlist = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const movieId = Number(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }
    const current = await prisma.userMovie.findUnique({
      where: { userId_movieId: { movieId, userId } },
    });

    const { id } = await prisma.userMovie.upsert({
      where: { userId_movieId: { movieId, userId } },
      update: { inWatchlist: !current?.inWatchlist },
      create: { movieId, userId, inWatchlist: true },
    });

    return res.status(200).json({ id });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;

    const favoriteMovies = await prisma.userMovie.findMany({
      select: { movieId: true },
      where: { userId, inFavorites: true },
    });

    const movieIds = favoriteMovies.map(m => m.movieId);
    return res.status(200).json({ movieIds });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const toggleFavorites = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const movieId = Number(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }
    const current = await prisma.userMovie.findUnique({
      where: { userId_movieId: { movieId, userId } },
    });

    const { id } = await prisma.userMovie.upsert({
      where: { userId_movieId: { movieId, userId } },
      update: { inFavorites: !current?.inFavorites },
      create: { movieId, userId, inFavorites: true },
    });

    return res.status(200).json({ id });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const rateMovie = async (req: Request, res: Response) => {
  try {
    const { userId } = req.user!;
    const movieId = Number(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const result = ratingSchema.safeParse(req.body)!;

    if (!result.success) {
      return res.status(400).json({ error: result.error.issues[0].message });
    }

    const { rating, comment } = result.data;

    const { id } = await prisma.userMovie.upsert({
      where: { userId_movieId: { movieId, userId } },
      update: { rating, comment },
      create: { movieId, userId, rating, comment },
    });

    return res.status(200).json({ id });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const getMovieRate = async (req: Request, res: Response) => {
  try {
    const movieId = Number(req.params.movieId);

    if (isNaN(movieId)) {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const ratings = await prisma.userMovie.findMany({
      where: { movieId, rating: { not: null } },
      select: {
        rating: true,
        comment: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
      },
    });

    const ratingValues = ratings.map(r => r.rating as number);

    const avg = ratingValues.length
      ? +(ratingValues.reduce((acc, cur) => acc + cur, 0) / ratingValues.length).toFixed(1)
      : null;

    const ratingData = {
      averageRating: avg,
      ratings,
    };
    return res.status(200).json({ ratingData });
  } catch (err) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
  }
};

export const getReviewIfExists = async (req: Request, res: Response) => {
    try {
      const { userId } = req.user!;
      const movieId = +req.params.movieId;

      if (isNaN(movieId)) {
        return res.status(400).json({ error: 'Invalid movie ID' });
      }

      const review = await prisma.userMovie.findUnique({
        where: { userId_movieId: { movieId, userId } },
        select: {
          comment: true,
          rating: true,
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      });

      return res.status(200).json({ review });
    } catch (err: unknown) {
    const error = err instanceof Error ? err.message : 'Server error';

    return res.status(500).json({ error });
    }
};
