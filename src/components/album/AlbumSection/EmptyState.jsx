import { FaMusic } from 'react-icons/fa';

function EmptyState({ isFiltered, onClearFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 shadow-inner">
        <FaMusic className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-xl font-bold text-white">
        {isFiltered ? 'No albums match your current filters.' : 'No results found'}
      </h3>
      <p className="max-w-sm text-sm text-neutral-400">
        {isFiltered 
          ? "Try changing the filters or clearing them."
          : "We couldn't find any albums matching your search. Try checking your spelling or using different keywords."}
      </p>
      {isFiltered && onClearFilters && (
        <button 
          onClick={onClearFilters}
          className="mt-6 rounded-full bg-white text-black px-6 py-2 text-sm font-bold hover:bg-neutral-200 transition active:scale-95"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;