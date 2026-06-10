import { useLocation, NavLink } from "react-router-dom";
 
const ROUTE_TITLES = {
  "/admin":            "Dashboard",
  "/admin/properties": "Property Management",
  "/admin/users":      "User Management",
};
 
export function AdminHeader({ adminName }) {
  const { pathname } = useLocation();
  const title = ROUTE_TITLES[pathname] ?? "Dashboard";
 
  const initials = adminName
    ? adminName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "A";
 
  return (
    <header className="admin-header">

      <nav className="d-flex justify-content-center align-items-center gap-3">
      </nav>
 
      <div className="admin-header-user">
        <div className="admin-avatar">{initials}</div>
        <span>{adminName || "Admin"}</span>
      </div>
    </header>
  );
}