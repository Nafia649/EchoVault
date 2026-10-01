import AlbumGrid from '../AlbumGrid/AlbumGrid';
import EmptyState from './EmptyState';

function AlbumSection({ title, albums = [], searchQuery = '', page, setPage, totalPages, totalAlbums, isFiltered = false, onClearFilters }) {
  const isSearching = searchQuery.trim().length > 0;
  const displayTitle = title || (isSearching ? 'Search Results' : 'Featured Albums');
  const showFilteredEmpty = isFiltered && albums.length === 0;

  return (
    <section className="">
      <div className="mx-auto w-full">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-mono text-lg font-bold uppercase tracking-widest text-gray-900 dark:text-white transition-colors duration-300 sm:text-xl">
              {displayTitle}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">
              Showing {totalAlbums} {totalAlbums === 1 ? 'album' : 'albums'}
            </p>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 transition-colors duration-300 hover:border-gray-400 dark:hover:border-neutral-500 hover:text-gray-900 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                ‹
              </button>
              <span className="text-xs text-gray-500 dark:text-neutral-500 transition-colors duration-300">
                {page + 1} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 transition-colors duration-300 hover:border-gray-400 dark:hover:border-neutral-500 hover:text-gray-900 dark:hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>

        {albums.length === 0 ? (
          <EmptyState isFiltered={showFilteredEmpty} onClearFilters={onClearFilters} />
        ) : (
          <AlbumGrid albums={albums} />
        )}
      </div>
    </section>
  );
}

export default AlbumSection;
