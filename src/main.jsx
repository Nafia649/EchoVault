import { createRoot } from 'react-dom/client';

import App from './App';
import { FavoritesProvider } from './context/FavoritesContext';
import { HistoryProvider } from './context/HistoryContext';
import { ThemeProvider } from './context/ThemeContext';

import './index.css';

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <FavoritesProvider>
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </FavoritesProvider>
  </ThemeProvider>
);
