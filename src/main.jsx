import { createRoot } from 'react-dom/client';

import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';

import './index.css';

createRoot(document.getElementById('root')).render(
  <FavoritesProvider>
    <App />
  </FavoritesProvider>
);