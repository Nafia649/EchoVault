import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 transition-colors duration-300">
      <h1 className="text-9xl font-black text-gray-200 dark:text-neutral-800 transition-colors duration-300">
        404
      </h1>
      <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
        Page Not Found
      </h2>
      <p className="mt-2 max-w-sm text-sm text-gray-500 dark:text-neutral-400 transition-colors duration-300">
        We couldn't find the page you were looking for. It might have been moved or doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-teal-500 px-8 py-3 text-sm font-bold text-white hover:bg-teal-400 active:scale-95 transition-all duration-200"
      >
        Return Home
      </Link>
    </div>
  );
}

export default NotFound;
