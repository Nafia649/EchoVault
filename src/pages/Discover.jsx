import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import { AlbumCard } from '@/components/album/AlbumGrid/AlbumGrid';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';
import { getTrendingArtists } from '@/services/lastfmApi';
import { getRecommendedForYou, getArtistsYouMayLike, getHiddenGems } from '@/services/recommendationEngine';

import { useFilterSort } from '@/hooks/useFilterSort';

function ArtistScroller({ artists, title, onArtistClick }) {
  if (!artists || artists.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300">
          {title}
        </h2>
      </div>
      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6 snap-x snap-mandatory scroll-smooth">
        {artists.map((artist) => (
          <div
            key={artist.id}
            onClick={() => onArtistClick(artist.name)}
            className="flex-none flex flex-col items-center cursor-pointer group snap-start"
          >
            <div className="h-32 w-32 rounded-full overflow-hidden ring-2 ring-gray-200 dark:ring-neutral-800 group-hover:ring-[#49ACC0] dark:group-hover:ring-[#49ACC0] transition-all duration-300">
              {artist.image ? (
                <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-500">{artist.name[0]}</span>
                </div>
              )}
            </div>
            <span className="mt-3 text-sm font-semibold text-gray-900 dark:text-white max-w-[128px] text-center truncate">
              {artist.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlbumScroller({ albums, title }) {
  if (!albums || albums.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-mono text-xl font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300">
          {title}
        </h2>
      </div>
      <div className="flex overflow-x-auto pb-4 hide-scrollbar gap-6 snap-x snap-mandatory scroll-smooth">
        {albums.map((album) => (
          <div key={album.id} className="flex-none w-40 sm:w-44 lg:w-48 snap-start">
            <AlbumCard album={album} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Discover() {
  const navigate = useNavigate();
  const { favorites } = useFavorites();
  const { recentlyViewed } = useHistory();
  
  const {
    filterOption, setFilterOption,
    sortOption, setSortOption,
    handleClearFilters,
    processItems
  } = useFilterSort();

  const [recommended, setRecommended] = useState([]);
  const [similarArtists, setSimilarArtists] = useState([]);
  const [trending, setTrending] = useState([]);
  const [hiddenGems, setHiddenGems] = useState([]);
  const [isLoadingRec, setIsLoadingRec] = useState(true);
  const [isLoadingSim, setIsLoadingSim] = useState(true);
  const [isLoadingTrend, setIsLoadingTrend] = useState(true);
  const [isLoadingGems, setIsLoadingGems] = useState(true);

  const abortControllerRef = useRef(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoadingRec(true);
    setIsLoadingSim(true);
    setIsLoadingTrend(true);
    setIsLoadingGems(true);

    getRecommendedForYou(favorites, recentlyViewed, controller.signal)
      .then(data => { setRecommended(data); setIsLoadingRec(false); })
      .catch((err) => { if (err.name !== 'AbortError') setIsLoadingRec(false); });

    getArtistsYouMayLike(favorites, recentlyViewed, controller.signal)
      .then(data => { setSimilarArtists(data); setIsLoadingSim(false); })
      .catch((err) => { if (err.name !== 'AbortError') setIsLoadingSim(false); });

    getTrendingArtists(controller.signal)
      .then(data => { setTrending(data); setIsLoadingTrend(false); })
      .catch((err) => { if (err.name !== 'AbortError') setIsLoadingTrend(false); });

    getHiddenGems(controller.signal)
      .then(data => { setHiddenGems(data); setIsLoadingGems(false); })
      .catch((err) => { if (err.name !== 'AbortError') setIsLoadingGems(false); });

    return () => abortControllerRef.current?.abort();
  }, [favorites, recentlyViewed]);

  const handleArtistClick = (artistName) => {
    navigate(`/?search=${encodeURIComponent(artistName)}`);
  };

  return (
    <div className="page-placeholder">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#F97316] via-[#E11D48] to-[#7C3AED] px-6 py-14 sm:px-10 rounded-lg">
        <div className="pointer-events-none absolute -top-16 -left-16 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-rose-400/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto">
          <p className="text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Explore</p>
          <h1 className="font-mono font-bold text-3xl sm:text-4xl text-white tracking-wide leading-tight mb-3">
            Discover
          </h1>
          <p className="text-orange-200 font-mono text-sm sm:text-base">
            Personalized recommendations<br />and trending hits.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 pb-10">
        <div className="flex gap-8 items-start">
          <div className="flex-1 min-w-0 pt-8">

          <div className="flex flex-col">
            {isLoadingRec ? (
              <div className="h-48 w-full bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-2xl mb-12"></div>
            ) : recommended.length > 0 ? (
              <AlbumScroller title="Recommended For You" albums={processItems(recommended)} />
            ) : (
              <div className="mb-12 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Start discovering music</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Add a few favorites or explore Trending Worldwide to personalize your recommendations.</p>
              </div>
            )}
            
            {recentlyViewed.length > 0 && <AlbumScroller title="Recently Viewed" albums={processItems(recentlyViewed)} />}
            
            {isLoadingSim ? null : (
              <ArtistScroller 
                title="Artists You May Like" 
                artists={processItems(similarArtists)} 
                onArtistClick={handleArtistClick} 
              />
            )}
            
            {isLoadingTrend ? null : (
              <ArtistScroller 
                title="Trending Worldwide" 
                artists={processItems(trending)} 
                onArtistClick={handleArtistClick} 
              />
            )}
            
            {isLoadingGems ? null : (
              <AlbumScroller title="Hidden Gems" albums={processItems(hiddenGems)} />
            )}
          </div>

        </div>

        <div className="hidden lg:block">
          <Sidebar 
            hideFilter
            hideSort
            filterOption={filterOption}
            sortOption={sortOption}
            onFilterChange={setFilterOption}
            onSortChange={setSortOption}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
