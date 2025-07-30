// src/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetail() {
  const { imdbID } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?apikey=5950ce15&i=${imdbID}&plot=full`);
        const data = await response.json();
        setMovie(data);
      } catch (error) {
        console.error('Hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [imdbID]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!movie || movie.Response === 'False') {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
        Film bilgisi bulunamadı.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white p-6 md:p-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-purple-700 hover:underline"
      >
        ← Geri
      </button>

      <div className="flex flex-col lg:flex-row gap-10 bg-white shadow-lg rounded-xl p-6">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
          alt={movie.Title}
          className="w-full max-w-xs rounded-xl object-cover shadow-md"
        />

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-purple-800">{movie.Title}</h1>
          <p className="text-gray-600">{movie.Year} • {movie.Runtime} • {movie.Genre}</p>

          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Yönetmen:</strong> {movie.Director}</p>
            <p><strong>Oyuncular:</strong> {movie.Actors}</p>
            <p><strong>IMDb Puanı:</strong> ⭐ {movie.imdbRating}</p>
            <p><strong>Ülke:</strong> {movie.Country}</p>
            <p><strong>Özet:</strong> {movie.Plot}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
