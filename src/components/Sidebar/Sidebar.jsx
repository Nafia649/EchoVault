function Sidebar({
  filterOption,
  sortOption,
  onFilterChange,
  onSortChange,
  onClearFilters
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-5 w-52 shrink-0 pt-16">
      {/* Filter | Sort Controls */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="filter-select" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Filter
          </label>
          <select
            id="filter-select"
            value={filterOption || ''}
            onChange={(e) => onFilterChange?.(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-sm text-white rounded-lg p-2 outline-none focus:border-neutral-600 transition"
          >
            <option value="All Albums">All Albums</option>
            <option value="Favorites">Favorites</option>
            <option value="Has Album Cover">Has Album Cover</option>
            <option value="Has Last.fm Link">Has Last.fm Link</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sort-select" className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Sort
          </label>
          <select
            id="sort-select"
            value={sortOption || ''}
            onChange={(e) => onSortChange?.(e.target.value)}
            className="bg-neutral-900 border border-neutral-800 text-sm text-white rounded-lg p-2 outline-none focus:border-neutral-600 transition"
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
          className="text-xs text-neutral-500 hover:text-white text-left transition underline decoration-transparent hover:decoration-white underline-offset-2 mt-1"
        >
          Clear Filters
        </button>
      </div>

      {/* Last.fm promo card */}
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-5 flex flex-col gap-3 text-center mt-2">
        <p className="text-white font-bold text-base leading-snug">
          Discover More
        </p>
        <p className="text-neutral-400 text-xs">
          Explore artists, albums and music trends on Last.fm.
        </p>
        <a
          href="https://www.last.fm/"
          target="_blank"
          rel="noreferrer"
          className="block rounded-full bg-red-500 hover:bg-red-400 active:scale-95 transition text-white text-xs font-bold py-2 px-3 mt-1"
        >
          Visit Last.fm ↗
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;

