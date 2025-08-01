// src/components/Navbar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ onToggleFavorites }) {
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <nav className="flex justify-center gap-8 py-4 bg-purple-100 text-purple-800 font-semibold text-lg shadow">
      <Link to="/" className="hover:underline">🎬 Anasayfa</Link>

      {isHome ? (
        <button
          onClick={onToggleFavorites}
          className="hover:underline focus:outline-none"
        >
          ⭐ Favoriler
        </button>
      ) : (
        <Link to="/favorites" className="hover:underline">⭐ Favoriler</Link>
      )}
    </nav>
  );
}

export default Navbar;
