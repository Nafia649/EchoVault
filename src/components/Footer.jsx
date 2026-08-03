function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-800 py-6 px-6 flex justify-between items-center text-xs tracking-widest text-neutral-400 uppercase">
      <span className="hover:text-white transition cursor-pointer">GitHub</span>
      <a href="https://last.fm" target="_blank" rel="noreferrer" className="hover:text-white transition">
        Powered by Last.fm ↗
      </a>
      <span className="hover:text-white transition cursor-pointer">LinkedIn</span>
    </footer>
  );
}

export default Footer;