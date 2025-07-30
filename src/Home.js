import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './components/SearchBar';

function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('');
  const [searchYear, setSearchYear] = useState('');

  const navigate = useNavigate();

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
        if (data.Error === 'Too many results.') {
          alert('Çok fazla sonuç bulundu. Lütfen daha spesifik arayın.');
        } else {
          alert(data.Error || 'Film bulunamadı.');
        }
      }
    } catch (error) {
      console.error('Hata:', error);
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

  const totalPages = Math.ceil(totalResults / 10);

  return (
  <div className="bg-gradient-to-b from-white to-gray-100 min-h-screen px-4 py-12">
    <div className={`w-full max-w-7xl mx-auto ${movies.length === 0 ? 'flex flex-col items-center justify-center min-h-[80vh]' : ''}`}>
      <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-purple-700 mb-10">
        🎬 Movie Explorer
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-10 w-full">
        <SearchBar onSearch={handleSearch} />
      </div>

      {loading && (
        <div className="flex justify-center my-10">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {movies.map((movie) => (
          <div
            key={movie.imdbID}
            className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => handleMovieClick(movie.imdbID)}
          >
            <img
              src={
                movie.Poster !== 'N/A'
                  ? movie.Poster
                  : 'https://via.placeholder.com/300x450?text=No+Image'
              }
              alt={movie.Title}
              className="w-full h-[360px] object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold truncate">{movie.Title}</h2>
              <p className="text-sm text-gray-600">{movie.Year}</p>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-12 space-x-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition
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
  </div>
);
}

export default Home;
