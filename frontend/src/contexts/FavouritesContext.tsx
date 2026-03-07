import React, { useContext } from 'react';
import { useFavourites } from '../hooks/useFavourites';

interface FavouritesContextType {
  movieIds: number[];
  toggleFavourites: (id: number) => void;
  isInFavourites: (id: number) => boolean;
  clearList: () => void;
}

export const FavouritesContext = React.createContext<FavouritesContextType | null>(null);

type Props = {
  children: React.ReactNode;
};
export const FavouritesProvider: React.FC<Props> = ({ children }) => {
  const favouritesState = useFavourites();

  return (
    <FavouritesContext.Provider value={favouritesState}>{children}</FavouritesContext.Provider>
  );
};

export const useFavouritesContext = () => {
  const context = useContext(FavouritesContext);
  if (!context) {
    throw new Error('useFavouritesContext must be used within FavouritesProvider');
  }
  return context;
};