import { useEffect, useState } from "react";
import { useAuth } from "../../../auth/AuthProvider";
import { useSaved } from "../../../auth/SavedContext";
import { getSavedProperties } from "../../../services/propertyService";
import PropertyCard from "../../../components/PropertyCard";

export default function SavedCompare() {
  const { user } = useAuth();
  const { savedIds } = useSaved();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch full property objects once
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getSavedProperties(user._id);
        setProperties(res.savedProperties ?? []);
      } catch {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user._id]);

  // Keep list in sync with context — if heart toggled elsewhere, remove card
  const visible = properties.filter((p) => savedIds.includes(p._id));

  if (loading) {
    return (
      <div className="text-center py-5">
        <i className="fa-solid fa-spinner fa-spin me-2"></i>Loading saved properties…
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted">{visible.length} saved listing{visible.length !== 1 ? "s" : ""}</p>

      {visible.length === 0 ? (
        <div className="text-center py-5">
          <i className="fa-regular fa-heart fa-3x text-muted mb-3 d-block mx-auto"></i>
          <h6 className="text-muted">No saved properties yet</h6>
          <p className="text-muted small">Browse listings and tap the heart to save properties here.</p>
        </div>
      ) : (
        <div className="row mt-3">
          {visible.map((property) => (
            <PropertyCard key={property._id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}