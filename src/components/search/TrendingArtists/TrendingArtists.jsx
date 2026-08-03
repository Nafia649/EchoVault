import { useState, useEffect, useRef } from 'react';
import { getTrendingArtists } from '@/services/lastfmApi';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const FALLBACK_GRADIENTS = [
  'bg-gradient-to-br from-indigo-500 to-purple-500',
  'bg-gradient-to-br from-teal-500 to-emerald-500',
  'bg-gradient-to-br from-orange-500 to-red-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-pink-500 to-rose-500',
];

function TrendingArtists({ onArtistClick }) {
  const [artists, setArtists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    getTrendingArtists(controller.signal)
      .then((data) => {
        setArtists(data);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
          setIsLoading(false);
        }
      });

    return () => abortControllerRef.current?.abort();
  }, []);
  if (isLoading) {
    return (
      <section className="bg-[#F3F4F6] dark:bg-black px-4 py-10 sm:px-6 sm:py-12 md:px-10 transition-colors duration-300">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[2rem] border-none bg-[#9ac7d5] dark:bg-[#121212] p-8 shadow-sm dark:shadow-[0_0_35px_rgba(73,172,192,0.12)] transition-colors duration-300">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
                 <div className="h-3 w-32 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              </div>
              <div className="flex items-center justify-between">
                <div className="h-8 w-64 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              </div>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(5)].map((_, i) => (
                <li key={i} className="flex flex-col items-center text-center animate-pulse">
                  <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-neutral-800"></div>
                  <div className="mt-4 h-3 w-20 rounded bg-gray-200 dark:bg-neutral-800"></div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    );
  }

  if (artists.length === 0) return null;

  return (
    <section className="bg-[#F3F4F6] dark:bg-black px-4 py-10 sm:px-6 sm:py-12 md:px-10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">
        {/* Background Panel */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            border-none
            bg-[#9ac7d5] dark:bg-[#121212]
            p-8 sm:p-10
            shadow-sm dark:shadow-[0_0_35px_rgba(73,172,192,0.12)]
            transition-colors duration-300
          "
        >
          {/* Background Glow */}
          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,rgba(73,172,192,0.05),transparent_70%)]
              dark:bg-[radial-gradient(circle_at_center,rgba(73,172,192,0.18),transparent_70%)]
              pointer-events-none
              transition-colors duration-300
            "
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Heading Section */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
                  LIVE • Updated from Last.fm
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300 sm:text-2xl">
                  Trending Worldwide
                </h2>

                {artists.length > 5 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm font-semibold text-gray-700 dark:text-gray-400 transition-colors hover:text-gray-900 dark:hover:text-white duration-300"
                  >
                    {isExpanded ? 'Show less' : 'Show all'}
                  </button>
                )}
              </div>
            </div>

            {/* Artist Grid */}
            <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {(isExpanded ? artists : artists.slice(0, 5)).map((artist, index) => {
                const gradient = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];
                
                return (
                  <li
                    key={artist.id}
                    onClick={() => {
                      if (onArtistClick) {
                        onArtistClick(artist.name);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className="group flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]"
                  >
                    <div
                      aria-label={`Search albums for ${artist.name}`}
                      className={`
                        relative
                        h-32
                        w-32
                        rounded-full
                        ring-4
                        ring-white/40 dark:ring-neutral-800
                        shadow-md
                        transition-all
                        duration-300
                        group-hover:ring-[#49ACC0] dark:group-hover:ring-[#49ACC0]
                        group-hover:shadow-[0_0_20px_rgba(73,172,192,0.35)]
                        overflow-hidden
                        ${!artist.image ? gradient : 'bg-gray-100 dark:bg-neutral-800'}
                      `}
                >
                  {artist.image ? (
                    <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-3xl drop-shadow-md">
                      {getInitials(artist.name)}
                    </span>
                  )}
                </div>

                <span className="mt-4 max-w-[120px] text-sm font-semibold text-gray-900 dark:text-white transition-colors duration-300 line-clamp-2">
                  {artist.name}
                </span>

                <span className="mt-1 text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-colors duration-300">
                  {artist.role}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  </div>
</section>
  );
}
export default TrendingArtists;
