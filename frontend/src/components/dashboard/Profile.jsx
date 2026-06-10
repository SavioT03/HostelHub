import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../services/userService";
import { toast } from "react-toastify";
import "./Profile.css";
import { useAuth } from "../../auth/AuthProvider";
import Loader from "../../components/common/Loader";
import { FaUser, FaEnvelope, FaPhone, FaTag } from "react-icons/fa";

const Profile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { user, loginWithData } = useAuth();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile(user._id);
        setFormData({
          firstName: response.firstName || "",
          lastName: response.lastName || "",
          email: response.email || "",
          phone: response.phone || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      toast.error("Please fill in all details");
      return;
    }

    try {
      const response = await updateProfile(user._id, formData);
      const token = localStorage.getItem("token");
      loginWithData(response.user, token);
      setShowEditModal(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.log(error);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="dashboard-page">
      {showEditModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowEditModal(false);
          }}
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className="modal-content border-0"
              style={{
                borderRadius: "20px",
                boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="modal-header border-0 pb-0"
                style={{ padding: "24px 28px 12px" }}
              >
                <div>
                  <h5 className="fw-bold mb-0" style={{ color: "#0f172a" }}>
                    Edit Profile
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: "13px" }}>
                    Update your personal information
                  </p>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>

              <div className="modal-body" style={{ padding: "20px 28px" }}>
                <div className="row g-3">
                  <div className="col-6">
                    <label
                      className="form-label fw-medium"
                      style={{ fontSize: "13px", color: "#374151" }}
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      style={{ borderRadius: "10px", fontSize: "14px" }}
                    />
                  </div>
                  <div className="col-6">
                    <label
                      className="form-label fw-medium"
                      style={{ fontSize: "13px", color: "#374151" }}
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      style={{ borderRadius: "10px", fontSize: "14px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label
                      className="form-label fw-medium"
                      style={{ fontSize: "13px", color: "#374151" }}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      style={{ borderRadius: "10px", fontSize: "14px" }}
                    />
                  </div>
                  <div className="col-12">
                    <label
                      className="form-label fw-medium"
                      style={{ fontSize: "13px", color: "#374151" }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit phone"
                      style={{ borderRadius: "10px", fontSize: "14px" }}
                    />
                  </div>
                </div>
              </div>

              <div
                className="modal-footer border-0 pt-0"
                style={{ padding: "12px 28px 24px", gap: "10px" }}
              >
                <button
                  className="btn btn-light fw-medium px-4"
                  style={{ borderRadius: "10px" }}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary fw-medium px-4"
                  style={{ borderRadius: "10px" }}
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE LAYOUT */}
      <div className="profile-wrapper">
        {/* Banner card */}
        <div className="profile-banner">
          <div className="profile-avatar">
            {formData.firstName?.charAt(0)?.toUpperCase()}
          </div>
          <div className="profile-banner-info">
            <h3>
              {formData.firstName} {formData.lastName}
            </h3>
            <p>{user?.role}</p>
          </div>
          <button
            className="profile-edit-btn"
            onClick={() => setShowEditModal(true)}
          >
            Edit Profile
          </button>
        </div>

        {/* Info grid */}
        <div className="profile-grid">
          {[
            {
              label: "First Name",
              value: formData.firstName,
              icon: <FaUser />,
            },
            { label: "Last Name", value: formData.lastName, icon: <FaUser /> },
            { label: "Email", value: formData.email, icon: <FaEnvelope /> },
            { label: "Phone", value: formData.phone, icon: <FaPhone /> },
            { label: "Role", value: user?.role, icon: <FaTag /> },
          ].map(({ label, value, icon }) => (
            <div className="profile-info-tile" key={label}>
              <span className="profile-tile-label">
                {icon} {label}
              </span>
              <span className={`profile-tile-value ${label === "Role" ? "capitalize" : ""}`}>
                {value || "—"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
