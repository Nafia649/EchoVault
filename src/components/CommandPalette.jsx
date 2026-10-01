import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSearch, FaHome, FaCompass, FaHeart, FaFolderOpen,
  FaPlus, FaTimes, FaTrash, FaExternalLinkAlt, FaDice,
} from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { BsMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { useTheme } from '@/context/ThemeContext';
import { useHistory } from '@/context/HistoryContext';
import { useCollections } from '@/context/CollectionsContext';
import { useFavorites } from '@/context/FavoritesContext';
import { useRecentSearches } from '@/hooks/useRecentSearches';

export default function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { recentlyViewed, clearHistory } = useHistory();
  const { collections, createCollection } = useCollections();
  const { favorites } = useFavorites();
  const { recentSearches, clearSearches } = useRecentSearches();

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const backdropRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setActiveIndex(0);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const commands = useMemo(() => {
    const items = [
      {
        id: 'nav-home',
        label: 'Go to Home',
        icon: FaHome,
        section: 'Navigation',
        action: () => { navigate('/'); onClose(); },
      },
      {
        id: 'nav-discover',
        label: 'Go to Discover',
        icon: FaCompass,
        section: 'Navigation',
        action: () => { navigate('/discover'); onClose(); },
      },
      {
        id: 'nav-collections',
        label: 'Go to Collections',
        icon: FaFolderOpen,
        section: 'Navigation',
        action: () => { navigate('/collections'); onClose(); },
      },
      {
        id: 'nav-favorites',
        label: 'Go to Favorites',
        icon: FaHeart,
        section: 'Navigation',
        action: () => { navigate('/favorites'); onClose(); },
      },
      {
        id: 'toggle-theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: theme === 'dark' ? BsSunFill : BsMoonStarsFill,
        section: 'Actions',
        action: () => { toggleTheme(); onClose(); },
      },
      {
        id: 'create-collection',
        label: 'Create New Collection',
        icon: FaPlus,
        section: 'Actions',
        action: () => { navigate('/collections'); onClose(); /* Collections page handles creation */ },
      },
      {
        id: 'clear-history',
        label: 'Clear Recently Viewed',
        icon: FaTrash,
        section: 'Actions',
        disabled: recentlyViewed.length === 0,
        action: () => { clearHistory(); onClose(); },
      },
      {
        id: 'clear-recent-searches',
        label: 'Clear Recent Searches',
        icon: FiClock,
        section: 'Actions',
        disabled: recentSearches.length === 0,
        action: () => { clearSearches(); onClose(); },
      },
      {
        id: 'open-lastfm',
        label: 'Open Last.fm',
        icon: FaExternalLinkAlt,
        section: 'Actions',
        action: () => { window.open('https://www.last.fm', '_blank'); onClose(); },
      },
      {
        id: 'surprise-me',
        label: 'Surprise Me — Random Album',
        icon: FaDice,
        section: 'Actions',
        disabled: favorites.length === 0 && recentlyViewed.length === 0,
        action: () => {
          const pool = [...favorites, ...recentlyViewed];
          if (pool.length === 0) return;
          const random = pool[Math.floor(Math.random() * pool.length)];
          navigate(`/album/${random.id}`);
          onClose();
        },
      },
    ];
    return items;
  }, [theme, recentlyViewed, recentSearches, favorites, collections, navigate, onClose, toggleTheme, clearHistory, clearSearches]);

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands.filter((c) => !c.disabled);

    return commands.filter((c) => {
      if (c.disabled) return false;
      return c.label.toLowerCase().includes(q) || c.section.toLowerCase().includes(q);
    });
  }, [query, commands]);

  // Build a "search artist" action when query is non-empty
  const searchAction = useMemo(() => {
    const q = query.trim();
    if (!q) return null;
    return {
      id: 'search-artist',
      label: `Search for "${q}"`,
      icon: FaSearch,
      section: 'Search',
      action: () => {
        navigate(`/?search=${encodeURIComponent(q)}`);
        onClose();
      },
    };
  }, [query, navigate, onClose]);

  const allItems = useMemo(() => {
    const items = [];
    if (searchAction) items.push(searchAction);
    items.push(...filteredCommands);
    return items;
  }, [searchAction, filteredCommands]);

  // Reset active index when items change
  useEffect(() => {
    setActiveIndex(0);
  }, [allItems.length]);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = allItems[activeIndex];
      if (item) item.action();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  // Group items by section
  const sections = {};
  if (isOpen) {
    allItems.forEach((item) => {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });
  }

  let globalIndex = 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-200 dark:border-white/10 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 dark:border-white/5">
          <FaSearch className="h-4 w-4 text-gray-400 dark:text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, artists…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 outline-none transition-colors duration-200"
          />
          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-400 dark:text-neutral-500 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
          >
            ESC
          </button>
        </div>

        {/* Command list */}
        <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
          {allItems.length === 0 && (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">
                No matching commands.
              </p>
            </div>
          )}

          {Object.entries(sections).map(([sectionName, sectionItems]) => (
            <div key={sectionName}>
              <p className="px-5 pt-3 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500 transition-colors duration-300">
                {sectionName}
              </p>
              {sectionItems.map((item) => {
                const idx = globalIndex++;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    data-index={idx}
                    onClick={item.action}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors duration-150 ${
                      idx === activeIndex
                        ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-gray-100 dark:border-white/5 text-[10px] text-gray-400 dark:text-neutral-500 transition-colors duration-300">
          <span>↑↓ Navigate · Enter Select · Esc Close</span>
          <span>EchoVault Command Palette</span>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
