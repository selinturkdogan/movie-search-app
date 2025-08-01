import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ query, year, minRating, maxRating, genre, language });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center w-full max-w-4xl space-y-4"
    >
      <input
        type="text"
        placeholder="Film adı..."
        className="w-full p-3 border border-gray-300 rounded-md shadow"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        <input
          type="number"
          placeholder="Yıl"
          className="p-2 border border-gray-300 rounded"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Min Puan"
          className="p-2 border border-gray-300 rounded"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Max Puan"
          className="p-2 border border-gray-300 rounded"
          value={maxRating}
          onChange={(e) => setMaxRating(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tür ID (örn: 28)"
          className="p-2 border border-gray-300 rounded"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dil (örn: en, tr)"
          className="p-2 border border-gray-300 rounded"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="mt-2 px-6 py-3 bg-purple-600 text-white rounded shadow hover:bg-purple-700 transition"
      >
        Ara
      </button>
    </form>
  );
}

export default SearchBar;
