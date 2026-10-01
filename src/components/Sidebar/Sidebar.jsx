import SidebarWidget from './SidebarWidget';

function Sidebar({
  filterOption,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters,
  hideFilter
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-5 w-52 shrink-0 pt-16">
      {/* Filter | Sort Controls */}
      <div className="flex flex-col gap-3">
        {!hideFilter && (
          <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-select" className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider transition-colors duration-300">
            Filter
          </label>
          <select
            id="filter-select"
            value={filterOption || ''}
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="bg-[#649495] dark:bg-neutral-900 border-none text-sm text-white rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-neutral-600 transition-colors duration-300 shadow-sm"
          >
            <option value="All Albums">All Albums</option>
            <option value="Favorites">Favorites</option>
            <option value="Has Album Cover">Has Album Cover</option>
            <option value="Has Last.fm Link">Has Last.fm Link</option>
          </select>
        </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sort-select" className="text-xs font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider transition-colors duration-300">
            Sort
          </label>
          <select
            id="sort-select"
            value={sortOption || ''}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="bg-[#649495] dark:bg-neutral-900 border-none text-sm text-white rounded-lg p-2 outline-none focus:ring-2 focus:ring-teal-500 dark:focus:ring-neutral-600 transition-colors duration-300 shadow-sm"
          >
            <option value="Alphabetical (A–Z)">Alphabetical (A–Z)</option>
            <option value="Alphabetical (Z–A)">Alphabetical (Z–A)</option>
            <option value="Artist (A–Z)">Artist (A–Z)</option>
            <option value="Artist (Z–A)">Artist (Z–A)</option>
            <option value="Newest Release">Newest Release</option>
            <option value="Oldest Release">Oldest Release</option>
          </select>
        </div>

        <button
          onClick={onClearFilters}
          className="text-xs text-gray-500 hover:text-gray-900 dark:text-neutral-500 dark:hover:text-white text-left transition-colors duration-300 underline decoration-transparent hover:decoration-gray-900 dark:hover:decoration-white underline-offset-2 mt-1"
        >
          Clear Filters
        </button>
      </div>

      {/* Dynamic Widget */}
      <SidebarWidget />
      
      {/* Last.fm Promo */}
      <div className="rounded-[1.5rem] bg-[#96c8c4] dark:bg-neutral-900 border-none p-5 flex flex-col gap-3 text-center mt-2 transition-colors duration-300 shadow-sm">
        <p className="text-gray-900 dark:text-white font-bold text-sm leading-snug transition-colors duration-300">
          If you don't have Last.fm
        </p>
        <p className="text-gray-700 dark:text-neutral-400 text-[11px] transition-colors duration-300">
          Download it now to track your listening history and get more personalized recommendations.
        </p>
        <a
          href="https://www.last.fm/about/trackmymusic"
          target="_blank"
          rel="noreferrer"
          className="block rounded-full bg-rose-500 hover:bg-rose-600 active:scale-95 transition text-white text-xs font-bold py-2.5 px-3 mt-1 shadow-sm"
        >
          Download Now ↗
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;

