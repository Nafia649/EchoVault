import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'echovault_favorites';

function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(loadFavorites);
  const [newFavoritesCount, setNewFavoritesCount] = useState(0);

  const toggleFavorite = useCallback((album) => {
    const exists = favorites.some((a) => a.id === album.id);

    if (!exists) {
      setNewFavoritesCount(c => c + 1);
    }

    setFavorites((prev) => {
      const currentExists = prev.some((a) => a.id === album.id);
      let next;
      if (currentExists) {
        next = prev.filter((a) => a.id !== album.id);
      } else {
        next = [...prev, album];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, [favorites]);

  const clearNewFavorites = useCallback(() => {
    setNewFavoritesCount(0);
  }, []);

  const isFavorite = useCallback(
    (id) => favorites.some((a) => a.id === id),
    [favorites]
  );

  return (
    <FavoritesContext.Provider value={{
      favorites,
      toggleFavorite,
      isFavorite,
      newFavoritesCount,
      clearNewFavorites
    }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used inside FavoritesProvider');
  return ctx;
}