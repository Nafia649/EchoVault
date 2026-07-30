import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaSpotify, FaPlay, FaPlus, FaEllipsisH, FaChevronLeft } from 'react-icons/fa';

import { allAlbums, getMockTracks } from '@/data/mockAlbums';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import './PagePlaceholder.css';
import { useFavorites } from '../context/FavoritesContext';

/* ─── Footer ────────────────────────────────────────────────────────────── */


function TrackRow({ track }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-800/60 transition group">
      <span className="w-5 text-right text-xs text-neutral-500 shrink-0 group-hover:hidden">
        {track.trackNumber}
      </span>
      <button
        aria-label={`Play ${track.title}`}
        className="hidden group-hover:flex w-5 items-center justify-center text-white shrink-0"
      >
        <FaPlay className="h-2.5 w-2.5" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{track.title}</p>
        <p className="text-xs text-neutral-500 truncate">{track.artist}</p>
      </div>

      <button
        aria-label="Add to playlist"
        className="opacity-0 group-hover:opacity-100 transition text-neutral-400 hover:text-emerald-400"
      >
        <FaPlus className="h-3.5 w-3.5" />
      </button>

      <span className="text-xs text-neutral-400 shrink-0 w-9 text-right">{track.duration}</span>

      <button
        aria-label="More options"
        className="opacity-0 group-hover:opacity-100 transition text-neutral-400 hover:text-white"
      >
        <FaEllipsisH className="h-3.5 w-3.5" />
      </button>
    </li>
  );
}

export default function AlbumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();

  const album = allAlbums.find((a) => a.id === id);

  if (!album) {
    return (
      <div className="page-placeholder min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-5xl">🎵</p>
        <h2 className="text-2xl font-bold text-white">Album Not Found</h2>
        <p className="text-sm text-neutral-400">We couldn't find an album with that ID.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-black text-sm font-bold px-6 py-2"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const favorited = isFavorite(album.id);
  const tracks = getMockTracks(album);

  return (
    <div className="page-placeholder">
      <div className="max-w-5xl mx-auto px-4 pb-10">

        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition"
          >
            <FaChevronLeft className="h-3 w-3" />
            <span>Album Page</span>
          </button>
        </div>

        <div className="flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <div
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br ${album.color} p-6`}
              style={{ minHeight: '220px' }}
            >
              <div className="flex gap-5 items-start">
                <div className="w-28 h-28 rounded-xl bg-black/30 shrink-0 overflow-hidden flex items-center justify-center text-4xl select-none shadow-lg">
                  🎤
                </div>

                <div className="flex flex-col gap-1 pt-1">
                  <h2 className="text-white font-bold text-xl leading-tight drop-shadow">
                    {album.artist}
                  </h2>
                  <p className="text-white/70 text-sm">{album.year}</p>
                  <p className="text-white/70 text-sm">{album.songs} songs</p>
                  <p className="text-white/70 text-sm">{album.duration}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => toggleFavorite(album)}
                      aria-label={favorited ? 'Remove from Favorites' : 'Add to Favorites'}
                      className={`flex items-center gap-1.5 rounded-full text-xs font-semibold px-4 py-1.5 backdrop-blur-sm
                                  active:scale-95 transition-all duration-200
                                  ${favorited
                                    ? 'bg-rose-500/80 hover:bg-rose-500 text-white'
                                    : 'bg-white/20 hover:bg-white/30 text-white'}`}
                    >
                      {favorited ? <FaHeart className="h-3 w-3" /> : <FaRegHeart className="h-3 w-3" />}
                      {favorited ? 'Remove Favorite' : 'Add to Favorites'}
                    </button>

                    <button
                      disabled
                      className="flex items-center gap-1.5 rounded-full bg-white/10 text-white/50 text-xs font-semibold px-4 py-1.5 cursor-not-allowed"
                    >
                      <FaSpotify className="h-3 w-3" />
                      Open on Spotify
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-white/50 text-[10px] uppercase tracking-widest">Album</p>
                <h1 className="text-white font-extrabold text-3xl leading-tight drop-shadow-md">
                  {album.title}
                </h1>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-white font-bold text-lg tracking-widest uppercase mb-3 px-3">
                Tracks
              </h3>
              <ul className="flex flex-col gap-0.5">
                {tracks.map((track) => (
                  <TrackRow key={track.id} track={track} />
                ))}
              </ul>
            </div>
          </div>

          <Sidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
}