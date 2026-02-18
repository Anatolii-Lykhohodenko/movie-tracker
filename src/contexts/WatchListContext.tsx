import React, { useContext } from 'react';
import { useWatchList } from '../hooks/useWatchList';

interface WatchlistContextType {
  watchListMovieIds: number[];
  toggleWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  clearWatchList: () => void;
}

export const WatchListContext = React.createContext<WatchlistContextType | null>(null);

type Props = {
  children: React.ReactNode;
};
export const WatchListProvider: React.FC<Props> = ({ children }) => {
  const watchlistState = useWatchList();

  return <WatchListContext.Provider value={watchlistState}>{children}</WatchListContext.Provider>;
};

export const useWatchListContext = () => {
  const context = useContext(WatchListContext);
  if (!context) {
    throw new Error('useWatchListContext must be used within WatchListProvider');
  }
  return context;
};