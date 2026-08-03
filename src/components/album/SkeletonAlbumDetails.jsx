/**
 * SkeletonAlbumDetails
 *
 * Decorative loading placeholder that mirrors AlbumDetails.jsx layout exactly.
 * aria-hidden on the top-level <div> is sufficient — no children repeat it.
 * animate-pulse is hoisted to two logical section wrappers (hero, track list)
 * so all elements within each section pulse together as one unit.
 * min-h-[220px] used as a Tailwind arbitrary value instead of an inline style.
 *
 * Mirrors from AlbumDetails.jsx:
 *  Hero wrapper:    relative rounded-2xl overflow-hidden p-6, min-h-[220px]
 *  Cover box:       w-28 h-28 rounded-xl shrink-0
 *  Info col:        flex flex-col gap-1 pt-1
 *  Artist:          text-xl  → h-6 bar
 *  Year/Songs/Dur:  text-sm  → h-4 bars
 *  Buttons:         rounded-full px-4 py-1.5 text-xs → h-7 w-36
 *  Album label:     text-[10px] uppercase tracking-widest → h-2.5 bar
 *  Album title h1:  text-3xl font-extrabold → h-9 bar
 *  Section gap:     mt-6
 *
 *  TrackRow <li>:   flex items-center gap-3 px-3 py-2.5 rounded-lg
 *  Number:          w-5 shrink-0 text-xs → w-5 h-3.5
 *  Title:           text-sm → h-3.5 w-2/5
 *  Artist:          text-xs → h-3 w-1/4
 *  Duration:        text-xs w-9 shrink-0 → w-9 h-3
 *  Track list gap:  flex flex-col gap-0.5
 */

const TRACK_PLACEHOLDER_COUNT = 8;

function SkeletonTrackRow() {
  return (
    /* Mirrors: flex items-center gap-3 px-3 py-2.5 rounded-lg */
    <li className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
      {/* Track number — w-5 shrink-0 text-xs */}
      <div className="w-5 h-3.5 shrink-0 rounded bg-gray-200 dark:bg-neutral-800/70 transition-colors duration-300" />

      {/* Title + artist — flex-1 min-w-0 */}
      <div className="flex-1 min-w-0 flex flex-col gap-1.5">
        {/* Title — text-sm font-semibold */}
        <div className="h-3.5 w-2/5 rounded bg-gray-300 dark:bg-neutral-800 transition-colors duration-300" />
        {/* Artist — text-xs text-neutral-500 */}
        <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-neutral-800/60 transition-colors duration-300" />
      </div>

      {/* Duration — text-xs w-9 shrink-0 text-right */}
      <div className="w-9 h-3 shrink-0 rounded bg-gray-200 dark:bg-neutral-800/60 transition-colors duration-300" />
    </li>
  );
}

export default function SkeletonAlbumDetails() {
  return (
    <div aria-hidden="true">
      {/* ── Hero Banner ────────────────────────────────────────────────────
          animate-pulse hoisted here so cover, info, buttons and title all
          pulse together as one logical section.
          min-h-[220px] uses Tailwind arbitrary value (consistent with project).
      ──────────────────────────────────────────────────────────────────── */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100 dark:bg-neutral-900 p-6 min-h-[220px] animate-pulse transition-colors duration-300">
        {/* Inner flex row — mirrors: flex gap-5 items-start */}
        <div className="flex gap-5 items-start">
          {/* Cover art — w-28 h-28 rounded-xl bg-black/30 shrink-0 shadow-lg */}
          <div className="w-28 h-28 rounded-xl bg-gray-200 dark:bg-neutral-800 shrink-0 transition-colors duration-300" />

          {/* Info column — flex flex-col gap-1 pt-1 */}
          <div className="flex flex-col gap-1 pt-1">
            {/* Artist name — text-xl font-bold (h2) */}
            <div className="h-6 w-40 rounded bg-gray-300 dark:bg-neutral-700 transition-colors duration-300" />

            {/* Year — text-sm text-white/70 */}
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-neutral-700/70 transition-colors duration-300" />

            {/* Songs count — text-sm text-white/70 */}
            <div className="h-4 w-20 rounded bg-gray-200 dark:bg-neutral-700/70 transition-colors duration-300" />

            {/* Duration — text-sm text-white/70 */}
            <div className="h-4 w-28 rounded bg-gray-200 dark:bg-neutral-700/70 transition-colors duration-300" />

            {/* Action buttons — flex flex-wrap gap-2 mt-3 */}
            <div className="flex flex-wrap gap-2 mt-3">
              {/* Favorite button — rounded-full px-4 py-1.5 text-xs */}
              <div className="h-7 w-36 rounded-full bg-gray-300 dark:bg-neutral-700 transition-colors duration-300" />
              {/* Last.fm button — same sizing, lower opacity */}
              <div className="h-7 w-32 rounded-full bg-gray-200 dark:bg-neutral-700/30 transition-colors duration-300" />
            </div>
          </div>
        </div>

        {/* Album label + title — mt-6 */}
        <div className="mt-6">
          {/* "Album" label — text-[10px] uppercase tracking-widest */}
          <div className="h-2.5 w-10 rounded bg-gray-200 dark:bg-neutral-700/60 mb-2 transition-colors duration-300" />
          {/* Album title — text-3xl font-extrabold (h1) */}
          <div className="h-9 w-64 rounded bg-gray-300 dark:bg-neutral-700 transition-colors duration-300" />
        </div>
      </div>

      {/* ── Track List ─────────────────────────────────────────────────────
          animate-pulse hoisted here so heading and all rows pulse together.
      ──────────────────────────────────────────────────────────────────── */}
      <div className="mt-7 animate-pulse">
        {/* "Tracks" heading — text-lg tracking-widest uppercase mb-3 px-3 */}
        <div className="h-5 w-20 rounded bg-gray-300 dark:bg-neutral-800 mb-3 mx-3 transition-colors duration-300" />

        {/* Track rows — flex flex-col gap-0.5 */}
        <ul className="flex flex-col gap-0.5">
          {Array.from({ length: TRACK_PLACEHOLDER_COUNT }).map((_, i) => (
            <SkeletonTrackRow key={i} />
          ))}
        </ul>
      </div>
    </div>
  );
}
