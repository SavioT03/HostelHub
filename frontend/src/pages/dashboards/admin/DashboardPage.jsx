import { useEffect, useState } from "react";
import API from "../../../services/api";

/**
 * /admin  →  DashboardPage
 * Shows live stat cards: total users, owners, properties, pending approvals.
 */
export default function DashboardPage() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, propsRes] = await Promise.all([
          API.get("/api/admin/users"),
          API.get("/api/admin/properties"),
        ]);
        const users      = usersRes.data.users      ?? [];
        const properties = propsRes.data.properties ?? [];

        setStats({
          totalUsers:       users.filter((u) => u.role === "user").length,
          totalOwners:      users.filter((u) => u.role === "owner").length,
          totalProperties:  properties.length,
          pendingApprovals: properties.filter((p) => p.status === "pending").length,
        });
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading">
        <i className="fa-solid fa-spinner fa-spin me-2"></i>Loading stats…
      </div>
    );
  }

  const cards = [
    { label: "Total Users",       value: stats?.totalUsers       ?? "—", note: "Registered tenants",   cls: "stat-blue"   },
    { label: "Property Owners",   value: stats?.totalOwners      ?? "—", note: "Active owners",        cls: "stat-purple" },
    { label: "Total Properties",  value: stats?.totalProperties  ?? "—", note: "All listings",         cls: "stat-green"  },
    { label: "Pending Approvals", value: stats?.pendingApprovals ?? "—", note: "Awaiting your review", cls: "stat-orange" },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <p className="text-muted mb-0">Here's a live overview of everything on HostelHub.</p>

      <div className="row g-3">
        {cards.map((c) => (
          <div className="col-12 col-sm-6 col-xl-3" key={c.label}>
            <div className={`admin-stat-card ${c.cls}`}>
              <p className="text-uppercase">{c.label}</p>
              <h3>{c.value}</h3>
              <small>{c.note}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
