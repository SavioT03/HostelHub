import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../../services/api";

/**
 * /admin/users  →  UsersPage
 * Lists all users with role-based filtering and delete action.
 */
export default function UsersPage() {
  const { onToast } = useOutletContext();
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/admin/users");
      setUsers(res.data.users ?? []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await API.delete(`/api/admin/users/${id}`);
      onToast("User deleted");
      load();
    } catch {
      toast.error("Delete failed. Please try again.");
    }
  };

  const visible = filter === "all" ? users : users.filter((u) => u.role === filter);

  return (
    <div className="d-flex flex-column gap-3">

      {/* Role filter tabs */}
      <div className="d-flex gap-2 flex-wrap">
        {["all", "user", "owner", "admin"].map((f) => (
          <button
            key={f}
            type="button"
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ms-1 opacity-75">
                ({users.filter((u) => u.role === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5>Users</h5>
          <small>{visible.length} account{visible.length !== 1 ? "s" : ""}</small>
        </div>

        {loading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin me-2"></i>Loading…
          </div>
        ) : visible.length === 0 ? (
          <div className="admin-empty">No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-semibold">{u.firstName} {u.lastName}</td>
                    <td style={{ color: "#6b7280" }}>{u.email}</td>
                    <td style={{ color: "#6b7280" }}>{u.phone || "—"}</td>
                    <td>
                      <span className={`admin-badge badge-${u.role}`}>
                        {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                      </span>
                    </td>
                    <td style={{ color: "#9ca3af", fontSize: 12 }}>
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </td>
                    <td>
                      {u.role !== "admin" && (
                        <button
                          className="admin-btn admin-btn-delete"
                          onClick={() => deleteUser(u._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
