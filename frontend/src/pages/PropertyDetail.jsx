import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPropertyById } from "../services/propertyService";
import { useAuth } from "../auth/AuthProvider";
import "./PropertyDetail.css";

const BASE = import.meta.env.VITE_API_URL;

function resolveUrl(url) {
  if (!url) return "https://placehold.co/900x480?text=No+Image";
  if (url.startsWith("/uploads")) return `${BASE}${url}`;
  return url;
}

export default function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [property, setProperty]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPropertyById(id);
        setProperty(res.property);
      } catch {
        setError("Property not found.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading)
    return (
      <div className="pd-loading">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  if (error)
    return <div className="pd-loading text-danger fw-semibold">{error}</div>;

  const amenities = property.amenities || [];
  const isPrivileged = user?.role === "owner" || user?.role === "admin";

  const gallery = Array.isArray(property.image) && property.image.length
    ? property.image.map(resolveUrl)
    : [resolveUrl(null)];

  const mapQuery = encodeURIComponent(
    property.location || property.address || property.city
  );
  const mapSrc = `https://maps.google.com/maps?q=${mapQuery}&output=embed`;

  const waMessage = encodeURIComponent(
    `Hi, I'm interested in your property "${property.title}" listed on HostelHub. Could you please share more details?`
  );
  const waPhone = property.ownerPhone
    ? `91${property.ownerPhone.replace(/\D/g, "")}`
    : null;

  return (
    <div className="pd-page">
      <div className="container">
        <button className="pd-back" onClick={() => navigate(-1)}>
          ← Back to search
        </button>
      </div>

      <div className="container">
        <div className="pd-grid">

          {/* ══════════════ LEFT COLUMN ══════════════ */}
          <div className="pd-left">

            {/* Gallery */}
            <div className="pd-main">
              <img
                src={gallery[activeImg]}
                alt={property.title}
                className="pd-main-img"
              />
              <div className="pd-main-badges">
                {property.type   && <span className="pd-badge pd-badge-blue">{property.type}</span>}
                {property.gender && <span className="pd-badge pd-badge-outline">{property.gender.toUpperCase()}</span>}
              </div>
              {gallery.length > 1 && (
                <>
                  <button
                    className="pd-gallery-arrow pd-gallery-prev"
                    onClick={() => setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)}
                  >‹</button>
                  <button
                    className="pd-gallery-arrow pd-gallery-next"
                    onClick={() => setActiveImg((i) => (i + 1) % gallery.length)}
                  >›</button>
                  <div className="pd-gallery-counter">{activeImg + 1} / {gallery.length}</div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="pd-thumbnails">
                {gallery.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`thumb-${i}`}
                    className={`pd-thumb ${i === activeImg ? "pd-thumb-active" : ""}`}
                    onClick={() => setActiveImg(i)}
                  />
                ))}
              </div>
            )}

            {/* Title block */}
            <div className="pd-title-block">
              <div className="pd-title-row">
                <h1 className="pd-title">{property.title}</h1>
                {property.type   && <span className="pd-pill">{property.type}</span>}
                {property.gender && <span className="pd-pill pd-pill-gender">{property.gender.toUpperCase()}</span>}
              </div>

              <div className="pd-meta-row">
                <span className="pd-meta-item">
                  <i className="fa-solid fa-location-dot"></i>
                  {property.address || property.city}
                </span>
                {property.deposit && (
                  <span className="pd-meta-item pd-meta-shield">
                    <i className="fa-solid fa-shield-halved"></i>
                    Security deposit ₹{property.deposit.toLocaleString()}
                  </span>
                )}
              </div>

              <p className="pd-description">{property.description}</p>

              {amenities.length > 0 && (
                <div className="pd-amenities">
                  {amenities.map((a) => (
                    <span key={a} className="pd-amenity-tag">{a}</span>
                  ))}
                </div>
              )}

              <div className="pd-stats">
                {property.beds && (
                  <div className="pd-stat">
                    <div className="pd-stat-label">Available beds</div>
                    <div className="pd-stat-value">{property.beds}</div>
                  </div>
                )}
                <div className="pd-stat">
                  <div className="pd-stat-label">Rent</div>
                  <div className="pd-stat-value">₹{property.price?.toLocaleString()} / mo</div>
                </div>
                {property.noticePeriod && (
                  <div className="pd-stat">
                    <div className="pd-stat-label">Notice period</div>
                    <div className="pd-stat-value">{property.noticePeriod} days</div>
                  </div>
                )}
              </div>
            </div>

            {/* Rooms & Beds */}
            {property.rooms?.length > 0 && (
              <div className="pd-section">
                <div className="pd-section-header">
                  <h2 className="pd-section-title">Rooms &amp; beds</h2>
                  <span className="pd-room-count">
                    {property.rooms.length} ROOM{property.rooms.length > 1 ? "S" : ""}
                  </span>
                </div>
                {property.rooms.map((room, i) => (
                  <div key={i} className="pd-room-card">
                    <div className="pd-room-top">
                      <div>
                        <div className="pd-room-label">ROOM {room.code || `R${i + 1}`}</div>
                        <div className="pd-room-name">{room.name || room.type} sharing</div>
                        <div className="pd-room-tags">
                          <span className="pd-room-tag">
                            <i className="fa-solid fa-bed"></i>
                            {room.occupiedBeds || 0}/{room.totalBeds || room.beds || 0} beds
                          </span>
                          {room.features?.map((f) => (
                            <span key={f} className="pd-room-tag">
                              <i className="fa-solid fa-sun"></i> {f}
                            </span>
                          ))}
                        </div>
                        <p className="pd-room-desc">
                          {room.name || room.type} sharing with {room.totalBeds || room.beds} beds.
                        </p>
                        <span className="pd-beds-open">
                          <i className="fa-solid fa-circle-check"></i> Beds open
                        </span>
                      </div>
                      <div className="pd-room-price-block">
                        <div className="pd-room-price">₹{(room.price || property.price)?.toLocaleString()}</div>
                        <div className="pd-room-floor">Floor {room.floor || "—"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ══════════════ RIGHT SIDEBAR ══════════════ */}
          <div className="pd-sidebar">

            {/* Talk to Owner */}
            <div className="pd-sidebar-card pd-contact-card">
              <div className="pd-contact-label">TALK TO OWNER</div>
              <div className="pd-contact-owner-row">
                <div>
                  <div className="pd-contact-name">
                    {property.ownerName || "Property Owner"}
                  </div>
                  <div className="pd-contact-company">
                    {property.ownerCompany || property.title}
                  </div>
                  {user && property.ownerPhone && (
                    <div className="pd-contact-phone">
                      <i className="fa-solid fa-phone"></i>
                      {property.ownerPhone}
                    </div>
                  )}
                </div>
                <div className="pd-contact-shield">
                  <i className="fa-solid fa-shield-halved"></i>
                </div>
              </div>
              {!user ? (
                <button
                  className="pd-whatsapp-btn"
                  style={{ background: "#6366f1", cursor: "pointer", border: "none", width: "100%" }}
                  onClick={() => navigate("/login")}
                >
                  <i className="fa-solid fa-lock"></i>
                  Login to contact owner
                </button>
              ) : waPhone ? (
                <a
                  href={`https://wa.me/${waPhone}?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pd-whatsapp-btn"
                >
                  <i className="fa-brands fa-whatsapp"></i>
                  Chat on WhatsApp
                </a>
              ) : (
                <div className="pd-no-phone">
                  <i className="fa-solid fa-phone-slash"></i>
                  Contact number not available
                </div>
              )}
            </div>

            {/* Quick info — status only for owner/admin, map for everyone */}
            <div className="pd-sidebar-card pd-quick-info">
              <div className="pd-quick-row">
                <i className="fa-solid fa-indian-rupee-sign"></i>
                <div>
                  <div className="pd-quick-label">Monthly rent</div>
                  <div className="pd-quick-value">₹{property.price?.toLocaleString()}</div>
                </div>
              </div>
              <div className="pd-quick-row">
                <i className="fa-solid fa-location-dot"></i>
                <div>
                  <div className="pd-quick-label">City</div>
                  <div className="pd-quick-value">{property.city}</div>
                </div>
              </div>
              {isPrivileged && property.status && (
                <div className="pd-quick-row">
                  <i className="fa-solid fa-circle-check"></i>
                  <div>
                    <div className="pd-quick-label">Status</div>
                    <div className={`pd-quick-value pd-status-${property.status}`}>
                      {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="pd-sidebar-card pd-map-card">
              <div className="pd-contact-label">LOCATION</div>
              <div className="pd-map-wrapper">
                <iframe
                  title="Property location"
                  src={mapSrc}
                  className="pd-map-iframe"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <p className="pd-map-label">
                <i className="fa-solid fa-location-dot me-1"></i>
                {property.address || property.city}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}