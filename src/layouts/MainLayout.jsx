import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
//import Footer from "../components/Footer/Footer";

import "./MainLayout.css";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;