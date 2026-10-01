import { useState, useRef, useEffect } from 'react';
import { FiSearch, FiClock, FiUser } from 'react-icons/fi';
import { useRecentSearches } from '@/hooks/useRecentSearches';
import { getArtistSuggestions } from '@/services/lastfmApi';

function SearchSection({ searchQuery, setSearchQuery }) {
  const [isFocused, setIsFocused] = useState(false);
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();
  const dropdownRef = useRef(null);
  
  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter') {
      addSearch(searchQuery);
      setIsFocused(false);
    }
  };

  const handleRecentClick = (query) => {
    setSearchQuery(query);
    addSearch(query);
    setIsFocused(false);
  };

  const showRecent = isFocused && !searchQuery.trim() && recentSearches.length > 0;

  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const suggestionsAbortController = useRef(null);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setArtistSuggestions([]);
      return;
    }

    const handler = setTimeout(() => {
      suggestionsAbortController.current?.abort();
      const controller = new AbortController();
      suggestionsAbortController.current = controller;

      getArtistSuggestions(searchQuery, controller.signal)
        .then((suggestions) => {
          setArtistSuggestions(suggestions);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') console.error('Failed to load suggestions', err);
        });
    }, 150); // Fast debounce for autocomplete

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const showSuggestions = isFocused && searchQuery.trim() && artistSuggestions.length > 0;
  const showDropdown = showRecent || showSuggestions;

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1b817a] to-[#0b4845] dark:from-teal-900 dark:to-black px-4 py-16 sm:py-20 md:py-24 transition-colors duration-300 z-40 mb-10 shadow-lg">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-8 h-64 w-full max-w-3xl -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl transition-colors duration-300"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <h1 className="font-mono text-3xl font-bold uppercase tracking-widest text-white sm:text-4xl md:text-5xl transition-colors duration-300">
          Discover Artists
        </h1>

        <p className="mt-4 max-w-xl text-sm text-teal-100/70 sm:text-base transition-colors duration-300">
          Search millions of albums from your favorite artists.
        </p>

        <div className="mt-8 w-full max-w-xl relative" ref={dropdownRef}>
          <div className={`flex w-full items-center gap-2 border border-white/20 dark:border-neutral-700 bg-white dark:bg-neutral-900 py-3 pl-5 pr-4 focus-within:ring-2 focus-within:ring-teal-500 transition-all duration-300 shadow-md ${showDropdown ? 'rounded-t-2xl border-b-transparent' : 'rounded-full'}`}>
            <FiSearch
              className="h-5 w-5 shrink-0 text-gray-400 dark:text-neutral-500"
              aria-hidden="true"
            />
            <label htmlFor="search-input" className="sr-only">
              Search albums and artists
            </label>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={handleSearchSubmit}
              placeholder="e.g. Sabrina Carpenter"
              className="w-full min-w-0 bg-transparent text-base text-gray-900 dark:text-white placeholder-gray-400 outline-none"
            />
          </div>

          {/* Spotify-style Dropdown (Recent or Suggestions) */}
          {showDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-neutral-900 border border-t-0 border-gray-200 dark:border-neutral-700 rounded-b-2xl shadow-xl overflow-hidden z-50 transition-colors duration-300">
              {showRecent ? (
                <>
                  <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 dark:border-neutral-800">
                    <span className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Recent Searches</span>
                    <button 
                      onClick={clearSearches}
                      className="text-xs text-teal-600 dark:text-neutral-400 hover:text-teal-700 dark:hover:text-white font-medium transition-colors"
                    >
                      Clear History
                    </button>
                  </div>
                  <ul className="py-2">
                    {recentSearches.map((query, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleRecentClick(query)}
                          className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors group"
                        >
                          <FiClock className="h-4 w-4 shrink-0 text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                          <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white truncate">{query}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center px-5 py-3 border-b border-gray-100 dark:border-neutral-800">
                    <span className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">Suggestions</span>
                  </div>
                  <ul className="py-2">
                    {artistSuggestions.map((artist, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => handleRecentClick(artist)}
                          className="w-full flex items-center gap-4 px-5 py-3 text-left hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors group"
                        >
                          <FiUser className="h-4 w-4 shrink-0 text-gray-400 dark:text-neutral-500 group-hover:text-gray-600 dark:group-hover:text-white transition-colors" />
                          <span className="flex-1 text-sm font-medium text-gray-800 dark:text-white truncate">{artist}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchSection;
