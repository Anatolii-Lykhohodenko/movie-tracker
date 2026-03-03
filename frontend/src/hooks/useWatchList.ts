import { useCallback } from 'react';
import api from '../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface UseWatchListReturn {
  watchListMovieIds: number[];
  toggleWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  clearWatchList: () => Promise<void>;
}
export const useWatchList = (): UseWatchListReturn => {
  const queryClient = useQueryClient();

  const { data: watchListMovieIds = [] } = useQuery({
    queryKey: ['watchlist'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/movies/watchlist');
        return data.movieIds as number[];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.error ?? 'Login failed');
        }
        throw err;
      }
    },
  });

  const toggleWatchlist = useCallback(
    async (id: number) => {
      try {
        await api.post(`/movies/${id}/watchlist`);
        queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.error ?? 'Login failed');
        }
        throw err;
      }
    },
    [queryClient],
  );

  const isInWatchlist = (id: number) => watchListMovieIds.includes(id);

  const clearWatchList = useCallback(async () => {
    try {
      await api.delete('/movies/watchlist');
      queryClient.setQueryData(['watchlist'], []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Login failed');
      }
      throw err;
    }
  }, [queryClient]);

  return { watchListMovieIds, toggleWatchlist, isInWatchlist, clearWatchList };
};
