const defaultArtists = [
  { id: 'arijit-singh', name: 'Arijit Singh', role: 'Artist', color: 'bg-amber-700' },
  { id: 'yo-yo-honey-singh', name: 'Yo Yo Honey Singh', role: 'Artist', color: 'bg-amber-600' },
  { id: 'udit-narayan', name: 'Udit Narayan', role: 'Artist', color: 'bg-indigo-800' },
  { id: 'atif-aslam', name: 'Atif Aslam', role: 'Artist', color: 'bg-neutral-700' },
  { id: 'anirudh-ravichander', name: 'Anirudh Ravichander', role: 'Artist', color: 'bg-slate-500' },
];

function TrendingArtists({ artists = defaultArtists, onShowAll }) {
  return (
    <section className="bg-black px-4 py-10 sm:px-6 sm:py-12 md:px-10">
      <div className="mx-auto max-w-6xl">

        {/* Background Panel */}
        <div
          className="
            relative
            overflow-hidden
            rounded-[8px]
            border border-[rgba(73,172,192,0.15)]
            bg-[#121212]
            p-8
            shadow-[0_0_35px_rgba(73,172,192,0.12)]
          "
        >

          {/* Background Glow */}
          <div
            className="
              absolute
              inset-0
              bg-[radial-gradient(circle_at_center,rgba(73,172,192,0.18),transparent_70%)]
              pointer-events-none
            "
          />

          {/* Content */}
          <div className="relative z-10">

            {/* Heading */}
            <div className="flex items-center justify-between">
              <h2 className="font-jersey text-[30px] tracking-[0.25em] text-white">
                Trending Artists
              </h2>

              <button
                onClick={onShowAll}
                className="text-sm font-semibold text-white transition hover:text-[#49ACC0]"
              >
                Show all
              </button>
            </div>

            {/* Artist Grid */}
            <ul className="mt-8 grid grid-cols-3 gap-7 sm:grid-cols-4 md:grid-cols-5">
              {artists.map((artist) => (
                <li
                  key={artist.id}
                  className="flex flex-col items-center text-center"
                >
                  <button
                    type="button"
                    aria-label={`View ${artist.name}`}
                    className={`
                      h-20
                      w-20
                      rounded-full
                      ring-2
                      ring-[rgba(255,255,255,0.06)]
                      shadow-lg
                      transition-all
                      duration-300
                      hover:scale-105
                      hover:ring-[#49ACC0]
                      hover:shadow-[0_0_25px_rgba(73,172,192,0.35)]
                      ${artist.color}
                    `}
                  />

                  <span className="mt-4 max-w-[95px] text-sm font-medium text-white">
                    {artist.name}
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    {artist.role}
                  </span>
                </li>
              ))}
            </ul>

          </div>
        </div>

      </div>
    </section>
  );
}
export default TrendingArtists;