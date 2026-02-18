import { useCallback, useState } from 'react';

interface UseWatchListReturn {
  watchListMovieIds: number[];
  toggleWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  clearWatchList: () => void;
}
export const useWatchList = (): UseWatchListReturn => {
  const [watchListMovieIds, setWatchListMovieIds] = useState<number[]>(getNormalizeMovieIds());

  const toggleWatchlist = useCallback((id: number) => {
    setWatchListMovieIds(prev => {
      const newList = prev.includes(id) ? prev.filter(movieId => movieId !== id) : [...prev, id];

      localStorage.setItem('watchlist', JSON.stringify(newList));
      return newList;
    });
  }, []);

  const isInWatchlist = (id: number) => {
    return watchListMovieIds.includes(id);
  };

  const clearWatchList = () => {
    setWatchListMovieIds([]);
    localStorage.setItem('watchlist', JSON.stringify([]));
  };

  return { watchListMovieIds, toggleWatchlist, isInWatchlist, clearWatchList };
};

const getNormalizeMovieIds = (): number[] => {
  try {
    const saved = localStorage.getItem('watchlist');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse watchlist:', error);
    return [];
  }
};
