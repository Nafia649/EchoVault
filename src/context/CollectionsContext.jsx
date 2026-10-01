import { createContext, useContext, useState, useCallback } from 'react';

const STORAGE_KEY = 'echovault:collections';

function loadCollections() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCollections(collections) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (error) {
    console.error('Failed to save collections to localStorage', error);
  }
}

let nextId = Date.now();
function generateId() {
  return `col_${nextId++}`;
}

const CollectionsContext = createContext(null);

export function CollectionsProvider({ children }) {
  const [collections, setCollections] = useState(loadCollections);

  const createCollection = useCallback((name, emoji = '🎵') => {
    const newCollection = {
      id: generateId(),
      name: name.trim(),
      emoji,
      albums: [],
      createdAt: Date.now(),
    };
    setCollections((prev) => {
      const next = [newCollection, ...prev];
      saveCollections(next);
      return next;
    });
    return newCollection.id;
  }, []);

  const deleteCollection = useCallback((collectionId) => {
    setCollections((prev) => {
      const next = prev.filter((c) => c.id !== collectionId);
      saveCollections(next);
      return next;
    });
  }, []);

  const renameCollection = useCallback((collectionId, newName, newEmoji) => {
    setCollections((prev) => {
      const next = prev.map((c) => {
        if (c.id !== collectionId) return c;
        return {
          ...c,
          name: newName !== undefined ? newName.trim() : c.name,
          emoji: newEmoji !== undefined ? newEmoji : c.emoji,
        };
      });
      saveCollections(next);
      return next;
    });
  }, []);

  const addAlbumToCollection = useCallback((collectionId, album) => {
    if (!album || !album.id) return;
    setCollections((prev) => {
      const next = prev.map((c) => {
        if (c.id !== collectionId) return c;
        if (c.albums.some((a) => a.id === album.id)) return c; // already in
        return {
          ...c,
          albums: [
            ...c.albums,
            {
              id: album.id,
              title: album.title,
              artist: album.artist,
              image: album.image || null,
              color: album.color || null,
            },
          ],
        };
      });
      saveCollections(next);
      return next;
    });
  }, []);

  const removeAlbumFromCollection = useCallback((collectionId, albumId) => {
    setCollections((prev) => {
      const next = prev.map((c) => {
        if (c.id !== collectionId) return c;
        return {
          ...c,
          albums: c.albums.filter((a) => a.id !== albumId),
        };
      });
      saveCollections(next);
      return next;
    });
  }, []);

  const isAlbumInCollection = useCallback(
    (collectionId, albumId) => {
      const col = collections.find((c) => c.id === collectionId);
      return col ? col.albums.some((a) => a.id === albumId) : false;
    },
    [collections]
  );

  const getCollectionCover = useCallback((collection) => {
    if (!collection || !collection.albums || collection.albums.length === 0) return null;
    // Return first album with an image
    const withImage = collection.albums.find((a) => a.image);
    return withImage ? withImage.image : null;
  }, []);

  return (
    <CollectionsContext.Provider
      value={{
        collections,
        createCollection,
        deleteCollection,
        renameCollection,
        addAlbumToCollection,
        removeAlbumFromCollection,
        isAlbumInCollection,
        getCollectionCover,
      }}
    >
      {children}
    </CollectionsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCollections() {
  const ctx = useContext(CollectionsContext);
  if (!ctx) throw new Error('useCollections must be used inside CollectionsProvider');
  return ctx;
}
