/**
 * SkeletonAlbumCard
 *
 * Decorative loading placeholder that mirrors AlbumGrid's layout exactly.
 * aria-hidden on the parent <ul> is sufficient — child <li>s do not repeat it.
 * animate-pulse is hoisted to each <li> so all placeholder elements within a
 * card pulse together as one unit.
 *
 * Matches from AlbumGrid.jsx:
 *  - Grid:   mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
 *  - Card:   relative aspect-square w-full overflow-hidden rounded-2xl
 *  - Heart:  absolute top-3 right-3 h-9 w-9 rounded-full
 *  - Bottom: absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3
 *  - Title:  text-base  → h-4 bar
 *  - Artist: text-sm  → h-3.5 bar
 *  - Play:   h-11 w-11 rounded-full shrink-0
 */

const CARD_PLACEHOLDER_COUNT = 5;

function SkeletonCard() {
  return (
    <li className="relative aspect-square w-full overflow-hidden rounded-2xl bg-neutral-900 animate-pulse">
      {/* Cover fill — mirrors absolute inset-0 image / gradient layer */}
      <div className="absolute inset-0 bg-neutral-800/60" />

      {/* Bottom-to-top fade — mirrors `bg-gradient-to-t from-black/80 via-black/10 to-transparent` */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      {/* Favorite button — absolute top-3 right-3 h-9 w-9 rounded-full */}
      <div className="absolute top-3 right-3 h-9 w-9 rounded-full bg-neutral-700/60" />

      {/* Bottom content row — absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3 */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          {/* Title — text-base font-bold */}
          <div className="h-4 w-3/4 rounded bg-neutral-700/80" />
          {/* Artist — text-sm */}
          <div className="h-3.5 w-1/2 rounded bg-neutral-700/50" />
        </div>

        {/* Play button — h-11 w-11 rounded-full shrink-0 */}
        <div className="shrink-0 h-11 w-11 rounded-full bg-neutral-700/60" />
      </div>
    </li>
  );
}

export default function SkeletonAlbumCard({ count = CARD_PLACEHOLDER_COUNT }) {
  return (
    <ul
      className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </ul>
  );
}
