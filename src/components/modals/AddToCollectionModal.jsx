import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import { useCollections } from '@/context/CollectionsContext';

const EMOJI_OPTIONS = ['🎵', '🎸', '🎹', '🎤', '🎧', '🌙', '☀️', '🔥', '💜', '🌊', '🚀', '✨', '🎶', '💿', '🎺', '🎻'];

export default function AddToCollectionModal({ album, isOpen, onClose }) {
  const {
    collections,
    createCollection,
    addAlbumToCollection,
    removeAlbumFromCollection,
    isAlbumInCollection,
  } = useCollections();

  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎵');
  const inputRef = useRef(null);
  const backdropRef = useRef(null);

  // Focus input when creating
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) onClose();
  };

  const handleToggle = (collectionId) => {
    if (!album) return;
    if (isAlbumInCollection(collectionId, album.id)) {
      removeAlbumFromCollection(collectionId, album.id);
    } else {
      addAlbumToCollection(collectionId, album);
    }
  };

  const handleCreate = () => {
    if (!newName.trim() || !album) return;
    const id = createCollection(newName, selectedEmoji);
    addAlbumToCollection(id, album);
    setNewName('');
    setSelectedEmoji('🎵');
    setIsCreating(false);
  };

  const handleCreateKeyDown = (e) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewName('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && album && (
        <motion.div
          ref={backdropRef}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden border border-gray-200 dark:border-white/10 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3 min-w-0">
            {album.image && (
              <img src={album.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors duration-300">
                {album.title}
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 truncate transition-colors duration-300">
                {album.artist}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-neutral-400 transition-colors duration-200"
            aria-label="Close"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Collection list */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {collections.length === 0 && !isCreating && (
            <div className="py-8 text-center">
              <p className="text-3xl mb-2">📂</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300">
                No collections yet
              </p>
              <p className="text-xs text-gray-500 dark:text-neutral-400 mt-1 transition-colors duration-300">
                Create one to start organizing your music.
              </p>
            </div>
          )}

          {collections.map((col) => {
            const inCollection = isAlbumInCollection(col.id, album.id);
            return (
              <button
                key={col.id}
                onClick={() => handleToggle(col.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors duration-200 text-left"
              >
                <span className="text-xl shrink-0">{col.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors duration-300">
                    {col.name}
                  </p>
                  <p className="text-[11px] text-gray-500 dark:text-neutral-500 transition-colors duration-300">
                    {col.albums.length} {col.albums.length === 1 ? 'album' : 'albums'}
                  </p>
                </div>
                <div
                  className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-all duration-200 ${
                    inCollection
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-gray-300 dark:border-neutral-600'
                  }`}
                >
                  {inCollection && <FaCheck className="h-2.5 w-2.5" />}
                </div>
              </button>
            );
          })}

          {/* Inline create form */}
          {isCreating && (
            <div className="mt-2 p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 transition-colors duration-300">
              <div className="flex gap-2 mb-2 flex-wrap">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => setSelectedEmoji(em)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-all duration-150 ${
                      selectedEmoji === em
                        ? 'bg-emerald-500/20 ring-2 ring-emerald-500 scale-110'
                        : 'hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Collection name…"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={handleCreateKeyDown}
                  maxLength={50}
                  className="flex-1 min-w-0 bg-white dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                />
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-bold transition-all duration-200 active:scale-95"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={() => {
              setIsCreating(!isCreating);
              setNewName('');
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-sm font-semibold text-gray-700 dark:text-neutral-300 transition-colors duration-200"
          >
            <FaPlus className="h-3 w-3" />
            {isCreating ? 'Cancel' : 'New Collection'}
          </button>
        </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
