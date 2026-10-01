function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 dark:border-neutral-800 py-6 px-6 flex justify-between items-center text-xs tracking-widest text-gray-500 dark:text-neutral-400 uppercase transition-colors duration-300">
      <a href="https://github.com/Nafia649" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">GitHub</a>
      <a href="https://last.fm" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">
        Powered by Last.fm ↗
      </a>
      <a href="https://www.linkedin.com/in/nafia-z-925700277" target="_blank" rel="noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer">LinkedIn</a>
    </footer>
  );
}

export default Footer;
