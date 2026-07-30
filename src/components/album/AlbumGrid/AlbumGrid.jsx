import { FaPlay, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '@/context/FavoritesContext';

function AlbumCard({ album, onPlay }) {
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const favorited = isFavorite(album.id);

  return (
    <li>
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
          className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full
                      shadow-md transition-all duration-200 ease-out
                      ${favorited
                        ? 'opacity-100 bg-black/50 text-rose-500 scale-100'
                        : 'opacity-0 bg-black/40 text-white group-hover:opacity-100'}
                      hover:scale-110`}
        >
          {favorited
            ? <FaHeart className="h-3.5 w-3.5" aria-hidden="true" />
            : <FaRegHeart className="h-3.5 w-3.5" aria-hidden="true" />}
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3">
          <div className="min-w-0 translate-y-1 transition-transform duration-300 ease-out group-hover:translate-y-0">
            <p className="truncate text-sm font-bold text-white leading-tight">{album.title}</p>
            <p className="truncate text-xs text-white/70">{album.artist}</p>
          </div>

          <button
            type="button"
            aria-label={`Play ${album.title} by ${album.artist}`}
            onClick={(e) => { e.stopPropagation(); onPlay?.(album); }}
            className="shrink-0 flex h-10 w-10 items-center justify-center rounded-full
                       bg-emerald-500 text-black shadow-lg
                       opacity-0 translate-y-3
                       transition-all duration-300 ease-out
                       group-hover:opacity-100 group-hover:translate-y-0
                       hover:scale-110 hover:bg-emerald-400"
          >
            <FaPlay className="h-3.5 w-3.5 ml-0.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  );
}

function AlbumGrid({ albums, onPlay }) {
  return (
    <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {albums.map((album) => (
        <AlbumCard key={album.id} album={album} onPlay={onPlay} />
      ))}
    </ul>
  );
}

export default AlbumGrid;