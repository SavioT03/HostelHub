import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { useSaved } from "../auth/SavedContext";

const BASE = import.meta.env.VITE_API_URL;

function getCover(image) {
  const url = Array.isArray(image) ? image[0] : image;
  if (!url) return "https://placehold.co/400x240?text=No+Image";
  if (url.startsWith("/uploads")) return `${BASE}${url}`;
  return url;
}

export default function PropertyCard({ property }) {
  const { user } = useAuth();
  const { savedIds, toggle } = useSaved();
  const saved = savedIds.includes(property._id);

  const handleSaveToggle = (e) => {
    e.preventDefault();
    toggle(property._id);
  };

  return (
    <div className="col-md-6">
      <div className="property-card">
        <div className="property-image-wrapper">
          <img src={getCover(property.image)} alt={property.title} className="property-image"/>
          {user?.role === "user" && (
            <button
              className={`favorite-btn ${saved ? "active" : ""}`}
              onClick={handleSaveToggle}
            >
              <i className={`${saved ? "fa-solid" : "fa-regular"} fa-heart`}></i>
            </button>
          )}
        </div>
        <div className="property-body">
          <h5 className="property-title">{property.title}</h5>
          <p className="property-location"><i className="fa-solid fa-location-dot"></i> {property.city}</p>
          <div className="property-tags">
            <span className="tag">{property.type}</span>
            <span className="tag">{property.gender}</span>
            <span className="tag">🛏 {property.beds} available</span>
          </div>
          <p className="property-description">{property.description}</p>
          <div className="property-footer">
            <small className="text-muted"></small>
            <div className="text-end">
              <div className="price">₹{property.price}</div>
              <small className="text-muted">up to ₹{property.maxPrice}</small>
            </div>
          </div>
          <div className="text-end mt-2">
            <Link
              to={`/properties/${property._id}`}
              className="btn btn-primary btn-sm rounded-pill"
            >
              View details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}