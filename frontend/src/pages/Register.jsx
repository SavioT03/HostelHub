import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../auth/AuthProvider";
 
const ROLE_REDIRECT = {
  user: "/dashboard/user",
  owner: "/dashboard/owner",
};
 
export default function Register() {
  const navigate = useNavigate();
  const { loginWithData } = useAuth();
  const [params, setParams] = useSearchParams();
  const role = params.get("role") || "user";
  const [loading, setLoading] = useState(false);
 
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const changeRole = (newRole) => {
    setParams({ role: newRole });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
 
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
 
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
 
    setLoading(true);
    try {
      // Don't send confirmPassword to the server
      const { confirmPassword, ...payload } = form;
 
      const res = await API.post("/api/auth/register", { ...payload, role });
      const { token, user } = res.data;
 
      // Sync auth context + localStorage
      loginWithData(user, token);
 
      toast.success("Account created successfully!");
 
      const redirect = ROLE_REDIRECT[user.role] || "/";
      navigate(redirect);
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <p className="auth-label">JOIN HOSTELHUB</p>
            <h2>Create your account</h2>
          </div>
          <span className="role-pill">
            {role === "user" && <i className="fa-regular fa-user me-2"></i>}
            {role === "owner" && <i className="fa-regular fa-building me-2"></i>}
            {role.toUpperCase()}
          </span>
        </div>
 
        <div className="role-switch mb-4">
          <div className={`switch-slider ${role === "owner" ? "right" : ""}`} />
          <button
            type="button"
            className={`role-option ${role === "user" ? "active" : ""}`}
            onClick={() => changeRole("user")}
          >
            General User
          </button>
          <button
            type="button"
            className={`role-option ${role === "owner" ? "active" : ""}`}
            onClick={() => changeRole("owner")}
          >
            PG Owner
          </button>
        </div>
 
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="form-control auth-input"
                placeholder="First name"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="form-control auth-input"
                placeholder="Last name"
                required
              />
            </div>
          </div>
 
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="form-control auth-input"
              placeholder="you@example.com"
              required
            />
          </div>
 
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="form-control auth-input"
                placeholder="Min 6 characters"
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label>Re-enter password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="form-control auth-input"
                placeholder="Re-enter password"
                required
              />
            </div>
          </div>
 
          <div className="mb-4">
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="form-control auth-input"
              placeholder="10-digit phone"
              required
            />
          </div>
 
          <button
            type="submit"
            className="btn btn-primary w-100 auth-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </button>
 
          <p className="auth-footer-text text-center mt-3">
            Already have an account?{" "}
            <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
 