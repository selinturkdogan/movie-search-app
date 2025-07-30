import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';
import Navbar from './components/Navbar';
import { toast } from 'react-toastify';

function Home() {
  const [movies, setMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchYear, setSearchYear] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const fetchMovies = async (query, type = '', year = '', pageNum = 1) => {
    setLoading(true);
    let url = `https://www.omdbapi.com/?apikey=5950ce15&s=${encodeURIComponent(query)}&page=${pageNum}`;
    if (type) url += `&type=${type}`;
    if (year) url += `&y=${year}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.Response === 'True') {
        setMovies(data.Search);
        setTotalResults(parseInt(data.totalResults));
      } else {
        setMovies([]);
        setTotalResults(0);
        alert(data.Error || 'Film bulunamadı.');
      }
    } catch (error) {
      alert('Bir hata oluştu.');
    }

    setLoading(false);
  };

  const handleSearch = (query, type, year) => {
    setSearchTerm(query);
    setSearchType(type);
    setSearchYear(year);
    setPage(1);
    fetchMovies(query, type, year, 1);
  };

  const handleMovieClick = (imdbID) => {
    navigate(`/movie/${imdbID}`);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchMovies(searchTerm, searchType, searchYear, newPage);
  };

  const toggleFavorite = (movie) => {
    const isFav = favorites.some(fav => fav.imdbID === movie.imdbID);
    let updated;

    if (isFav) {
      updated = favorites.filter(fav => fav.imdbID !== movie.imdbID);
      toast.info("Favorilerden kaldırıldı");
    } else {
      updated = [...favorites, movie];
      toast.success("Favorilere eklendi!");
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const totalPages = Math.ceil(totalResults / 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex flex-col items-center px-4 py-6">
      <Navbar onToggleFavorites={() => setShowFavorites(!showFavorites)} />

        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-gradient-to-br from-purple-100 to-white">
  <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-purple-700 mb-6">
    🎬 Film Arama Uygulaması
  </h1>

        <SearchBar onSearch={handleSearch} />

        {loading && !showFavorites && (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
          </div>
        )}

        {!showFavorites && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-10">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                onClick={() => handleMovieClick(movie.imdbID)}
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
                    toggleFavorite(movie);
                  }}
                  className="absolute top-2 right-2 bg-white p-1 rounded-full shadow hover:bg-purple-100"
                >
                  {favorites.some(fav => fav.imdbID === movie.imdbID) ? '💜' : '🤍'}
                </button>
                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-800 truncate">{movie.Title}</h2>
                  <p className="text-sm text-gray-500">{movie.Year}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!showFavorites && totalPages > 1 && (
          <div className="flex justify-center mt-12 space-x-2 flex-wrap">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-md text-sm font-medium border transition
                  ${page === i + 1
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
                    key={fav.imdbID}
                    className="bg-purple-100 rounded shadow p-2 text-center relative cursor-pointer group"
                    onClick={() => navigate(`/movie/${fav.imdbID}`)}
                  >
                    <img
                      src={fav.Poster !== 'N/A' ? fav.Poster : 'https://via.placeholder.com/300x450?text=No+Image'}
                      alt={fav.Title}
                      className="w-full h-[200px] object-cover rounded"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = favorites.filter((m) => m.imdbID !== fav.imdbID);
                        setFavorites(updated);
                        localStorage.setItem('favorites', JSON.stringify(updated));
                        toast.info('Favorilerden kaldırıldı');
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full shadow p-1 text-red-500 hover:text-red-700 hover:bg-red-100 transition"
                      title="Favorilerden kaldır"
                    >
                      ❌
                    </button>
                    <h3 className="text-sm font-medium mt-2 truncate">{fav.Title}</h3>
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
