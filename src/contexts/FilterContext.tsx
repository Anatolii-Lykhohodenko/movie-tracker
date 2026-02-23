import React, { createContext, useContext, useState } from 'react';
import type { Filters } from '../types/tmbd';
import { defaultFilters } from '../components/constants/filters';

interface FilterContextType {
  filters: Filters;
  setFilters: (filters: Filters) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | null>(null);

type Props = {
  children: React.ReactNode;
};

export const FilterProvider: React.FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const state = {
    isOpen,
    filters,
    setFilters,
    toggleSidebar: () => setIsOpen(isOpen => !isOpen),
    resetFilters: () => setFilters(defaultFilters),
  };


  return <FilterContext.Provider value={state}>{children}</FilterContext.Provider>;
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error('useFilterContext must be used within FilterProvider');
  }

  return context;
};
