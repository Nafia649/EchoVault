import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import MobileBottomNav from "../components/layout/MobileBottomNav";

import "./MainLayout.css";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="main-content pb-16 md:pb-0">
        <Outlet />
      </main>

      <MobileBottomNav />
    </>
  );
}

export default MainLayout;
