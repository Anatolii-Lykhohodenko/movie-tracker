import { useCallback } from 'react';
import api from '../services/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


interface useFavouritesReturn {
  movieIds: number[];
  toggleFavourites: (id: number) => void;
  isInFavourites: (id: number) => boolean;
  clearList: () => void;
}
export const useFavourites = (): useFavouritesReturn => {
  const queryClient = useQueryClient();

  const { data: movieIds = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/movies/favorites');
        return data.movieIds as number[];
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.error ?? 'Login failed');
        }
        throw err;
      }
    },
  });

  const toggleFavourites = useCallback(
    async (id: number) => {
      try {
        await api.post(`/movies/${id}/favorites`);
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
      } catch (err) {
        if (axios.isAxiosError(err)) {
          throw new Error(err.response?.data?.error ?? 'Login failed');
        }
        throw err;
      }
    },
    [queryClient],
  );

  const isInFavourites = (id: number) => movieIds.includes(id);

  const clearList = useCallback(async () => {
    try {
      await api.delete('/movies/favorites');
      queryClient.setQueryData(['favorites'], []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.error ?? 'Login failed');
      }
      throw err;
    }
  }, [queryClient]);

  return { movieIds, toggleFavourites, isInFavourites, clearList };
};
