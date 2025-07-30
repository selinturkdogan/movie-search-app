// src/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function MovieDetail() {
  const { imdbID } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMovieDetail = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=5950ce15&i=${imdbID}&plot=full`);
      const data = await response.json();
      if (data.Response === 'True') {
        setMovie(data);
      } else {
        alert('Film bilgisi bulunamadı.');
        navigate('/');
      }
    } catch (error) {
      console.error('Hata:', error);
      alert('Bir hata oluştu.');
      navigate('/');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [imdbID]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
      >
        ← Geri
      </button>

      <div className="flex flex-col md:flex-row gap-10 bg-white shadow-lg rounded-xl overflow-hidden p-6">
        <img
          src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400x600'}
          alt={movie.Title}
          className="w-full md:w-1/3 h-auto rounded-lg"
        />
        <div className="flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{movie.Title}</h2>
            <p className="text-sm text-gray-500 mb-4">{movie.Year} | {movie.Runtime} | {movie.Genre}</p>
            <p className="text-gray-700 mb-4">{movie.Plot}</p>
          </div>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Yönetmen:</strong> {movie.Director}</p>
            <p><strong>Oyuncular:</strong> {movie.Actors}</p>
            <p><strong>IMDb:</strong> ⭐ {movie.imdbRating}</p>
            <p><strong>Ülke:</strong> {movie.Country}</p>
            <p><strong>Yapım:</strong> {movie.Production || 'Bilinmiyor'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
