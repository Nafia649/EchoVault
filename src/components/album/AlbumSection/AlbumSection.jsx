import AlbumGrid from '../AlbumGrid/AlbumGrid';
import EmptyState from './EmptyState';

function AlbumSection({ title, albums = [], searchQuery = '', page, setPage, totalPages, totalAlbums, onClearFilters }) {
  const isSearching = searchQuery.trim().length > 0;
  const displayTitle = title || (isSearching ? 'Search Results' : 'Featured Albums');
  const isFilteredEmpty = totalAlbums > 0 && albums.length === 0;

  return (
    <section className="">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-white sm:text-xl">
              {displayTitle}
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Showing {totalAlbums} {totalAlbums === 1 ? 'album' : 'albums'}
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition hover:border-neutral-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className="text-xs text-neutral-500">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-neutral-700 text-neutral-400 transition hover:border-neutral-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {albums.length === 0 ? (
          <EmptyState isFiltered={isFilteredEmpty} onClearFilters={onClearFilters} />
        ) : (
          <AlbumGrid albums={albums} />
        )}
      </div>
    </section>
  );
}

export default AlbumSection;