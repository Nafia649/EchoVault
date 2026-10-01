import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaPlay, FaPlus, FaChevronLeft } from 'react-icons/fa';

import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import SkeletonAlbumDetails from '@/components/album/SkeletonAlbumDetails';
import ErrorMessage from '@/components/ErrorMessage';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';
import { getAlbum, getArtistTopAlbums, getSimilarArtists } from '@/services/lastfmApi';
import { AlbumCard } from '@/components/album/AlbumGrid/AlbumGrid';
import AddToCollectionModal from '@/components/modals/AddToCollectionModal';
import './PagePlaceholder.css';

/* ─── Track Row ─────────────────────────────────────────────────────────── */

function TrackRow({ track }) {
  return (
    <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800/60 transition-colors duration-300 group">
      <span className="w-5 text-right text-xs text-gray-500 dark:text-neutral-500 shrink-0 group-hover:hidden transition-colors duration-300">
        {track.trackNumber}
      </span>
      <button
        aria-label={`Play ${track.title}`}
        className="hidden group-hover:flex w-5 items-center justify-center text-gray-900 dark:text-white shrink-0 transition-colors duration-300"
      >
        <FaPlay className="h-2.5 w-2.5" />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate transition-colors duration-300">{track.title}</p>
        <p className="text-xs text-gray-500 dark:text-neutral-500 truncate transition-colors duration-300">{track.artist}</p>
      </div>

      <span className="text-xs text-gray-400 dark:text-neutral-400 shrink-0 w-9 text-right transition-colors duration-300">{track.duration}</span>
    </li>
  );
}

/* ─── AlbumDetails Page ─────────────────────────────────────────────────── */

export default function AlbumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  const [album, setAlbum]       = useState(null);
  const [moreAlbums, setMoreAlbums] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]       = useState(null);

  const abortControllerRef = useRef(null);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  useEffect(() => {
    if (!id) return;

    // Abort any previous in-flight request before starting a new one.
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setAlbum(null);
    setError(null);
    setIsLoading(true);

    getAlbum(id, controller.signal)
      .then((data) => {
        setAlbum(data);
        addToHistory(data);
        setIsLoading(false);
        // Fetch more albums and similar artists
        if (data && data.artist) {
          Promise.all([
            getArtistTopAlbums(data.artist, controller.signal),
            getSimilarArtists(data.artist, 5, controller.signal)
          ]).then(([albums, artists]) => {
            setMoreAlbums(albums.filter(a => a.id !== data.id).slice(0, 4));
            setSimilarArtists(artists.slice(0, 5));
          }).catch(() => {});
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return; // navigated away — ignore silently
        setError(err.message || 'Failed to load album. Please try again.');
        setIsLoading(false);
      });

    return () => {
      abortControllerRef.current?.abort();
    };
  }, [id]);

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <div className="page-placeholder">
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              <FaChevronLeft className="h-3 w-3" />
              <span>Album Page</span>
            </button>
          </div>
          <div className="flex gap-5 items-start">
            <div className="flex-1 min-w-0">
              <SkeletonAlbumDetails />
            </div>
            <Sidebar />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="page-placeholder">
        <div className="max-w-5xl mx-auto px-4 pb-10">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
            >
              <FaChevronLeft className="h-3 w-3" />
              <span>Album Page</span>
            </button>
          </div>
          <ErrorMessage message={error} />
        </div>
        <Footer />
      </div>
    );
  }

  /* ── Album not found (null after load) ── */
  if (!album) {
    return (
      <div className="page-placeholder min-h-[80vh] flex flex-col items-center justify-center gap-4 text-center px-6">
        <p className="text-5xl">🎵</p>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Album Not Found</h2>
        <p className="text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">We couldn't find an album with that ID.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-2 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-black text-sm font-bold px-6 py-2"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ── Loaded album ── */
  const favorited = isFavorite(album.id);

  return (
    <div className="page-placeholder">
      <div className="max-w-5xl mx-auto px-4 pb-10">

        <div className="flex items-center justify-between py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300"
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
              <div className="absolute inset-0 bg-black/40 pointer-events-none" />
              <div className="relative flex gap-5 items-start">
                <div className="w-28 h-28 rounded-xl bg-black/30 shrink-0 overflow-hidden shadow-lg">
                  {album.image ? (
                    <img
                      src={album.image}
                      alt={`${album.title} cover`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl select-none">
                      🎤
                    </div>
                  )}
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
                      onClick={() => setShowCollectionModal(true)}
                      aria-label="Add to Collection"
                      className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-1.5 backdrop-blur-sm active:scale-95 transition-all duration-200"
                    >
                      <FaPlus className="h-3 w-3" />
                      Add to Collection
                    </button>

                    {album.link && (
                      <a
                        href={album.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-4 py-1.5 backdrop-blur-sm transition"
                      >
                        Open on Last.fm
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-white text-[10px] uppercase tracking-widest">Album</p>
                <h1 className="text-white font-extrabold text-3xl leading-tight drop-shadow-md">
                  {album.title}
                </h1>
              </div>
            </div>

            <div className="mt-7">
              <h3 className="text-gray-900 dark:text-white font-bold text-lg tracking-widest uppercase mb-3 px-3 transition-colors duration-300">
                Tracks
              </h3>
              <ul className="flex flex-col gap-0.5">
                {album.tracks.map((track) => (
                  <TrackRow key={track.id} track={track} />
                ))}
              </ul>
            </div>
            
            {(moreAlbums.length > 0 || similarArtists.length > 0) && (
              <div className="mt-12 space-y-10">
                {moreAlbums.length > 0 && (
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg tracking-widest uppercase mb-4 transition-colors duration-300">
                      More by {album.artist}
                    </h3>
                    <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6 snap-x snap-mandatory scroll-smooth">
                      {moreAlbums.map((a) => (
                        <div key={a.id} className="flex-none w-40 sm:w-44 lg:w-48 snap-start">
                          <AlbumCard album={a} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {similarArtists.length > 0 && (
                  <div>
                    <h3 className="text-gray-900 dark:text-white font-bold text-lg tracking-widest uppercase mb-4 transition-colors duration-300">
                      Similar Artists
                    </h3>
                    <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6 snap-x snap-mandatory scroll-smooth">
                      {similarArtists.map((artist) => (
                        <div
                          key={artist.id}
                          onClick={() => navigate(`/?search=${encodeURIComponent(artist.name)}`)}
                          className="flex-none flex flex-col items-center cursor-pointer group snap-start"
                        >
                          <div className="h-28 w-28 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-neutral-800 group-hover:ring-[#49ACC0] dark:group-hover:ring-[#49ACC0] transition-all duration-300">
                            {artist.image ? (
                              <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                                <span className="text-xl font-bold text-gray-500">{artist.name[0]}</span>
                              </div>
                            )}
                          </div>
                          <span className="mt-3 text-sm font-semibold text-gray-900 dark:text-white max-w-[112px] text-center truncate">
                            {artist.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <Sidebar />
        </div>
      </div>

      <Footer />

      <AddToCollectionModal
        album={album}
        isOpen={showCollectionModal}
        onClose={() => setShowCollectionModal(false)}
      />
    </div>
  );
}
