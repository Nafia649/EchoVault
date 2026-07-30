import { FiSearch } from 'react-icons/fi';

function SearchSection({ searchQuery, setSearchQuery }) {
  return (
    <section className="relative overflow-hidden bg-black px-4 py-16 sm:py-20 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-8 h-64 w-full max-w-3xl -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center text-center">
        <h1 className="font-mono text-3xl font-bold uppercase tracking-widest text-white sm:text-4xl md:text-5xl">
          Discover Artists
        </h1>

        <p className="mt-4 max-w-xl text-sm text-neutral-400 sm:text-base">
          Search millions of albums from your favorite artists.
        </p>

        <div className="mt-8 w-full max-w-xl">
          <div className="flex w-full items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 py-2 pl-5 pr-4 focus-within:border-neutral-500">
            <FiSearch
              className="h-4 w-4 shrink-0 text-neutral-500"
              aria-hidden="true"
            />
            <label htmlFor="search-input" className="sr-only">
              Search albums and artists
            </label>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. Sabrina Carpenter"
              className="w-full min-w-0 bg-transparent text-sm text-white placeholder-neutral-500 outline-none sm:text-base"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchSection;