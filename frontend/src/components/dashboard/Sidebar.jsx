import { NavLink } from "react-router-dom";

const menuByRole = {
  user: [
    { name: "Dashboard", path: "/dashboard/user", icon: "📊" },
    { name: "Saved & Compare", path: "/dashboard/user/saved", icon: "💾" },
    { name: "Profile", path: "/dashboard/user/profile", icon: "👤" },
  ],
  owner: [
    { name: "Dashboard", path: "/dashboard/owner", icon: "📊" },
    { name: "My Properties", path: "/dashboard/owner/properties", icon: "🏢" },
    { name: "Add Property", path: "/dashboard/owner/add", icon: "+" },
    { name: "Profile", path: "/dashboard/owner/profile", icon: "👤" },
  ],
};

const Sidebar = ({ role, isOpen }) => {
  const menu = menuByRole[role];

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "20px",
        background: "white",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid rgba(255, 255, 255, 0.5)",
        borderTopRightRadius: "20px",
        borderBottomRightRadius: "20px",
        boxShadow:
          "0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px rgba(255, 255, 255, 0.5)",
        overflowY: "auto",
        color: "#1f2937",
      }}
    >
      <ul className="nav flex-column">

        {menu.map((item) => (
          <li key={item.path} className="nav-item mb-2">

            <NavLink
              to={item.path}
              end
              className={({ isActive }) =>
                `nav-link d-flex align-items-center ${
                  isActive ? "fw-bold active-link" : ""
                }`
              }
              style={({ isActive }) => ({
                padding: "0.75rem 0.5rem",
                justifyContent: isOpen ? "flex-start" : "center",
                color: isActive ? "#6366f1" : "#4b5563",
                backgroundColor: isActive
                  ? "rgba(99, 102, 241, 0.12)"
                  : "transparent",
                textDecoration: "none",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              })}
              title={!isOpen ? item.name : ""}
            >
              <span style={{ fontSize: "1.25rem" }}>{item.icon}</span>

              {isOpen && (
                <span className="ms-2">{item.name}</span>
              )}
            </NavLink>

          </li>
        ))}

      </ul>
    </div>
  );
};

export default Sidebar;