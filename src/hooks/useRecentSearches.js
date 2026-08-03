import { useState, useEffect } from 'react';

const STORAGE_KEY = 'echovault_recent_searches';
const MAX_SEARCHES = 8;

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
  }, [recentSearches]);

  const addSearch = (query) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    
    setRecentSearches((prev) => {
      // Remove duplicate
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      // Add to front
      const updated = [trimmed, ...filtered];
      // Limit to max
      return updated.slice(0, MAX_SEARCHES);
    });
  };

  const clearSearches = () => setRecentSearches([]);

  return { recentSearches, addSearch, clearSearches };
}
