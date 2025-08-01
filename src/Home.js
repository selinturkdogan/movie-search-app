import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import Navbar from './components/Navbar';
import { toast } from 'react-toastify';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

function Home() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState({
    query: '',
    year: '',
    minRating: '',
    maxRating: '',
    genre: '',
    language: '',
  });

  const navigate = useNavigate();
  const location = useLocation();
  const movieListRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (
      filters.query ||
      filters.genre ||
      filters.minRating ||
      filters.maxRating ||
      filters.language ||
      filters.year
    ) {
      fetchMovies(page);
    }
  }, [filters, page]);

  // 💡 Geri dönünce scroll konumuna dön
  useEffect(() => {
  if (location.state?.scrollY !== undefined) {
    setTimeout(() => {
      window.scrollTo(0, location.state.scrollY);
    }, 100);
  }
}, []);


  const fetchMovies = async (pageNum = 1) => {
    setLoading(true);
    try {
      let url;
      if (filters.query) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=tr-TR&query=${encodeURIComponent(
          filters.query
        )}&page=${pageNum}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=tr-TR&page=${pageNum}`;
        if (filters.year) url += `&primary_release_year=${filters.year}`;
        if (filters.genre) url += `&with_genres=${filters.genre}`;
        if (filters.language) url += `&with_original_language=${filters.language}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (data.results) {
        let filtered = data.results;

        if (filters.minRating)
          filtered = filtered.filter((m) => m.vote_average >= Number(filters.minRating));
        if (filters.maxRating)
          filtered = filtered.filter((m) => m.vote_average <= Number(filters.maxRating));
        if (filters.language)
          filtered = filtered.filter((m) => m.original_language === filters.language);
        if (filters.year)
          filtered = filtered.filter((m) =>
            (m.release_date || '').startsWith(filters.year)
          );

        setMovies(filtered);
        setTotalResults(data.total_results);
      } else {
        setMovies([]);
        toast.warn('Film bulunamadı.');
      }
    } catch (err) {
      toast.error('Veriler alınamadı.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newFilters) => {
    setPage(1);
    setFilters(newFilters);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const toggleFavorite = (movie) => {
    const isFav = favorites.some((fav) => fav.id === movie.id);
    let updated;

    if (isFav) {
      updated = favorites.filter((fav) => fav.id !== movie.id);
      toast.info('Favorilerden kaldırıldı');
    } else {
      updated = [...favorites, movie];
      toast.success('Favorilere eklendi!');
    }

    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const totalPages = Math.ceil(totalResults / 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex flex-col items-center px-4 py-6">
      <Navbar onToggleFavorites={() => setShowFavorites(!showFavorites)} />

      <div className="flex flex-col items-center justify-center w-full max-w-screen-xl flex-1">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-purple-700 mb-6">
          🎬 Film Search App
        </h1>

        <SearchBar onSearch={handleSearch} />

        {loading && !showFavorites && (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        )}

        {!showFavorites && (
          <div
            ref={movieListRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10"
          >
            {movies.map((movie) => (
              <div
                key={movie.id}
                onClick={() =>
                  navigate(`/movie/${movie.id}`, {
                    state: {
                      fromDetail: true,
                      from: location.pathname + location.search,
                      scrollY: window.scrollY, // 🟡 scroll konumunu gönder
                    },
                  })
                }
                className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition-transform transform hover:scale-105 overflow-hidden relative"
              >
                <img
                  src={
                    movie.poster_path
                      ? `${IMG_BASE}${movie.poster_path}`
                      : 'https://via.placeholder.com/300x450?text=No+Image'
                  }
                  alt={movie.title}
                  className="w-full h-[360px] object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(movie);
                  }}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-purple-100"
                >
                  {favorites.some((fav) => fav.id === movie.id) ? '💜' : '🤍'}
                </button>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">
                    {movie.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {(movie.release_date || '').slice(0, 4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showFavorites && totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2 flex-wrap">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition ${
                  page === i + 1
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-100'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {showFavorites && (
        <>
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 px-6 py-4 max-h-[60vh] overflow-y-auto z-40">
            {favorites.length === 0 ? (
              <p className="text-gray-500">Henüz favori film yok.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.id}
                    className="bg-purple-100 rounded shadow p-2 text-center relative cursor-pointer group"
                    onClick={() =>
                      navigate(`/movie/${fav.id}`, {
                        state: {
                          fromDetail: true,
                          from: location.pathname + location.search,
                          scrollY: window.scrollY, // 🔁 burada da
                        },
                      })
                    }
                  >
                    <img
                      src={
                        fav.poster_path
                          ? `${IMG_BASE}${fav.poster_path}`
                          : 'https://via.placeholder.com/300x450?text=No+Image'
                      }
                      alt={fav.title}
                      className="w-full h-[200px] object-cover rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = favorites.filter((m) => m.id !== fav.id);
                        setFavorites(updated);
                        localStorage.setItem('favorites', JSON.stringify(updated));
                        toast.info('Favorilerden kaldırıldı');
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1 text-red-500 hover:text-red-700 hover:bg-red-100 transition"
                      title="Favorilerden kaldır"
                    >
                      ❌
                    </button>
                    <h3 className="text-sm font-medium mt-2 truncate">{fav.title}</h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowFavorites(false)}
            className="fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700 z-50"
          >
            Cancel
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
