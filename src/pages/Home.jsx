import { useState, useEffect, useRef, useMemo } from 'react';

import SearchSection from '@/components/search/SearchSection/SearchSection';
import AlbumSection from '@/components/album/AlbumSection/AlbumSection';
import TrendingArtists from '@/components/search/TrendingArtists/TrendingArtists';
import SkeletonAlbumCard from '@/components/album/SkeletonAlbumCard';
import ErrorMessage from '@/components/ErrorMessage';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import { searchAlbums, getFeaturedAlbums } from '@/services/lastfmApi';
import { useFilterSort } from '@/hooks/useFilterSort';
import './PagePlaceholder.css';

import { useSearchParams } from 'react-router-dom';

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 350;

// Matches AlbumSection's outer section classes so the skeleton and error
// sections are visually flush with the real AlbumSection wrapper.
const SECTION_CLS = 'bg-[#F3F4F6] dark:bg-black transition-colors duration-300 py-10 sm:py-12';
const INNER_CLS   = 'mx-auto max-w-5xl';
const HEADING_CLS = 'font-mono text-lg font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300 sm:text-xl';

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery]   = useState(urlQuery);
  const [page, setPage]                 = useState(0);
  const [searchResults, setSearchResults] = useState([]);
  const [featuredAlbums, setFeaturedAlbums] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);
  const [error, setError]               = useState(null);
  const [lastSuccessfulQuery, setLastSuccessfulQuery] = useState('');

  const {
    filterOption, setFilterOption,
    sortOption, setSortOption,
    handleClearFilters,
    processItems
  } = useFilterSort();

  // Holds the setTimeout ID so we can cancel it on each new keystroke.
  const debounceRef = useRef(null);
  // Holds the AbortController for the most recent in-flight request.
  const abortControllerRef = useRef(null);
  // Tracks if we have already successfully loaded the initial featured albums.
  const hasFetchedFeatured = useRef(false);

  // Tracks the query we last initiated a search for to prevent infinite loops 
  // when searchResults triggers the effect.
  const lastSearchedQueryRef = useRef(null);

  const isSearching = searchQuery.trim().length > 0;

  /* ── Debounced Last.fm search & Featured Albums ─────────────────────── */
  useEffect(() => {
    // Query cleared → abort any in-flight request.
    if (!searchQuery.trim()) {
      abortControllerRef.current?.abort();
      clearTimeout(debounceRef.current);
      setError(null);
      lastSearchedQueryRef.current = null;
      
      // If we've already performed a successful search,
      // preserve those albums and don't touch featured state.
      if (lastSuccessfulQuery && searchResults.length > 0) {
        setIsLoading(false);
        return;
      }

      // Otherwise use Featured Albums.
      if (hasFetchedFeatured.current) {
        setIsLoading(false);
        return;
      }

      // Initial load: fetch real featured albums from Last.fm proxy
      setIsLoading(true);
      const controller = new AbortController();
      abortControllerRef.current = controller;

      getFeaturedAlbums(controller.signal)
        .then(albums => {
          hasFetchedFeatured.current = true;
          setFeaturedAlbums(albums);
          setIsLoading(false);
        })
        .catch(err => {
          if (err.name === 'AbortError') return;
          setError(err.message || 'Failed to load featured albums.');
          setIsLoading(false);
        });

      return;
    }

    if (lastSearchedQueryRef.current === searchQuery) {
      // The query hasn't changed, this effect run was triggered by searchResults or lastSuccessfulQuery changing.
      // Ignore to prevent infinite fetch loops.
      return;
    }
    lastSearchedQueryRef.current = searchQuery;

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
        const results = await searchAlbums(searchQuery.trim(), controller.signal);
        setSearchResults(results);
        if (results.length > 0) {
          setLastSuccessfulQuery(searchQuery.trim());
        }
        setPage(0);
        setIsLoading(false);
      } catch (err) {
        // AbortError means a newer request superseded this one — ignore it
        // silently. Do NOT touch state so the new request's skeleton stays
        // visible and setIsLoading(false) runs only from the new request.
        if (err.name === 'AbortError') return;
        setError(err.message || 'Something went wrong. Please try again.');
        setSearchResults([]);
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
  }, [searchQuery, lastSuccessfulQuery, searchResults]);

  /* ── Album resolution ───────────────────────────────────────────────── */
  // Before any search: show dynamic featured albums from Last.fm.
  // After search: show live Last.fm results (empty array while loading / on error).
  let rawDisplayAlbums;
  if (isSearching) {
    rawDisplayAlbums = searchResults;
  } else if (lastSuccessfulQuery && searchResults.length > 0) {
    rawDisplayAlbums = searchResults;
  } else {
    rawDisplayAlbums = featuredAlbums;
  }

  const displayAlbums = useMemo(() => processItems(rawDisplayAlbums), [rawDisplayAlbums, processItems]);

  const totalPages     = Math.ceil(displayAlbums.length / PAGE_SIZE);
  const paginatedAlbums = displayAlbums.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  useEffect(() => {
    setSearchQuery((prev) => {
      if (prev !== urlQuery) {
        setPage(0);
        return urlQuery;
      }
      return prev;
    });
  }, [urlQuery]);

  function handleSetSearchQuery(q) {
    setSearchQuery(q);
    setPage(0);
    
    // Sync the URL search parameter
    if (q) {
      setSearchParams({ search: q }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }

  const onClearFilters = () => {
    handleClearFilters();
    setPage(0);
  };

  /* ── Render ─────────────────────────────────────────────────────────── */
  let sectionTitle;
  if (isSearching) {
    sectionTitle = `Results for "${searchQuery.trim()}"`;
  } else if (lastSuccessfulQuery) {
    sectionTitle = `More Albums from ${lastSuccessfulQuery}`;
  } else {
    sectionTitle = "Featured Albums";
  }

  return (
    <div className="page-placeholder">
      <div className="max-w-7xl mx-auto px-4 flex gap-5 items-start rounded-lg sm:px-6 md:px-10 rounded-lg">

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={handleSetSearchQuery}
            searchResults={searchResults}
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
                <h2 className={HEADING_CLS}>{sectionTitle}</h2>
                <SkeletonAlbumCard count={PAGE_SIZE} />
              </div>
            </section>
          ) : error ? (
            <section className={SECTION_CLS}>
              <div className={INNER_CLS}>
                <h2 className={HEADING_CLS}>{sectionTitle}</h2>
                <ErrorMessage message={error} />
              </div>
            </section>
          ) : (
              <AlbumSection
                title={sectionTitle}
                albums={paginatedAlbums}
                searchQuery={searchQuery}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                totalAlbums={displayAlbums.length}
                isFiltered={filterOption !== 'All Albums' || sortOption !== 'Alphabetical (A–Z)'}
                onClearFilters={onClearFilters}
              />
          )}

          <TrendingArtists
            onArtistClick={handleSetSearchQuery}
          />
        </div>

        {/* ── Sidebar ── */}
        <Sidebar
          filterOption={filterOption}
          sortOption={sortOption}
          onFilterChange={(val) => { setFilterOption(val); setPage(0); }}
          onSortChange={(val) => { setSortOption(val); setPage(0); }}
          onClearFilters={onClearFilters}
        />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
