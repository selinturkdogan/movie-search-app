import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const [rating, setRating] = useState(null);

  useEffect(() => {
    const storedRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    setRating(storedRatings[id]);

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&language=tr-TR`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!movie) return <div className="text-center mt-10">Yükleniyor...</div>;

  const handleBack = () => {
    navigate(location.state?.from || '/', {
      state: { scrollY: location.state?.scrollY || 0 },
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 px-6 py-10">
      <button
        onClick={handleBack}
        className="mb-6 text-purple-600 hover:text-purple-800 transition"
      >
        ← Geri
      </button>

      <div className="max-w-4xl mx-auto bg-purple-50 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={
              movie.poster_path
                ? `${IMG_BASE}${movie.poster_path}`
                : 'https://via.placeholder.com/300x450?text=No+Image'
            }
            alt={movie.title}
            className="w-full md:w-1/3 rounded"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-purple-800 mb-2">{movie.title}</h1>
            <p className="text-sm text-gray-600 mb-4">{movie.release_date}</p>
            <p className="mb-4">{movie.overview}</p>

            <p>
              <span className="font-semibold">IMDb Puanı:</span>{' '}
              {movie.vote_average || 'Yok'}
            </p>
            <p>
              <span className="font-semibold">Dil:</span>{' '}
              {movie.original_language?.toUpperCase() || '-'}
            </p>
            <p className="mt-4">
              <span className="font-semibold">Sizin Oyunuz:</span>{' '}
              {rating === 'like'
                ? '👍 Beğendim'
                : rating === 'dislike'
                ? '👎 Beğenmedim'
                : 'Henüz oy verilmedi'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieDetail;
