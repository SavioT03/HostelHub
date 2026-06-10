import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import "./dashboard.css"

const DashboardLayout = ({ role }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
     <>
      <Navbar />
      <div className="dashboard-layout">

        <aside className={`dashboard-sidebar ${ sidebarOpen ? "expanded" : "collapsed"}`}>
          <Sidebar role={role} isOpen={sidebarOpen} />
        </aside>
        
        {sidebarOpen && (<div className="sidebar-overlay" onClick={toggleSidebar}/>)}

        <main className="dashboard-main">

          <Header onToggleSidebar={toggleSidebar} />

          <div className="dashboard-content p-3">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;