import { useState } from "react";
import { Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthProvider";
import { AdminSidebar } from "../components/admin/AdminSidebar";
import { AdminHeader }  from "../components/admin/AdminHeader";
import "./admin.css";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        onLogout={handleLogout}
      />

      <div className="admin-main">
        <AdminHeader
          adminName={user ? `${user.firstName} ${user.lastName}` : "Admin"}
        />
        <main className="admin-content container-fluid py-4">
          <Outlet context={{ onToast: toast.success }} />
        </main>
      </div>
    </div>
  );
}
