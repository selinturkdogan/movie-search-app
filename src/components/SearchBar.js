// src/components/SearchBar.js
import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [filters, setFilters] = useState({
    query: '',
    year: '',
    minRating: '',
    maxRating: '',
    genre: '',
    language: '',
    sortBy: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <input
        type="text"
        name="query"
        placeholder="Film adı"
        value={filters.query}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="year"
        placeholder="Yıl"
        value={filters.year}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="number"
        name="minRating"
        placeholder="Min IMDb"
        value={filters.minRating}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="number"
        name="maxRating"
        placeholder="Max IMDb"
        value={filters.maxRating}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="genre"
        placeholder="Tür ID (örnek: 28)"
        value={filters.genre}
        onChange={handleChange}
        className="border p-2 rounded"
      />
      <input
        type="text"
        name="language"
        placeholder="Dil (örnek: en, tr)"
        value={filters.language}
        onChange={handleChange}
        className="border p-2 rounded"
      />

      <select
        name="sortBy"
        value={filters.sortBy}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Sıralama Seç</option>
        <option value="popularity.desc">En Popüler</option>
        <option value="release_date.desc">En Yeni</option>
        <option value="vote_average.desc">En Yüksek Oy</option>
      </select>

      <button
        type="submit"
        className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
      >
        Ara
      </button>
    </form>
  );
}

export default SearchBar;
