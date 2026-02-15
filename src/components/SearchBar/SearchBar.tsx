import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';


type Props = {
  onSearch: (value: string) => void;
};

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={query} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
      }} />
      <button type="submit" disabled={!query}>
        <FaSearch />
        Search
      </button>
    </form>
  );
};
