function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-neutral-800 py-6 px-6 flex justify-between items-center text-xs tracking-widest text-gray-500 dark:text-neutral-400 uppercase transition-colors duration-300">
      <span className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">GitHub</span>
      <a href="https://last.fm" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
        Powered by Last.fm ↗
      </a>
      <span className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">LinkedIn</span>
    </footer>
  );
}

export default Footer;
