import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaTrash, FaPen, FaTimes, FaCheck } from 'react-icons/fa';
import { useCollections } from '@/context/CollectionsContext';
import { AlbumCard } from '@/components/album/AlbumGrid/AlbumGrid';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import { useFilterSort } from '@/hooks/useFilterSort';
import './PagePlaceholder.css';

const EMOJI_OPTIONS = ['🎵', '🎸', '🎹', '🎤', '🎧', '🌙', '☀️', '🔥', '💜', '🌊', '🚀', '✨', '🎶', '💿', '🎺', '🎻'];

function EmptyState({ onCreateFirst }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center transition-colors duration-300">
      <p className="text-5xl">📂</p>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
        No collections yet
      </h2>
      <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs transition-colors duration-300">
        Create a collection to organize albums into custom playlists like &ldquo;Late Night Drives&rdquo; or &ldquo;Summer Vibes&rdquo;.
      </p>
      <button
        onClick={onCreateFirst}
        className="mt-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-black text-sm font-bold px-6 py-2.5"
      >
        Create Your First Collection
      </button>
    </div>
  );
}

function CollectionCard({ collection, onOpen, onDelete, onRename, getCollectionCover }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(collection.name);
  const [editEmoji, setEditEmoji] = useState(collection.emoji);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const cover = getCollectionCover(collection);
  const albumCount = collection.albums.length;

  const handleSave = () => {
    if (editName.trim()) {
      onRename(collection.id, editName, editEmoji);
    }
    setIsEditing(false);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') {
      setIsEditing(false);
      setEditName(collection.name);
      setEditEmoji(collection.emoji);
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Cover area */}
      <div
        onClick={() => !isEditing && onOpen(collection.id)}
        className="relative aspect-square cursor-pointer overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-800 dark:to-neutral-700"
      >
        {cover ? (
          <img src={cover} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl">{collection.emoji}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs text-white/70 font-medium">
            {albumCount} {albumCount === 1 ? 'album' : 'albums'}
          </p>
        </div>

        {/* Action buttons — top right, visible on hover */}
        <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors duration-200"
            aria-label="Rename collection"
          >
            <FaPen className="h-3 w-3" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(collection.id); }}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 text-white hover:bg-rose-500 transition-colors duration-200"
            aria-label="Delete collection"
          >
            <FaTrash className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-3">
        {isEditing ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="shrink-0 w-9 h-9 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center text-lg hover:bg-gray-200 dark:hover:bg-white/20 transition-colors duration-200"
              >
                {editEmoji}
              </button>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={50}
                autoFocus
                className="flex-1 min-w-0 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-lg px-2.5 py-1.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
              />
            </div>
            {showEmojiPicker && (
              <div className="flex flex-wrap gap-1.5">
                {EMOJI_OPTIONS.map((em) => (
                  <button
                    key={em}
                    type="button"
                    onClick={() => { setEditEmoji(em); setShowEmojiPicker(false); }}
                    className={`w-7 h-7 rounded flex items-center justify-center text-sm transition-all duration-150 ${
                      editEmoji === em ? 'bg-emerald-500/20 ring-1 ring-emerald-500' : 'hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-1.5">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition-colors duration-200"
              >
                <FaCheck className="h-2.5 w-2.5" /> Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditName(collection.name);
                  setEditEmoji(collection.emoji);
                  setShowEmojiPicker(false);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-neutral-300 text-xs font-bold transition-colors duration-200"
              >
                <FaTimes className="h-2.5 w-2.5" /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => onOpen(collection.id)} className="w-full text-left">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate transition-colors duration-300">
              {collection.emoji} {collection.name}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-neutral-500 mt-0.5 transition-colors duration-300">
              Created {new Date(collection.createdAt).toLocaleDateString()}
            </p>
          </button>
        )}
      </div>
    </div>
  );
}

export default function Collections() {
  const navigate = useNavigate();
  const {
    collections,
    createCollection,
    deleteCollection,
    renameCollection,
    removeAlbumFromCollection,
    getCollectionCover,
  } = useCollections();

  const {
    filterOption, setFilterOption,
    sortOption, setSortOption,
    handleClearFilters,
    processItems
  } = useFilterSort();

  const [selectedId, setSelectedId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmoji, setNewEmoji] = useState('🎵');

  const selectedCollection = selectedId ? collections.find((c) => c.id === selectedId) : null;

  // Custom sort for the collections themselves
  const sortedCollections = [...collections].sort((a, b) => {
    if (sortOption === 'Alphabetical (A–Z)') return a.name.localeCompare(b.name);
    if (sortOption === 'Alphabetical (Z–A)') return b.name.localeCompare(a.name);
    // fallback to chronological for 'Artist' or others
    if (sortOption === 'Oldest Release') return new Date(a.createdAt) - new Date(b.createdAt);
    return new Date(b.createdAt) - new Date(a.createdAt); // default/Newest
  });

  const handleCreate = () => {
    if (!newName.trim()) return;
    createCollection(newName, newEmoji);
    setNewName('');
    setNewEmoji('🎵');
    setIsCreating(false);
  };

  const handleCreateKeyDown = (e) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') {
      setIsCreating(false);
      setNewName('');
    }
  };

  // Detail view for a single collection
  if (selectedCollection) {
    return (
      <div className="page-placeholder">
        <div className="max-w-5xl mx-auto px-4 pb-10 pt-8">
          <button
            onClick={() => setSelectedId(null)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 mb-6"
          >
            ← Back to Collections
          </button>

          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">{selectedCollection.emoji}</span>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors duration-300">
                {selectedCollection.name}
              </h1>
              <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">
                {selectedCollection.albums.length} {selectedCollection.albums.length === 1 ? 'album' : 'albums'} · Created {new Date(selectedCollection.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {selectedCollection.albums.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <p className="text-5xl">🎵</p>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                This collection is empty
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-xs transition-colors duration-300">
                Browse albums and use the + button to add them to this collection.
              </p>
              <button
                onClick={() => navigate('/discover')}
                className="mt-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-black text-sm font-bold px-6 py-2.5"
              >
                Discover Albums
              </button>
            </div>
          ) : (
            <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {processItems(selectedCollection.albums).map((album) => (
                <li key={album.id} className="relative group/item">
                  <AlbumCard album={album} />
                  <button
                    onClick={() => removeAlbumFromCollection(selectedCollection.id, album.id)}
                    className="absolute top-3 left-3 flex items-center justify-center w-7 h-7 rounded-full bg-black/50 text-white opacity-0 group-hover/item:opacity-100 hover:bg-rose-500 transition-all duration-200 z-10"
                    aria-label={`Remove ${album.title} from collection`}
                  >
                    <FaTimes className="h-2.5 w-2.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="hidden lg:block px-4">
          <Sidebar
            hideFilter
            filterOption={filterOption}
            sortOption={sortOption}
            onFilterChange={setFilterOption}
            onSortChange={setSortOption}
            onClearFilters={handleClearFilters}
          />
        </div>
        <Footer />
      </div>
    );
  }

  // Grid of all collections
  return (
    <div className="page-placeholder">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#4C1D95] to-[#1E1B4B] px-6 py-14 sm:px-10 rounded-lg">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Library</p>
          <h1 className="font-mono font-bold text-3xl sm:text-4xl text-white tracking-wide leading-tight mb-3">
            Your Collections
          </h1>
          <p className="text-purple-300 font-mono text-sm sm:text-base">
            Curated playlists,<br />your way.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0 pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300">
                Collections
              </h2>
              {collections.length > 0 && (
                <button
                  onClick={() => setIsCreating(!isCreating)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-black text-sm font-bold"
                >
                  <FaPlus className="h-3 w-3" />
                  New
                </button>
              )}
            </div>

            {/* Inline create form */}
            {isCreating && (
              <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/5 shadow-sm transition-colors duration-300">
                <div className="flex flex-wrap gap-2 mb-3">
                  {EMOJI_OPTIONS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => setNewEmoji(em)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all duration-150 ${
                        newEmoji === em
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
                    type="text"
                    placeholder="Collection name…"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={handleCreateKeyDown}
                    maxLength={50}
                    autoFocus
                    className="flex-1 min-w-0 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-500 outline-none focus:ring-2 focus:ring-emerald-500 transition-colors duration-200"
                  />
                  <button
                    onClick={handleCreate}
                    disabled={!newName.trim()}
                    className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-bold transition-all duration-200 active:scale-95"
                  >
                    Create
                  </button>
                </div>
              </div>
            )}

            {collections.length === 0 ? (
              <EmptyState onCreateFirst={() => setIsCreating(true)} />
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                {sortedCollections.map((col) => (
                  <CollectionCard
                    key={col.id}
                    collection={col}
                    onOpen={setSelectedId}
                    onDelete={deleteCollection}
                    onRename={renameCollection}
                    getCollectionCover={getCollectionCover}
                  />
                ))}
              </div>
            )}
          </div>

          <Sidebar
            hideFilter
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
