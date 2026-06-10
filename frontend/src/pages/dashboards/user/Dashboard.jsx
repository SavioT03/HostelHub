import { useAuth } from "../../../auth/AuthProvider";
import { useSaved } from "../../../auth/SavedContext";
import { FaHeart } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useAuth();
  const { savedIds } = useSaved();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <p className="text-muted mb-4">Welcome back, {user?.firstName}! Here's your overview.</p>

        <div className="row g-4">
          <div className="col-12 col-sm-6 col-xl-3">
            <div className="stat-card">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="stat-title">Saved Listings</span>
                <div className="stat-icon">
                  <FaHeart />
                </div>
              </div>
              <p className="stat-value">{savedIds.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;