function EmptyState({ message = 'No albums found' }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-700 py-16 text-center">
      <p className="text-base font-medium text-white">{message}</p>
      <p className="mt-1 text-sm text-neutral-500">
        Try searching for a different artist.
      </p>
    </div>
  );
}

export default EmptyState;