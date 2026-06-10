import PropertyForm from "../../../components/owner/PropertyForm";
import API from "../../../services/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../auth/AuthProvider";

const AddProperty = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleAddProperty = async (formData) => {
    if (
      !formData.title?.trim() ||
      !formData.city?.trim() ||
      !formData.price ||
      !formData.description?.trim() ||
      !formData.image?.length
    ) {
      toast.error("Please fill in all details and upload at least one image");
      return;
    }

    try {
      const propertyData = { ...formData, ownerId: user._id };
      await API.post("/api/properties/add", propertyData);
      toast.success("Property submitted successfully!");
      navigate("/dashboard/owner/properties");
    } catch (error) {
      toast.error("Failed to submit property");
      console.log(error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-card">
        <p className="text-muted">Submit your hostel or PG for admin approval.</p>
        <PropertyForm onSubmit={handleAddProperty} />
      </div>
    </div>
  );
};

export default AddProperty;