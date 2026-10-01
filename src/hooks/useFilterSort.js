import { useState, useCallback } from 'react';
import { useFavorites } from '@/context/FavoritesContext';

export function useFilterSort(initialItems = [], itemType = 'album') {
  const { isFavorite } = useFavorites();
  const [filterOption, setFilterOption] = useState('All Albums');
  const [sortOption, setSortOption] = useState('Alphabetical (A–Z)');

  const processItems = useCallback((items) => {
    let result = [...items];

    // Filter
    if (filterOption === 'Favorites') {
      result = result.filter(item => isFavorite(item.id));
    } else if (filterOption === 'Has Album Cover') {
      result = result.filter(item => !!item.image);
    } else if (filterOption === 'Has Last.fm Link') {
      result = result.filter(item => !!item.link || !!item.url);
    }

    // Sort
    result.sort((a, b) => {
      // Handle artists (they have .name instead of .title, no year)
      const aTitle = a.title || a.name || '';
      const bTitle = b.title || b.name || '';
      const aArtist = a.artist || a.name || '';
      const bArtist = b.artist || b.name || '';

      if (sortOption === 'Alphabetical (A–Z)') {
        return aTitle.localeCompare(bTitle);
      }
      if (sortOption === 'Alphabetical (Z–A)') {
        return bTitle.localeCompare(aTitle);
      }
      if (sortOption === 'Artist (A–Z)') {
        return aArtist.localeCompare(bArtist);
      }
      if (sortOption === 'Artist (Z–A)') {
        return bArtist.localeCompare(aArtist);
      }
      if (sortOption === 'Newest Release') {
        const yearA = parseInt(a.year, 10) || 0;
        const yearB = parseInt(b.year, 10) || 0;
        return yearB - yearA;
      }
      if (sortOption === 'Oldest Release') {
        const yearA = parseInt(a.year, 10) || 9999;
        const yearB = parseInt(b.year, 10) || 9999;
        return yearA - yearB;
      }
      return 0;
    });

    return result;
  }, [filterOption, sortOption, isFavorite]);

  const handleClearFilters = () => {
    setFilterOption('All Albums');
    setSortOption('Alphabetical (A–Z)');
  };

  return {
    filterOption,
    setFilterOption,
    sortOption,
    setSortOption,
    handleClearFilters,
    processItems
  };
}
