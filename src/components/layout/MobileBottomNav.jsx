import { Link, useLocation } from 'react-router-dom';
import { FaHeart, FaHome, FaCompass, FaFolderOpen } from 'react-icons/fa';
import { useFavorites } from '@/context/FavoritesContext';

export default function MobileBottomNav() {
  const { newFavoritesCount } = useFavorites();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home', icon: FaHome },
    { path: '/discover', label: 'Discover', icon: FaCompass },
    { path: '/collections', label: 'Collections', icon: FaFolderOpen },
    { path: '/favorites', label: 'Favorites', icon: FaHeart, badge: newFavoritesCount },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#F3F4F6]/90 dark:bg-black/90 backdrop-blur-lg border-t border-gray-200 dark:border-neutral-800 transition-colors duration-300">
      <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
        {navLinks.map(({ path, label, icon: Icon, badge }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="text-xl" />
              <span className="text-[10px] font-medium">{label}</span>
              
              {badge > 0 && (
                <span className="absolute top-1 right-1/4 flex items-center justify-center min-w-[16px] h-[16px] px-1 text-[9px] font-bold text-white bg-green-500 rounded-full">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
