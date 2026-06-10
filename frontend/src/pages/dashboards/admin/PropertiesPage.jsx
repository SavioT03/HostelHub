import { useEffect, useState, useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../../services/api";

export default function PropertiesPage() {
  const { onToast } = useOutletContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/admin/properties");
      setProperties(res.data.properties ?? []);
    } catch {
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/api/admin/properties/${id}/status`, { status });
      onToast(`Property ${status} successfully`);
      load();
    } catch {
      toast.error("Action failed. Please try again.");
    }
  };

  const deleteProperty = async (id) => {
    if (!window.confirm("Delete this property? This cannot be undone.")) return;
    try {
      await API.delete(`/api/admin/properties/${id}`);
      onToast("Property deleted");
      load();
    } catch {
      toast.error("Delete failed. Please try again.");
    }
  };

  const toggleFeatured = async (id, current) => {
    try {
      await API.put(`/api/admin/properties/${id}/featured`);
      onToast(current ? "Removed from featured" : "Added to featured");
      load();
    } catch {
      toast.error("Failed to update featured status.");
    }
  };

  // helper — always returns a displayable URL from image field (string or array)
  const getCover = (image) => {
    const url = Array.isArray(image) ? image[0] : image;
    if (!url) return "https://placehold.co/60x48?text=No+Img";
    if (url.startsWith("/uploads")) return `${import.meta.env.VITE_API_URL}${url}`;
    return url;
  };

  const visible = filter === "all" ? properties : properties.filter((p) => p.status === filter);

  return (
    <div className="d-flex flex-column gap-3">

      {/* Status filter tabs */}
      <div className="d-flex gap-2 flex-wrap">
        {["all", "pending", "approved", "rejected"].map((f) => (
          <button
            key={f}
            type="button"
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-outline-secondary"}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span className="ms-1 opacity-75">
                ({properties.filter((p) => p.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-table-card">
        <div className="admin-table-header">
          <h5>Properties</h5>
          <small>{visible.length} listing{visible.length !== 1 ? "s" : ""}</small>
        </div>

        {loading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin me-2"></i>Loading…
          </div>
        ) : visible.length === 0 ? (
          <div className="admin-empty">No properties found.</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>City</th>
                  <th>Price / mo</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={getCover(p.image)}
                        alt={p.title}
                        className="admin-prop-img"
                      />
                    </td>
                    <td style={{ maxWidth: 180 }}>
                      <div className="fw-semibold" style={{ fontSize: 13 }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: "#9ca3af" }}>{p._id.slice(-6)}</div>
                    </td>
                    <td>{p.city}</td>
                    <td>₹{p.price?.toLocaleString()}</td>
                    <td>
                      <span className={`admin-badge badge-${p.status}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {p.status !== "approved" ? (
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>Approve first</span>
                      ) : p.featured ? (
                        <button
                          className="admin-btn admin-btn-approve"
                          onClick={() => toggleFeatured(p._id, true)}
                          title="Remove from featured"
                        >
                          ⭐ Featured
                        </button>
                      ) : p.featuredRequest ? (
                        <button
                          className="admin-btn admin-btn-reject"
                          onClick={() => toggleFeatured(p._id, false)}
                          title="Owner requested — approve to feature"
                        >
                          ✦ Requested
                        </button>
                      ) : (
                        <span style={{ fontSize: 11, color: "#9ca3af" }}>No request</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {p.status !== "approved" && (
                          <button
                            className="admin-btn admin-btn-approve"
                            onClick={() => updateStatus(p._id, "approved")}
                          >
                            Approve
                          </button>
                        )}
                        {p.status !== "rejected" && (
                          <button
                            className="admin-btn admin-btn-reject"
                            onClick={() => updateStatus(p._id, "rejected")}
                          >
                            Reject
                          </button>
                        )}
                        <button
                          className="admin-btn admin-btn-delete"
                          onClick={() => deleteProperty(p._id)}
                        >
                          Delete
                        </button>
                      </div>
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