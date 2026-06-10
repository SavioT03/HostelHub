import { useEffect, useState } from "react";
import { FaHome, FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { getOwnerProperties } from "../../../services/propertyService";
import { useAuth } from "../../../auth/AuthProvider";
import StatCard from "../../../components/owner/StatCard";

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchProperties = async () => {
      try {
        const response = await getOwnerProperties(user._id);
        setProperties(response.properties);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProperties();
  }, [user]);

  const approved = properties.filter((p) => p.status === "approved").length;
  const pending   = properties.filter((p) => p.status === "pending").length;
  const rejected  = properties.filter((p) => p.status === "rejected").length;

  return (
    <div>
      <div>
        <p className="text-muted mb-4">Overview of your property listings</p>

        <div className="row g-4">
          <StatCard title="Total Properties" value={properties.length} icon={<FaHome />} />
          <StatCard title="Approved"         value={approved}          icon={<FaCheckCircle />} />
          <StatCard title="Pending"          value={pending}           icon={<FaClock />} />
          <StatCard title="Rejected"         value={rejected}          icon={<FaTimesCircle />} />
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;