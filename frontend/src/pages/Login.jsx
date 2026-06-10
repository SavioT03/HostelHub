import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import { useAuth } from "../auth/AuthProvider";
 
const ROLE_REDIRECT = {
  user: "/dashboard/user",
  owner: "/dashboard/owner",
  admin: "/admin",
};
 
export default function Login() {
  const navigate = useNavigate();
  const { loginWithData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
 
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
 
    setLoading(true);
    try {
      const res = await API.post("/api/auth/login", form);
      const { token, user } = res.data;
 
      // Sync auth context + localStorage
      loginWithData(user, token);
 
      toast.success(`Welcome back, ${user.firstName}!`);
 
      // Redirect based on role
      const redirect = ROLE_REDIRECT[user.role] || "/";
      navigate(redirect);
    } catch (err) {
      const message = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
 
  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">
            <i className="fa-solid fa-right-to-bracket"></i>
          </div>
          <div>
            <p className="auth-label">ACCESS</p>
            <h2>Login to HostelHub</h2>
          </div>
        </div>
 
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
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
 
          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="form-control auth-input"
              placeholder="Enter your password"
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
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
 
        <p className="auth-switch mt-3">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}