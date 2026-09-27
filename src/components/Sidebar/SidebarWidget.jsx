import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from '@/context/HistoryContext';
import { getTrendingArtists } from '@/services/lastfmApi';
import { getHiddenGems } from '@/services/recommendationEngine';

export default function SidebarWidget() {
  const { recentlyViewed } = useHistory();
  const [trending, setTrending] = useState([]);
  const [gems, setGems] = useState([]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    
    // Fetch some trending and gems for the widget
    Promise.all([
      getTrendingArtists(controller.signal),
      getHiddenGems(controller.signal)
    ]).then(([trendData, gemsData]) => {
      setTrending(trendData.slice(0, 5));
      setGems(gemsData.slice(0, 5));
    }).catch(() => {});

    return () => controller.abort();
  }, []);

  // Determine what panels to show
  const panels = [];

  if (recentlyViewed && recentlyViewed.length > 0) {
    panels.push({
      type: 'History',
      title: 'Recently Viewed',
      subtitle: recentlyViewed[0].artist,
      item: recentlyViewed[0].title,
      image: recentlyViewed[0].image,
      link: `/album/${recentlyViewed[0].id}`
    });
  }

  if (trending.length > 0) {
    const artist = trending[Math.floor(Math.random() * trending.length)];
    panels.push({
      type: 'Trending',
      title: 'Trending Artist',
      subtitle: 'Worldwide',
      item: artist.name,
      image: artist.image,
      link: `/?search=${encodeURIComponent(artist.name)}`
    });
  }

  if (gems.length > 0) {
    const gem = gems[Math.floor(Math.random() * gems.length)];
    panels.push({
      type: 'Recommendation',
      title: 'Album of the Day',
      subtitle: gem.artist,
      item: gem.title,
      image: gem.image,
      link: `/album/${gem.id}`
    });
  }

  // Rotate every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1));
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Fallback if nothing loaded yet
  if (panels.length === 0) {
    return (
      <div className="rounded-[1.5rem] bg-[#96c8c4] dark:bg-neutral-900 border-none p-5 flex flex-col gap-3 text-center mt-2 transition-colors duration-300 shadow-sm animate-pulse h-48"></div>
    );
  }

  const currentPanel = panels[currentIndex % panels.length];

  if (!currentPanel) return null;

  return (
    <Link
      to={currentPanel.link}
      className="relative block rounded-[1.5rem] bg-[#96c8c4] dark:bg-neutral-900 border-none p-5 flex flex-col items-center gap-3 text-center mt-2 transition-colors duration-300 shadow-sm overflow-hidden group hover:scale-[1.02] active:scale-95"
    >
      <div className="absolute inset-0 bg-black/10 dark:bg-black/40 pointer-events-none group-hover:bg-black/20 dark:group-hover:bg-black/50 transition-colors duration-300" />
      
      <p className="relative z-10 text-[10px] font-bold tracking-widest uppercase text-white/80 dark:text-neutral-400 mb-1">
        {currentPanel.title}
      </p>

      {currentPanel.image ? (
        <div className="relative z-10 w-20 h-20 rounded-full overflow-hidden ring-4 ring-white/20 dark:ring-black/40 shadow-lg group-hover:ring-white/40 dark:group-hover:ring-black/60 transition-all duration-300">
          <img src={currentPanel.image} alt={currentPanel.item} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="relative z-10 w-20 h-20 rounded-full bg-black/20 flex items-center justify-center text-3xl">
          🎵
        </div>
      )}

      <div className="relative z-10 w-full mb-1">
        <p className="text-gray-900 dark:text-white font-bold text-sm leading-tight truncate px-2">
          {currentPanel.item}
        </p>
        <p className="text-gray-700 dark:text-neutral-400 text-xs truncate mt-0.5 px-2">
          {currentPanel.subtitle}
        </p>
      </div>
    </Link>
  );
}
