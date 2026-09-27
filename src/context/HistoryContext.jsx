import React, { createContext, useContext, useState, useEffect } from 'react';

const HistoryContext = createContext();

export function useHistory() {
  return useContext(HistoryContext);
}

export function HistoryProvider({ children }) {
  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const stored = localStorage.getItem('echovault:history');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('echovault:history', JSON.stringify(recentlyViewed));
    } catch (error) {
      console.error('Failed to save history to localStorage', error);
    }
  }, [recentlyViewed]);

  const addToHistory = (album) => {
    if (!album || !album.id) return;
    
    setRecentlyViewed((prev) => {
      // Remove if it already exists so we can bump it to the top
      const filtered = prev.filter((item) => item.id !== album.id);
      
      const newItem = {
        id: album.id,
        title: album.title,
        artist: album.artist,
        image: album.image,
        link: album.link || null,
        year: album.year || null,
        viewedAt: Date.now(),
      };
      
      // Add to front and limit to 20
      return [newItem, ...filtered].slice(0, 20);
    });
  };

  const clearHistory = () => {
    setRecentlyViewed([]);
    localStorage.removeItem('echovault:history');
  };

  return (
    <HistoryContext.Provider value={{ recentlyViewed, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}
