import { useEffect, useState, useMemo } from "react";
import { getApprovedProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";
import "./Listings.css";

export default function Listings() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getApprovedProperties();
        setProperties(res.properties || []);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (city && !p.city?.toLowerCase().includes(city.toLowerCase())) return false;
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;
      return true;
    });
  }, [properties, city, minPrice, maxPrice]);

  const handleReset = () => {
    setCity("");
    setMinPrice("");
    setMaxPrice("");
  };

  const hasFilters = city || minPrice || maxPrice;

  return (
    <div className="listings-page">
      <div className="container">

        {/* ── Filter bar ── */}
        <div className="lf-bar">
          <div className="lf-fields">
            <div className="lf-field">
              <label className="lf-label">
                <i className="fa-solid fa-location-dot"></i> City
              </label>
              <input
                type="text"
                className="lf-input"
                placeholder="e.g. Bangalore"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="lf-divider" />

            <div className="lf-field">
              <label className="lf-label">
                <i className="fa-solid fa-indian-rupee-sign"></i> Min rent
              </label>
              <input
                type="number"
                className="lf-input"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="lf-divider" />

            <div className="lf-field">
              <label className="lf-label">
                <i className="fa-solid fa-indian-rupee-sign"></i> Max rent
              </label>
              <input
                type="number"
                className="lf-input"
                placeholder="Any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            {hasFilters && (
              <button className="lf-reset" onClick={handleReset}>
                <i className="fa-solid fa-xmark"></i> Reset
              </button>
            )}
          </div>

          <div className="lf-result-count">
            {loading ? "" : `${filtered.length} propert${filtered.length === 1 ? "y" : "ies"} found`}
          </div>
        </div>

        {/* ── Results ── */}
        {loading ? (
          <div className="listings-loader">
            <div className="spinner-border text-primary" role="status" />
            <p>Finding properties…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="listings-empty">
            <div className="listings-empty-icon">🏠</div>
            <h4>No properties found</h4>
            <p>Try adjusting your filters or check back later.</p>
            {hasFilters && (
              <button className="btn btn-outline-primary mt-2 rounded-pill" onClick={handleReset}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
