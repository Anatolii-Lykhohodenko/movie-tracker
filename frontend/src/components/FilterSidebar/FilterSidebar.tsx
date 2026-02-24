import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useFilterContext } from '../../contexts/FilterContext';
import { SearchBar } from '../SearchBar';
import './FilterSidebar.css';
import equal from 'fast-deep-equal';
import { defaultFilters } from '../constants/filters';

const GENRES = [
  { id: '28', name: 'Action' },
  { id: '35', name: 'Comedy' },
  { id: '18', name: 'Drama' },
  { id: '14', name: 'Fantasy' },
  { id: '27', name: 'Horror' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Popularity' },
  { value: 'release_date.desc', label: 'Release Date' },
  { value: 'vote_average.desc', label: 'Rating' },
];

const RATINGS = [
  { value: '9', label: '⭐ 9+' },
  { value: '8', label: '⭐ 8+' },
  { value: '7', label: '⭐ 7+' },
  { value: '6', label: '⭐ 6+' },
];

export const FilterSidebar: React.FC = () => {
  const { filters, setFilters, isOpen, toggleSidebar, resetFilters } = useFilterContext();
  const [localFilters, setLocal] = useState(filters);
  const [, setSearchParams] = useSearchParams();

  const isDefaultFilters = useMemo(() => equal(localFilters, defaultFilters), [localFilters]);
  const handleApply = () => {
    if (isDefaultFilters) {
      setSearchParams({});
    } else {
      const preparedFilters = Object.entries(localFilters).reduce((acc, [key, value]) => {
        if (!value) return acc;
        return { ...acc, [`${key}`]: value };
      }, {});
      setSearchParams(preparedFilters);
    }
    setFilters(localFilters);
    toggleSidebar();
  };

  useEffect(() => {
    setLocal(filters);
  }, [isOpen]);

  const handleReset = () => {
    setFilters(defaultFilters);
    setSearchParams({});
    resetFilters();
    toggleSidebar();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      {/* Sidebar */}
      <div className={`filter-sidebar ${isOpen ? 'is-open' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Filters</h2>
          <button className="sidebar-close" onClick={toggleSidebar}>
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="sidebar-body">
          {/* Query */}
          <div className="filter-section">
            <p className="filter-label">Search</p>
            <div className="filter-options">
              <SearchBar
                isShowSearchButton={false}
                setter={query =>
                  setLocal(prev => ({
                    ...prev,
                    query,
                  }))
                }
              />
            </div>
          </div>

          {/* Genre */}
          <div className="filter-section">
            <p className="filter-label">Genre</p>
            <div className="filter-options">
              {GENRES.map(genre => (
                <button
                  key={genre.id}
                  className={`filter-chip ${localFilters.genre === genre.id ? 'is-active' : ''}`}
                  onClick={() =>
                    setLocal(prev => ({
                      ...prev,
                      genre: prev.genre === genre.id ? '' : genre.id,
                    }))
                  }
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort by */}
          <div className="filter-section">
            <p className="filter-label">Sort by</p>
            <div className="filter-options">
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  className={`filter-chip ${localFilters.sortBy === opt.value ? 'is-active' : ''}`}
                  onClick={() => setLocal(prev => ({ ...prev, sortBy: opt.value }))}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <p className="filter-label">Min Rating</p>
            <div className="filter-options">
              {RATINGS.map(r => (
                <button
                  key={r.value}
                  className={`filter-chip ${localFilters.rating === r.value ? 'is-active' : ''}`}
                  onClick={() =>
                    setLocal(prev => ({
                      ...prev,
                      rating: prev.rating === r.value ? '' : r.value,
                    }))
                  }
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="button is-light is-fullwidth" onClick={handleReset}>
            Reset
          </button>
          <button className="button is-primary is-fullwidth" onClick={handleApply}>
            Apply
          </button>
        </div>
      </div>
    </>
  );
};
