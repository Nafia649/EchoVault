import { FiSearch } from 'react-icons/fi';

function SearchBar({ value, onChange, onSearch, placeholder }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch?.(value.trim());
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 py-2 pl-5 pr-2 focus-within:border-neutral-500"
    >
      <label htmlFor="artist-search-input" className="sr-only">
        Search artists
      </label>

      <FiSearch
        className="h-4 w-4 shrink-0 text-neutral-500"
        aria-hidden="true"
      />

      <input
        id="artist-search-input"
        type="search"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 bg-transparent text-sm text-white placeholder-neutral-500 outline-none sm:text-base"
      />

      <button
        type="submit"
        aria-label="Search"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-black transition hover:bg-neutral-200 active:scale-95"
      >
        <FiSearch className="h-4 w-4" aria-hidden="true" />
      </button>
    </form>
  );
}

export default SearchBar;
