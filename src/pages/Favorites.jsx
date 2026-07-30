import { useFavorites } from '@/context/FavoritesContext';
import AlbumGrid from '@/components/album/AlbumGrid/AlbumGrid';
import Sidebar from '@/components/Sidebar/Sidebar';
import './PagePlaceholder.css';

function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-800 py-6 px-6 flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase">
      <span className="hover:text-white transition cursor-pointer">GitHub</span>
      <span>Powered By SpotifyAPI</span>
      <span className="hover:text-white transition cursor-pointer">LinkedIn</span>
    </footer>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <p className="text-5xl">🎵</p>
      <h2 className="text-xl font-bold text-white">No favorites yet</h2>
      <p className="text-sm text-neutral-400 max-w-xs">
        Browse albums and hit the heart icon to save them here.
      </p>
    </div>
  );
}

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="page-placeholder">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#49ACBF] via-[#1a4a52] to-[#0a1a1f] px-6 py-14 sm:px-10 rounded-lg">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-[#1ED760]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-[#49ACBF]/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-2">T</p>
          <h1 className="font-mono font-bold text-3xl sm:text-4xl text-white tracking-wide leading-tight mb-3">
            Find your favorites Here
          </h1>
          <p className="text-[#1ED760] font-mono text-sm sm:text-base">
            Your music taste?<br />Immaculate.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-10">
        <div className="flex gap-5 items-start">

          <div className="flex-1 min-w-0 pt-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-white">
                Albums
              </h2>
              {favorites.length > 0 && (
                <span className="text-sm text-neutral-400">
                  {favorites.length} {favorites.length === 1 ? 'Album' : 'Albums'}
                </span>
              )}
            </div>

            {favorites.length === 0 ? <EmptyState /> : <AlbumGrid albums={favorites} />}
          </div>

          <Sidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
}