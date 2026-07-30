import { useState, useEffect, useRef } from 'react';

import SearchSection from '@/components/search/SearchSection/SearchSection';
import AlbumSection from '@/components/album/AlbumSection/AlbumSection';
import TrendingArtists from '@/components/search/TrendingArtists/TrendingArtists';
import SkeletonAlbumCard from '@/components/album/SkeletonAlbumCard';
import ErrorMessage from '@/components/ErrorMessage';
import { featuredAlbums } from '@/data/mockAlbums';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import { searchSpotifyAlbums } from '@/services/spotifyApi';
import './PagePlaceholder.css';

const PAGE_SIZE = 5;
const DEBOUNCE_MS = 350;

// Matches AlbumSection's outer section classes so the skeleton and error
// sections are visually flush with the real AlbumSection wrapper.
const SECTION_CLS = 'bg-black px-4 py-10 sm:px-6 sm:py-12 md:px-10';
const INNER_CLS   = 'mx-auto max-w-6xl';
const HEADING_CLS = 'font-mono text-lg font-bold uppercase tracking-widest text-white sm:text-xl';

function Home() {
  const [searchQuery, setSearchQuery]     = useState('');
  const [page, setPage]                   = useState(0);
  const [spotifyResults, setSpotifyResults] = useState([]);
  const [isLoading, setIsLoading]         = useState(false);
  const [error, setError]                 = useState(null);

  // Holds the setTimeout ID so we can cancel it on each new keystroke.
  const debounceRef = useRef(null);
  // Holds the AbortController for the most recent in-flight request.
  const abortControllerRef = useRef(null);

  const isSearching = searchQuery.trim().length > 0;

  /* ── Debounced Spotify search ───────────────────────────────────────── */
  useEffect(() => {
    // Query cleared → abort any in-flight request and reset to featured albums.
    if (!searchQuery.trim()) {
      abortControllerRef.current?.abort();
      clearTimeout(debounceRef.current);
      setSpotifyResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    // Show skeleton immediately so the section height is reserved while
    // the debounce timer is pending.
    setIsLoading(true);
    setError(null);

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      // Cancel any previous in-flight request before starting a new one.
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        const results = await searchSpotifyAlbums(searchQuery.trim(), controller.signal);
        setSpotifyResults(results);
        setPage(0);
        setIsLoading(false);
      } catch (err) {
        // AbortError means a newer request superseded this one — ignore it
        // silently. Do NOT touch state so the new request's skeleton stays
        // visible and setIsLoading(false) runs only from the new request.
        if (err.name === 'AbortError') return;
        setError(err.message || 'Something went wrong. Please try again.');
        setSpotifyResults([]);
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    // Cleanup: cancel pending timer and any in-flight request on unmount
    // or before the next effect run. The resulting AbortError is caught
    // above and silently ignored.
    return () => {
      clearTimeout(debounceRef.current);
      abortControllerRef.current?.abort();
    };
  }, [searchQuery]);

  /* ── Album resolution ───────────────────────────────────────────────── */
  // Before any search: show featured mock albums.
  // After search: show live Spotify results (empty array while loading / on error).
  const displayAlbums = isSearching ? spotifyResults : featuredAlbums;

  const totalPages     = Math.ceil(displayAlbums.length / PAGE_SIZE);
  const paginatedAlbums = displayAlbums.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  function handleSetSearchQuery(q) {
    setSearchQuery(q);
    setPage(0);
  }

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <div className="page-placeholder">
      <div className="max-w-5xl mx-auto px-4 flex gap-5 items-start rounded-lg sm:px-6 md:px-10 rounded-lg">

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={handleSetSearchQuery}
          />

          {/*
            Three mutually exclusive states for the album area:
              1. isLoading  → skeleton (reserves layout space, no CLS)
              2. error      → error banner (query preserved, no stale results)
              3. default    → AlbumSection with real data (mock or Spotify)
          */}
          {isLoading ? (
            <section className={SECTION_CLS}>
              <div className={INNER_CLS}>
                <h2 className={HEADING_CLS}>Search Results</h2>
                <SkeletonAlbumCard count={PAGE_SIZE} />
              </div>
            </section>
          ) : error ? (
            <section className={SECTION_CLS}>
              <div className={INNER_CLS}>
                <h2 className={HEADING_CLS}>Search Results</h2>
                <ErrorMessage message={error} />
              </div>
            </section>
          ) : (
            <AlbumSection
              searchQuery={searchQuery}
              albums={paginatedAlbums}
              page={page}
              setPage={setPage}
              totalPages={totalPages}
              totalAlbums={displayAlbums.length}
            />
          )}

          <TrendingArtists />
        </div>

        {/* ── Sidebar ── */}
        <Sidebar />
      </div>

      <Footer />
    </div>
  );
}

export default Home;