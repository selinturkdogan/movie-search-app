// src/pages/MovieDetail.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState('');
  const [loading, setLoading] = useState(true);

  const apiKey = process.env.REACT_APP_TMDB_API_KEY;

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&language=tr-TR`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error('Film verisi alınamadı:', err);
      }
    };

    const fetchTrailer = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}&language=en-US`
        );
        const data = await res.json();
        const trailer = data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (err) {
        console.error('Fragman alınamadı:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
    fetchTrailer();
  }, [id, apiKey]);

  const handleGoBack = () => {
  navigate(location.state?.from || '/', {
    state: {
      scrollY: location.state?.scrollY || 0, // scrollY'yi tekrar geçiyoruz
    },
  });
};


  if (loading || !movie) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white px-4 py-6 md:px-12">
      <button
        onClick={handleGoBack}
        className="mb-6 text-purple-700 hover:underline"
      >
        ← Geri
      </button>

      <div className="flex flex-col lg:flex-row gap-10 bg-white shadow-lg rounded-xl p-6">
        <div className="flex justify-center lg:justify-start">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'
            }
            alt={movie.title}
            className="w-[280px] max-w-full h-auto rounded-xl object-cover shadow-md"
          />
        </div>

        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-purple-800">{movie.title}</h1>
          <p className="text-gray-600">
            {movie.release_date} • {movie.runtime} dk •{' '}
            {movie.genres.map((g) => g.name).join(', ')}
          </p>

          <div className="text-sm text-gray-700 space-y-2">
            <p><strong>Orijinal Ad:</strong> {movie.original_title}</p>
            <p><strong>Dil:</strong> {movie.original_language.toUpperCase()}</p>
            <p><strong>Oy:</strong> ⭐ {movie.vote_average}</p>
            <p><strong>Oy Sayısı:</strong> {movie.vote_count}</p>
            <p><strong>Ülke:</strong> {movie.production_countries?.map(c => c.name).join(', ')}</p>
            <p><strong>Özet:</strong> {movie.overview || 'Açıklama bulunamadı.'}</p>
          </div>

          {trailerKey && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-2">Fragman</h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="Fragman"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
