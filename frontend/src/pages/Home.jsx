import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFeaturedProperties } from "../services/propertyService";
import PropertyCard from "../components/PropertyCard";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured]   = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFeaturedProperties();
        setFeatured(res.properties ?? []);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <section className="container my-5">
        <div className="home-section d-flex justify-content-between">
          <div style={{ maxWidth: "500px" }}>
            <p className="small bg-secondary px-3 py-1 rounded-pill d-inline-block mb-3">
              HOSTELHUB - VERIFIED LIVING, SIMPLIFIED
            </p>
            <h1 className="display-4 fw-bold mb-3">
              Manage PGs effortlessly and help students find their stay in minutes.
            </h1>
            <p className="text-light mb-3">
              A centralized city-based platform that connects residents and hostel
              owners while providing smart management tools.
            </p>
            <div className="d-flex gap-2">
              <button className="btn btn-light" onClick={() => navigate("/properties")}>
                <i className="fa-solid fa-magnifying-glass"></i> Start searching
              </button>
              <button className="btn btn-outline-light" onClick={() => navigate("/register?role=OWNER")}>
                <i className="fa-solid fa-arrow-right"></i> List your PG
              </button>
            </div>
          </div>

          <div className="home-cities" style={{ width: "380px" }}>
            <h3 className="mb-3 fw-bold">Popular cities</h3>
            <div className="row g-2">
              {["Ahmedabad", "Bangalore", "Chennai", "Delhi"].map((city) => (
                <div key={city} className="col-6">
                  <div className="home-city p-2 rounded-3 text-center small">
                    {city}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <small className="text-uppercase text-muted fw-semibold">Curated Picks</small>
            <h3 className="fw-semibold mt-2">Featured properties</h3>
            {!loading && featured.length === 0 && (
              <p className="text-muted mb-0">
                No featured properties yet. Owners can request their properties to be featured.
              </p>
            )}
          </div>
          <a href="/properties" className="text-decoration-none fw-medium">View all</a>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : featured.length > 0 ? (
          <div className="row g-4">
            {featured.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : null}
      </section>
    </>
  );
}