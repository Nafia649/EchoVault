import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronRight } from 'react-icons/fa';

import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import { AlbumCard } from '@/components/album/AlbumGrid/AlbumGrid';
import { useFavorites } from '../context/FavoritesContext';
import { useHistory } from '../context/HistoryContext';
import { getTrendingArtists } from '@/services/lastfmApi';
import { getRecommendedForYou, getArtistsYouMayLike, getHiddenGems } from '@/services/recommendationEngine';

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
      .catch(() => setIsLoadingRec(false));

    getArtistsYouMayLike(favorites, recentlyViewed, controller.signal)
      .then(data => { setSimilarArtists(data); setIsLoadingSim(false); })
      .catch(() => setIsLoadingSim(false));

    getTrendingArtists(controller.signal)
      .then(data => { setTrending(data); setIsLoadingTrend(false); })
      .catch(() => setIsLoadingTrend(false));

    getHiddenGems(controller.signal)
      .then(data => { setHiddenGems(data); setIsLoadingGems(false); })
      .catch(() => setIsLoadingGems(false));

    return () => abortControllerRef.current?.abort();
  }, [favorites, recentlyViewed]);

  const handleArtistClick = (artistName) => {
    navigate(`/?search=${encodeURIComponent(artistName)}`);
  };

  return (
    <div className="bg-[#F3F4F6] dark:bg-black min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-10 sm:py-12 flex gap-8 items-start">
        <div className="flex-1 min-w-0">
          
          <div className="mb-10">
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Discover</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Personalized recommendations and trending hits.</p>
          </div>

          <div className="flex flex-col">
            {isLoadingRec ? (
              <div className="h-48 w-full bg-gray-200 dark:bg-neutral-800 animate-pulse rounded-2xl mb-12"></div>
            ) : recommended.length > 0 ? (
              <AlbumScroller title="Recommended For You" albums={recommended} />
            ) : (
              <div className="mb-12 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-white/5">
                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Start discovering music</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Add a few favorites or explore Trending Worldwide to personalize your recommendations.</p>
              </div>
            )}
            
            {recentlyViewed.length > 0 && <AlbumScroller title="Recently Viewed" albums={recentlyViewed} />}
            
            {isLoadingSim ? null : (
              <ArtistScroller 
                title="Artists You May Like" 
                artists={similarArtists} 
                onArtistClick={handleArtistClick} 
              />
            )}
            
            {isLoadingTrend ? null : (
              <ArtistScroller 
                title="Trending Worldwide" 
                artists={trending} 
                onArtistClick={handleArtistClick} 
              />
            )}
            
            {isLoadingGems ? null : (
              <AlbumScroller title="Hidden Gems" albums={hiddenGems} />
            )}
          </div>

        </div>

        <div className="hidden lg:block">
          <Sidebar />
        </div>
      </div>
      <Footer />
    </div>
  );
}
