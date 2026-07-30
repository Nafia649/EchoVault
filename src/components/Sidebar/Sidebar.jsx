function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-3 w-52 shrink-0 pt-16">
      {/* Filter | Sort row */}
      <div className="flex justify-end gap-2 text-xs text-neutral-400 mb-3">
        <button className="hover:text-white transition">Filter</button>
        <span className="text-neutral-600">|</span>
        <button className="hover:text-white transition">Sort</button>
      </div>

      {/* Spotify promo card */}
      <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-5 flex flex-col gap-4 text-center">
        <p className="text-white font-bold text-base leading-snug">
          Dont Have<br />Spotify?
        </p>
        <a
          href="https://www.spotify.com/download"
          target="_blank"
          rel="noreferrer"
          className="block rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition text-black text-xs font-bold py-2 px-3"
        >
          Download the free app
        </a>
      </div>
    </aside>
  );
}

export default Sidebar;

