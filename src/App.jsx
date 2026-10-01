import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Suspense, lazy } from 'react';

import MainLayout from "./layouts/MainLayout";

const Home = lazy(() => import('./pages/Home'));
const Discover = lazy(() => import('./pages/Discover'));
const Collections = lazy(() => import('./pages/Collections'));
const Favorites = lazy(() => import('./pages/Favorites'));
const AlbumDetails = lazy(() => import('./pages/AlbumDetails'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <BrowserRouter basename={basename}>

      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-[#F3F4F6] dark:bg-black transition-colors duration-300"><div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" /></div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/album/:id" element={<AlbumDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
