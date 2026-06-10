import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="px-3 py-3">
        <Outlet />
      </main>
      <Footer/>
    </>
  );
}