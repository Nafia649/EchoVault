import { memo, useState } from 'react';
import { FaPlay, FaHeart, FaRegHeart, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, LayoutGroup } from 'framer-motion';
import { useFavorites } from '@/context/FavoritesContext';
import AddToCollectionModal from '@/components/modals/AddToCollectionModal';

export const AlbumCard = memo(function AlbumCard({ album, onPlay }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(album.id);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  
  return (
    <motion.li
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`View ${album.title} by ${album.artist}`}
        onClick={() => navigate(`/album/${album.id}`)}
        onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/album/${album.id}`); }}
        className="group relative aspect-square w-full overflow-hidden rounded-2xl cursor-pointer
                   transition-all duration-300 ease-out
                   hover:scale-[1.03] hover:shadow-2xl"
      >
        {album.image ? (
          <img
            src={album.image}
            alt={`${album.title} cover`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${album.color}`} />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Favorite button — top right */}
        <button
          type="button"
          aria-label={favorited ? `Remove ${album.title} from favorites` : `Add ${album.title} to favorites`}
          onClick={(e) => { e.stopPropagation(); toggleFavorite(album); }}
          className={`absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full
                      shadow-md transition-all duration-200 ease-out
                      ${favorited
                        ? 'opacity-100 bg-black/50 text-rose-500 scale-100'
                        : 'opacity-0 bg-black/40 text-white group-hover:opacity-100'}
                      hover:scale-110`}
        >
          {favorited
            ? <FaHeart className="h-4 w-4" aria-hidden="true" />
            : <FaRegHeart className="h-4 w-4" aria-hidden="true" />}
        </button>

        {/* Add to Collection button — top left */}
        <button
          type="button"
          aria-label={`Add ${album.title} to collection`}
          onClick={(e) => { e.stopPropagation(); setShowCollectionModal(true); }}
          className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-full
                     shadow-md bg-black/40 text-white
                     opacity-0 group-hover:opacity-100
                     transition-all duration-200 ease-out hover:scale-110 hover:bg-black/60"
        >
          <FaPlus className="h-3.5 w-3.5" aria-hidden="true" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3">
          <div className="min-w-0 translate-y-1 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <p className="truncate text-base font-bold text-white leading-tight">{album.title}</p>
            <p className="truncate text-sm text-white/70">{album.artist}</p>
          </div>

          <button
            type="button"
            aria-label={`Play ${album.title} by ${album.artist}`}
            onClick={(e) => { e.stopPropagation(); onPlay?.(album); }}
            className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full
                       bg-emerald-500 text-black shadow-lg
                       opacity-0 translate-y-3
                       transition-all duration-300 ease-out
                       group-hover:opacity-100 group-hover:translate-y-0
                       hover:scale-110 hover:bg-emerald-400"
          >
            <FaPlay className="h-4 w-4 ml-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AddToCollectionModal
        album={album}
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
      />
    </motion.li>
  );
});

const AlbumGrid = memo(function AlbumGrid({ albums, onPlay }) {
  return (
    <LayoutGroup>
      <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} onPlay={onPlay} />
        ))}
      </ul>
    </LayoutGroup>
  );
});

export default AlbumGrid;

