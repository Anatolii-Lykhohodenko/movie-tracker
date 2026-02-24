import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import './SearchBar.css';

type Props = {
  onSearch?: (value: string) => void;
  setter?: (value: string) => void;
  isShowSearchButton?: boolean;
};

export const SearchBar: React.FC<Props> = ({
  onSearch = () => {},
  isShowSearchButton = true,
  setter = () => {},
}) => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  useEffect(() => {
    setQuery(searchParams.get('query') || '');
  }, [searchParams]);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    onSearch(trimmed);
  };

  return (
    <form className="searchbar-form" onSubmit={handleSubmit}>
      <div className="searchbar-input-wrapper">
        <FaSearch className="searchbar-icon" />
        <input
          className="searchbar-input"
          placeholder="Search movies..."
          value={query}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(e.target.value);
            setter(e.target.value);
          }}
        />
      </div>
      {isShowSearchButton && (
        <button className="searchbar-button" type="submit" disabled={!query}>
          <FaSearch />
          <span>Search</span>
        </button>
      )}
    </form>
  );
};
