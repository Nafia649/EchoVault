import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaHome, FaCompass, FaFolderOpen, FaSearch } from 'react-icons/fa';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import logo from '@/assets/logo_main.svg';
import { useFavorites } from '@/context/FavoritesContext';
import { useTheme } from '@/context/ThemeContext';

export default function Navbar({ onOpenPalette }) {
  const { theme, toggleTheme } = useTheme();
  const { newFavoritesCount } = useFavorites();
  const location = useLocation();

  const isDark = theme === 'dark';
  const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/discover', label: 'Discover', icon: FaCompass },
    { path: '/collections', label: 'Collections', icon: FaFolderOpen },
    { path: '/favorites', label: 'Favorites', icon: FaHeart, badge: newFavoritesCount },
  ];

  return (
    <nav className="sticky top-0 z-50 grid grid-cols-[1fr_auto_1fr] items-center w-full min-h-[64px] px-4 md:px-8 bg-[#F3F4F6] dark:bg-black border-b border-[#E5E7EB] dark:border-white/10 transition-colors duration-300">
      
      {/* Left: Logo & Brand */}
      <div className="flex items-center justify-self-start">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-md">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-black dark:bg-white transition-colors duration-300">
            <img src={logo} alt="EchoVault logo" className="w-5 h-5 dark:invert" />
          </div>
          <span className="hidden sm:block font-['Jersey_10'] text-[2rem] tracking-wider text-[#111827] dark:text-white transition-colors duration-300">
            EchoVault
          </span>
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="hidden md:flex items-center gap-1 md:gap-2 justify-self-center">
        {navLinks.map(({ path, label, icon: Icon, badge }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex items-center gap-2 p-2 md:px-4 md:py-2 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-400/10'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-white dark:hover:bg-white/10'
              }`}
            >
              <Icon className="text-xl md:text-lg" />
              <span className="hidden lg:block">{label}</span>
              
              {badge > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-green-500 rounded-full">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Right: Command Palette Hint + Theme Toggle */}
      <div className="flex items-center gap-2 justify-self-end">
        {/* Ctrl+K hint */}
        <button
          type="button"
          onClick={onOpenPalette}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-200/70 dark:bg-white/5 border border-gray-300 dark:border-white/10 hover:bg-gray-300 dark:hover:bg-white/10 transition-colors duration-200 group"
        >
          <FaSearch className="h-3 w-3 text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors duration-200" />
          <span className="text-[11px] font-medium text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors duration-200">
            {isMac ? '⌘K' : 'Ctrl+K'}
          </span>
        </button>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="relative flex items-center p-1 w-14 h-7 rounded-full bg-gray-300 dark:bg-[#141414] border border-transparent dark:border-white/10 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
        >
          <span
            className={`flex items-center justify-center w-5 h-5 rounded-full bg-white dark:bg-black shadow-sm transform transition-transform duration-300 ease-in-out ${
              isDark ? 'translate-x-7' : 'translate-x-0'
            }`}
          >
            {isDark ? (
              <BsMoonStarsFill className="text-[10px] text-white" />
            ) : (
              <BsSunFill className="text-[11px] text-yellow-500" />
            )}
          </span>
        </button>
      </div>

    </nav>
  );
}

