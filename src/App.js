// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import MovieDetail from './MovieDetail';
import Favorites from './pages/Favorites';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        {/* Navigasyon Bar */}


        {/* Sayfa Rotaları */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:imdbID" element={<MovieDetail />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>

        {/* Bildirimler için Toast Container */}
        <ToastContainer
  position="top-right"
  autoClose={2000}
  hideProgressBar
  closeOnClick
  pauseOnHover
  theme="light"
  toastClassName="bg-purple-100 text-purple-900 rounded-lg shadow font-medium"
/>

      </div>
    </Router>
  );
}

export default App;
