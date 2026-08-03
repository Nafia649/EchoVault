import { useState, useEffect, useMemo } from 'react';
import { useFavorites } from '@/context/FavoritesContext';
import AlbumGrid from '@/components/album/AlbumGrid/AlbumGrid';
import Sidebar from '@/components/Sidebar/Sidebar';
import './PagePlaceholder.css';

import Footer from '@/components/Footer';

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center transition-colors duration-300">
      <p className="text-5xl">🎵</p>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">No favorites yet</h2>
      <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs transition-colors duration-300">
        Browse albums and hit the heart icon to save them here.
      </p>
    </div>
  );
}

export default function Favorites() {
  const { favorites, isFavorite, clearNewFavorites } = useFavorites();

  useEffect(() => {
    clearNewFavorites();
  }, [clearNewFavorites]);

  const [filterOption, setFilterOption] = useState('All Albums');
  const [sortOption, setSortOption]     = useState('Alphabetical (A–Z)');

  const displayAlbums = useMemo(() => {
    let result = [...favorites];

    if (filterOption === 'Favorites') {
      result = result.filter(a => isFavorite(a.id));
    } else if (filterOption === 'Has Album Cover') {
      result = result.filter(a => !!a.image);
    } else if (filterOption === 'Has Last.fm Link') {
      result = result.filter(a => !!a.link || !!a.url);
    }

    result.sort((a, b) => {
      if (sortOption === 'Alphabetical (A–Z)') return a.title.localeCompare(b.title);
      if (sortOption === 'Alphabetical (Z–A)') return b.title.localeCompare(a.title);
      if (sortOption === 'Artist (A–Z)')       return a.artist.localeCompare(b.artist);
      if (sortOption === 'Artist (Z–A)')       return b.artist.localeCompare(a.artist);
      if (sortOption === 'Newest Release')     return (parseInt(b.year, 10) || 0) - (parseInt(a.year, 10) || 0);
      if (sortOption === 'Oldest Release')     return (parseInt(a.year, 10) || 9999) - (parseInt(b.year, 10) || 9999);
      return 0;
    });

    return result;
  }, [favorites, filterOption, sortOption, isFavorite]);

  function handleClearFilters() {
    setFilterOption('All Albums');
    setSortOption('Alphabetical (A–Z)');
  }

  return (
    <div className="page-placeholder">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#49ACBF] via-[#1a4a52] to-[#0a1a1f] px-6 py-14 sm:px-10 rounded-lg">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#1ED760]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#49ACBF]/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-2">T</p>
          <h1 className="font-mono font-bold text-3xl sm:text-4xl text-white tracking-wide leading-tight mb-3">
            Find your favorites Here
          </h1>
          <p className="text-[#1ED760] font-mono text-sm sm:text-base">
            Your music taste?<br />Immaculate.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="flex gap-5 items-start">

          <div className="flex-1 min-w-0 pt-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300">
                Albums
              </h2>
              {favorites.length > 0 && (
                <span className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">
                  Showing {displayAlbums.length} {displayAlbums.length === 1 ? 'album' : 'albums'}
                </span>
              )}
            </div>

            {displayAlbums.length === 0 ? <EmptyState isFiltered={favorites.length > 0 && displayAlbums.length === 0} onClearFilters={handleClearFilters} /> : <AlbumGrid albums={displayAlbums} />}
          </div>

          <Sidebar
            filterOption={filterOption}
            sortOption={sortOption}
            onFilterChange={setFilterOption}
            onSortChange={setSortOption}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
