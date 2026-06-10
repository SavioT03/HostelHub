import { useEffect, useState, useRef } from "react";
import { getOwnerProperties, updateProperty, deleteProperty, uploadPropertyImage } from "../../../services/propertyService";
import { FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import Loader from "../../../components/common/Loader";
import EmptyState from "../../../components/common/EmptyState";
import { useAuth } from "../../../auth/AuthProvider";
import StatusBadge from "../../../components/common/StatusBadge";
import DeleteModal from "../../../components/common/DeleteModal";

const BASE = import.meta.env.VITE_API_URL;

function resolveUrl(url) {
  if (!url) return null;
  if (url.startsWith("/uploads")) return `${BASE}${url}`;
  return url;
}

function buildImageItems(imageArray) {
  return (imageArray ?? []).map((url) => ({ src: resolveUrl(url), raw: url }));
}

const Properties = () => {
  const { user } = useAuth();
  const [properties, setProperties]                 = useState([]);
  const [loading, setLoading]                       = useState(true);
  const [searchTerm, setSearchTerm]                 = useState("");
  const [editingProperty, setEditingProperty]       = useState(null);
  const [showDeleteModal, setShowDeleteModal]       = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [saving, setSaving]                         = useState(false);
  const [editFormData, setEditFormData]             = useState({
    title: "", city: "", price: "", description: "", location: "", featuredRequest: false,
  });
  const [imgItems, setImgItems] = useState([]);
  const fileInputRef            = useRef(null);

  useEffect(() => {
    if (!user) return;
    const fetch_ = async () => {
      try {
        setLoading(true);
        const res = await getOwnerProperties(user._id);
        setProperties(res.properties);
      } catch {
        toast.error("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, [user]);

  const handleAddImages = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImgItems((prev) => [...prev, ...files.map((f) => ({ src: URL.createObjectURL(f), raw: f }))]);
    e.target.value = "";
  };

  const removeImage = (idx) => setImgItems((prev) => prev.filter((_, i) => i !== idx));

  const moveImage = (idx, dir) => {
    setImgItems((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return next;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success("Property deleted successfully");
      setShowDeleteModal(false);
      setSelectedPropertyId(null);
    } catch {
      toast.error("Failed to delete property");
    }
  };

  const handleUpdateProperty = async () => {
    setSaving(true);
    try {
      const finalUrls = await Promise.all(
        imgItems.map(async ({ raw }) => {
          if (raw instanceof File) {
            const res = await uploadPropertyImage(raw);
            return res.imageUrl;
          }
          return raw;
        })
      );
      const response = await updateProperty(editingProperty._id, {
        ...editFormData,
        image: finalUrls,
      });
      setProperties((prev) =>
        prev.map((p) => p._id === editingProperty._id ? response.property : p)
      );
      toast.success("Property updated successfully");
      setEditingProperty(null);
    } catch {
      toast.error("Failed to update property");
    } finally {
      setSaving(false);
    }
  };

  const filteredProperties = properties.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        {loading ? <Loader /> : (
          <>
            {editingProperty && (
              <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg modal-dialog-centered">
                  <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                      <h5 className="modal-title fw-bold">Edit Property</h5>
                      <button type="button" className="btn-close" onClick={() => setEditingProperty(null)} />
                    </div>
                    <div className="modal-body">
                      <div className="row g-3">

                        <div className="col-md-6">
                          <input type="text" className="form-control" placeholder="Title"
                            value={editFormData.title}
                            onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <input type="text" className="form-control" placeholder="City"
                            value={editFormData.city}
                            onChange={(e) => setEditFormData({ ...editFormData, city: e.target.value })}
                          />
                        </div>
                        <div className="col-md-6">
                          <input type="number" className="form-control" placeholder="Price"
                            value={editFormData.price}
                            onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                          />
                        </div>
                        <div className="col-12">
                          <label className="form-label" style={{ fontSize: 13 }}>
                            Full Address / Location
                            <span className="text-muted ms-2" style={{ fontSize: 11 }}>(used for map)</span>
                          </label>
                          <input type="text" className="form-control"
                            placeholder="e.g. 12 MG Road, Bengaluru, Karnataka 560001"
                            value={editFormData.location}
                            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                          />
                        </div>

                        {/* ── Image Manager ── */}
                        <div className="col-12">
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <label className="form-label mb-0" style={{ fontSize: 13 }}>
                              Images
                              <span className="text-muted ms-2" style={{ fontSize: 11 }}>(first = cover)</span>
                            </label>
                            <button type="button" className="btn btn-outline-primary btn-sm"
                              style={{ fontSize: 12 }} onClick={() => fileInputRef.current?.click()}>
                              + Add Images
                            </button>
                            <input ref={fileInputRef} type="file" accept="image/*" multiple
                              style={{ display: "none" }} onChange={handleAddImages} />
                          </div>

                          {imgItems.length === 0 ? (
                            <div className="text-muted text-center py-3 rounded"
                              style={{ border: "1px dashed #d1d5db", fontSize: 13 }}>
                              No images — click "Add Images" to upload
                            </div>
                          ) : (
                            <div className="d-flex flex-wrap gap-3">
                              {imgItems.map((item, i) => (
                                <div key={i} style={{ width: 90 }}>
                                  <div style={{ position: "relative" }}>
                                    <img src={item.src} alt="" className="rounded"
                                      style={{
                                        width: 90, height: 70, objectFit: "cover", display: "block",
                                        border: i === 0 ? "2px solid #2563eb" : "2px solid #e5e7eb",
                                      }}
                                    />
                                    {i === 0 && (
                                      <span style={{
                                        position: "absolute", bottom: 3, left: 3,
                                        background: "rgba(37,99,235,0.85)", color: "#fff",
                                        fontSize: 9, padding: "1px 5px", borderRadius: 3,
                                        pointerEvents: "none",
                                      }}>COVER</span>
                                    )}
                                    <button type="button" onClick={() => removeImage(i)} style={{
                                      position: "absolute", top: 3, right: 3,
                                      background: "rgba(0,0,0,0.6)", border: "none",
                                      borderRadius: "50%", color: "#fff",
                                      width: 20, height: 20, fontSize: 11, cursor: "pointer",
                                      display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>✕</button>
                                  </div>
                                  <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                                    <button type="button" onClick={() => moveImage(i, -1)} disabled={i === 0}
                                      style={{
                                        flex: 1, border: "1px solid #d1d5db", borderRadius: 4,
                                        background: i === 0 ? "#f3f4f6" : "#fff",
                                        color: i === 0 ? "#d1d5db" : "#374151",
                                        fontSize: 14, cursor: i === 0 ? "default" : "pointer",
                                        padding: "1px 0", lineHeight: 1,
                                      }}>‹</button>
                                    <button type="button" onClick={() => moveImage(i, 1)} disabled={i === imgItems.length - 1}
                                      style={{
                                        flex: 1, border: "1px solid #d1d5db", borderRadius: 4,
                                        background: i === imgItems.length - 1 ? "#f3f4f6" : "#fff",
                                        color: i === imgItems.length - 1 ? "#d1d5db" : "#374151",
                                        fontSize: 14, cursor: i === imgItems.length - 1 ? "default" : "pointer",
                                        padding: "1px 0", lineHeight: 1,
                                      }}>›</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="col-12">
                          <textarea className="form-control" rows="4" placeholder="Description"
                            value={editFormData.description}
                            onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                          />
                        </div>

                        {/* ── Featured request — only for approved properties ── */}
                        {editingProperty?.status === "approved" && (
                          <div className="col-12">
                            <div className="form-check">
                              <input type="checkbox" className="form-check-input"
                                id="featuredRequest"
                                checked={editFormData.featuredRequest}
                                onChange={(e) => setEditFormData({ ...editFormData, featuredRequest: e.target.checked })}
                              />
                              <label className="form-check-label" htmlFor="featuredRequest" style={{ fontSize: 13 }}>
                                Request to be featured on the home page
                                <span className="text-muted ms-2" style={{ fontSize: 11 }}>
                                  (subject to admin approval)
                                </span>
                              </label>
                            </div>
                          </div>
                        )}

                      </div>

                      <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={() => setEditingProperty(null)}>
                          Cancel
                        </button>
                        <button className="btn btn-primary" onClick={handleUpdateProperty} disabled={saving}>
                          {saving ? <><i className="fa-solid fa-spinner fa-spin me-2"></i>Saving…</> : "Save Changes"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DeleteModal
              show={showDeleteModal}
              title="Delete Property"
              message="Are you sure you want to delete this property?"
              onClose={() => { setShowDeleteModal(false); setSelectedPropertyId(null); }}
              onConfirm={() => handleDelete(selectedPropertyId)}
            />

            <div className="properties-toolbar mb-4">
              <div className="properties-search-wrapper">
                <FaSearch className="properties-search-icon" />
                <input type="text" className="properties-search-input"
                  placeholder="Search by title or city..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <EmptyState icon="🏠" title="No Properties Added Yet"
                description="Start by adding your first property"
                buttonText="Add Property" link="/dashboard/owner/add"
              />
            ) : (
              <div className="row g-4">
                {filteredProperties.map((property) => (
                  <div className="col-lg-4 col-md-6" key={property._id}>
                    <div className="card border-0 shadow-sm h-100">
                      <img
                        src={(() => {
                          const url = Array.isArray(property.image) ? property.image[0] : property.image;
                          if (!url) return "https://placehold.co/400x220?text=No+Image";
                          if (url.startsWith("/uploads")) return `${BASE}${url}`;
                          return url;
                        })()}
                        alt={property.title}
                        className="card-img-top"
                        style={{ height: "220px", objectFit: "cover" }}
                      />
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h5 className="fw-bold">{property.title}</h5>
                          <StatusBadge status={property.status} />
                        </div>
                        <p className="text-muted mb-2">{property.city}</p>
                        <h6 className="fw-semibold">₹ {property.price} / month</h6>
                        {property.featuredRequest && !property.featured && (
                          <p className="text-warning mb-1" style={{ fontSize: 12 }}>
                            ⏳ Featured request pending admin approval
                          </p>
                        )}
                        {property.featured && (
                          <p className="text-success mb-1" style={{ fontSize: 12 }}>
                            ⭐ Featured on home page
                          </p>
                        )}
                        <div className="d-flex justify-content-end gap-2 mt-3">
                          <button className="property-action-btn edit-btn"
                            onClick={() => {
                              setEditingProperty(property);
                              setEditFormData({
                                title: property.title,
                                city: property.city,
                                price: property.price,
                                description: property.description,
                                location: property.location ?? "",
                                featuredRequest: property.featuredRequest ?? false,
                              });
                              setImgItems(buildImageItems(property.image));
                            }}
                          >
                            <FaEdit size={20} />
                          </button>
                          <button className="property-action-btn delete-btn"
                            onClick={() => { setSelectedPropertyId(property._id); setShowDeleteModal(true); }}
                          >
                            <FaTrash size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Properties;