import { useState, useMemo } from 'react';

import SearchSection from '@/components/search/SearchSection/SearchSection';
import AlbumSection from '@/components/album/AlbumSection/AlbumSection';
import TrendingArtists from '@/components/search/TrendingArtists/TrendingArtists';
import { featuredAlbums, allAlbums } from '@/data/mockAlbums';
import Sidebar from '@/components/Sidebar/Sidebar';
import Footer from '@/components/Footer';
import './PagePlaceholder.css';

const PAGE_SIZE = 5;

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);

  const filteredAlbums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return featuredAlbums;
    return allAlbums.filter(
      (album) =>
        album.title.toLowerCase().includes(q) ||
        album.artist.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredAlbums.length / PAGE_SIZE);
  const paginatedAlbums = filteredAlbums.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="page-placeholder">
      <div className="max-w-5xl mx-auto px-4 flex gap-5 items-start rounded-lg sm:px-6 md:px-10 rounded-lg">
        {/* ── Main content ── */}

        <div className="flex-1 min-w-0">
          <SearchSection
            searchQuery={searchQuery}
            setSearchQuery={(q) => { setSearchQuery(q); setPage(0); }}
          />
          <AlbumSection
            searchQuery={searchQuery}
            albums={paginatedAlbums}
            page={page}
            setPage={setPage}
            totalPages={totalPages}
            totalAlbums={filteredAlbums.length}
          />

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