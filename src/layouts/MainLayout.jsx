import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "../components/layout/Navbar/Navbar";
import MobileBottomNav from "../components/layout/MobileBottomNav";
import CommandPalette from "../components/CommandPalette";

import "./MainLayout.css";

function MainLayout() {
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <Navbar onOpenPalette={() => setIsPaletteOpen(true)} />

      <main className="main-content pb-16 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </>
  );
}

export default MainLayout;

