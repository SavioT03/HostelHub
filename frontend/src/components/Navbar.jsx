import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../auth/AuthProvider";
import { getDashboardRoute } from "../services/roleRedirect";
 
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
 
  const displayName = user?.firstName || user?.fullName || "User";
 
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
 
  return (
    <nav
      className="navbar navbar-expand-lg bg-white px-3 py-1"
      style={{ height: "70px" }}
    >
      <div className="container-fluid d-flex align-items-center">
        {/* LEFT */}
        <div className="flex-grow-1 d-flex justify-content-start">
          <Link
            className="navbar-brand d-flex align-items-center gap-2 mb-0"
            to="/"
            style={{ minWidth: 0, flexShrink: 1, maxWidth: "160px" }}
          >
            <img
              src={logo}
              alt="HostelHub Logo"
              style={{ height: "110px", width: "auto", objectFit: "contain", flexShrink: 0 }}
            />
            <div className="navbar-logo-text" style={{ lineHeight: "1.1" }}>
              <div style={{ fontWeight: 600, fontSize: "18px" }}>HostelHub</div>
              <small style={{ fontSize: "10px", color: "#64748b" }}>
                VERIFIED LIVING, SIMPLIFIED
              </small>
            </div>
          </Link>
        </div>
 
        {/* CENTER */}
        <div className="navbar-links d-flex justify-content-center flex-grow-1" style={{ minWidth: 0 }}>
          <ul className="navbar-nav flex-row gap-3">
            <li className="nav-item">
              <NavLink to="/" end className={({ isActive }) => `nav-link fw-medium ${isActive ? "active" : ""}`}>
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-medium" to="/properties">Listings</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link fw-medium" to="/about">About</NavLink>
            </li>
          </ul>
        </div>
 
        {/* RIGHT */}
        <div className="flex-grow-1 d-flex justify-content-end">
          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            {!user ? (
              <>
                <Link to="/login" className="text-decoration-none fw-medium">Sign in</Link>
                <Link to="/register?role=user" className="btn btn-primary btn-sm">Create account</Link>
              </>
            ) : (
              <div className="dropdown">
                <button
                  className="btn d-flex align-items-center gap-2 border-0 bg-transparent"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <div
                    style={{
                      width: "38px", height: "38px", borderRadius: "50%",
                      background: "#6366f1", color: "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: "bold",
                    }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="fw-medium d-none d-sm-inline text-dark">
                    Hi, {displayName}
                  </span>
                  <span style={{ fontSize: "12px", color: "#6b7280" }}>▼</span>
                </button>
 
                <ul
                  className="dropdown-menu dropdown-menu-end shadow border-0 p-2"
                  style={{ minWidth: "240px", borderRadius: "16px" }}
                >
                  <li>
                    <Link
                      to={getDashboardRoute(user?.role)}
                      className="dropdown-item d-flex align-items-center justify-content-between py-3 rounded"
                    >
                      <div>
                        <div className="fw-semibold text-dark">
                          {user.firstName} {user.lastName}
                        </div>
                        <small className="text-muted">Open Dashboard</small>
                      </div>
                      <span>›</span>
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item text-danger fw-medium py-2 rounded"
                      onClick={handleLogout}
                    >
                      LOGOUT
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}