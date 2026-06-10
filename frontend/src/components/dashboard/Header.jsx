import { useLocation } from "react-router-dom";

const Header = ({ onToggleSidebar }) => {
  const location = useLocation();

  const pageTitles = {
    "/dashboard/owner": "Owner Dashboard",
    "/dashboard/owner/properties": "My Properties",
    "/dashboard/owner/add": "Add Property",
    "/dashboard/owner/profile": "Profile",

    "/dashboard/user": "User Dashboard",
    "/dashboard/user/discover": "Discover",
    "/dashboard/user/saved": "Saved Properties",
    "/dashboard/user/profile": "Profile",
  };

  const currentTitle =
    pageTitles[location.pathname] || "Dashboard";

  return (
    <div
      className="d-flex align-items-center gap-3 p-3"
      style={{
        position: "relative",
        background: "rgba(248, 250, 252, 1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderBottom: "0.5px solid rgba(99, 102, 241, 0.2)",
      }}
    >
      <button
        className="btn btn-sm"
        onClick={onToggleSidebar}
        title="Toggle Sidebar"
        style={{
          minWidth: "40px",
          position: "relative",
          zIndex: 1,
          color: "#6366f1",
          border: "1px solid rgba(99, 102, 241, 0.3)",
          backgroundColor: "transparent",
        }}
      >
        ☰ 
      </button>
      <h4 className="fw-bold mb-1">
        {currentTitle}
      </h4>
    </div>
  );
};

export default Header;