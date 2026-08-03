import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { BsMoonStarsFill } from 'react-icons/bs';
import { IoChevronDown } from 'react-icons/io5';
import logo from '@/assets/logo_main.svg';

import { useFavorites } from '@/context/FavoritesContext';
import './Navbar.css';

function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const { newFavoritesCount } = useFavorites();
  const count = newFavoritesCount;

  return (
    <nav className="navbar">
      <div className="navbar__left">
        <Link to="/" className="navbar__logo-link" aria-label="EchoVault home">
          <span className="navbar__logo-icon">
            <img src={logo} alt="EchoVault logo" className="navbar__logo" />
          </span>
        </Link>
      </div>

      <div className="navbar__center">
        <Link to="/" className="navbar__brand-link">
          EchoVault
        </Link>
      </div>

      <div className="navbar__right">
        <button
          type="button"
          className={`navbar__theme-toggle${isDark ? ' navbar__theme-toggle--dark' : ''}`}
          onClick={() => setIsDark((p) => !p)}
          aria-label="Toggle theme"
          aria-pressed={isDark}
        >
          <BsMoonStarsFill className="navbar__theme-icon" aria-hidden="true" />
          <IoChevronDown className="navbar__chevron-icon" aria-hidden="true" />
        </button>

        <Link
        to="/favorites"
        className="navbar__icon-button"
        aria-label={`View favorites${count > 0 ? ` (${count})` : ''}`}
      >
        <span className="navbar__heart-wrapper">
          <FaHeart
            className={`navbar__heart${count > 0 ? ' navbar__heart--active' : ''}`}
          />

          {count > 0 && (
            <span className="navbar__badge">
              {count > 99 ? '99+' : count}
            </span>
          )}
        </span>
      </Link>
      </div>
    </nav>
  );
}

export default Navbar;