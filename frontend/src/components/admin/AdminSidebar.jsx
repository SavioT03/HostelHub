import { NavLink, Link } from "react-router-dom";

const menuItems = [
  { to: "/admin",label: "Dashboard", icon: "fa-solid fa-gauge-high", end: true },
  { to: "/admin/properties", label: "Properties", icon: "fa-solid fa-building" },
  { to: "/admin/users", label: "Users", icon: "fa-solid fa-users" },
];

export function AdminSidebar({ collapsed, onToggleCollapse, onLogout }) {
  return (
    <aside className={`admin-sidebar bg-white border-end ${collapsed ? "collapsed" : ""}`}>

      <div className="admin-brand">
        {!collapsed && (
          <Link to="/" className="admin-brand-text text-decoration-none">
            <h5>HostelHub</h5>
            <small>Admin Panel</small>
          </Link>
        )}
        <button className="admin-collapse-btn" onClick={onToggleCollapse} type="button">
          <i className={`fa-solid ${collapsed ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>
      </div>

      <nav className="admin-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav-btn ${isActive ? "active" : ""}`}
          >
            <i className={item.icon}></i>
            {!collapsed && <span className="admin-nav-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-logout-btn" onClick={onLogout} type="button">
          <i className="fa-solid fa-right-from-bracket"></i>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}