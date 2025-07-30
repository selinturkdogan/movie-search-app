// src/components/SearchBar.js
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim(), type, year);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col md:flex-row items-center gap-4 justify-center"
    >
      <input
        type="text"
        placeholder="Film veya dizi adı..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300 w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">Tüm Türler</option>
        <option value="movie">Film</option>
        <option value="series">Dizi</option>
        <option value="episode">Bölüm</option>
      </select>

      <input
        type="number"
        placeholder="Yıl"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        className="px-4 py-2 rounded-md border border-gray-300 w-28 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        type="submit"
        className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
      >
        🔍 Ara
      </button>
    </form>
  );
}

export default SearchBar;
