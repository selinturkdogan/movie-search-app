// src/pages/Favorites.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const removeFavorite = (imdbID) => {
    const updated = favorites.filter((movie) => movie.imdbID !== imdbID);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const goToDetail = (id) => {
    navigate(`/movie/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white px-4 py-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">💜 Favori Filmler</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-600 text-lg">Henüz favori eklenmedi.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {favorites.map((movie) => (
            <div
              key={movie.imdbID}
              onClick={() => goToDetail(movie.imdbID)}
              className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105 overflow-hidden relative"
            >
              <img
                src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                alt={movie.Title}
                className="w-full h-[360px] object-cover"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFavorite(movie.imdbID);
                }}
                className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-red-100"
                title="Favoriden Kaldır"
              >
                ❌
              </button>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 truncate">{movie.Title}</h2>
                <p className="text-sm text-gray-500">{movie.Year}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
