import { useState } from "react";
import { uploadPropertyImage } from "../../services/propertyService";

const PropertyForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    city: "",
    price: "",
    location: "",
    description: "",
    featuredRequest: false,
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [previews, setPreviews]     = useState([]);
  const [uploading, setUploading]   = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setImageFiles(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageFiles.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    try {
      setUploading(true);
      const uploadedUrls = await Promise.all(
        imageFiles.map(async (file) => {
          const res = await uploadPropertyImage(file);
          return res.imageUrl;
        })
      );
      // First image also goes into legacy `image` field for backward compat
      onSubmit({ ...formData, image: uploadedUrls });
    } catch (err) {
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label">Property Title</label>
          <input
            required
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter property title"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">City</label>
          <input
            required
            type="text"
            className="form-control"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
          />
        </div>

        <div className="col-12">
          <label className="form-label">
            Full Address / Location
            <span className="text-muted ms-2" style={{ fontSize: 12 }}>
              (used for map — be as specific as possible)
            </span>
          </label>
          <input
            type="text"
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. 12 MG Road, Bengaluru, Karnataka 560001"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Price</label>
          <input
            required
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter monthly rent"
          />
        </div>

        <div className="col-12">
          <label className="form-label">
            Property Images
            <span className="text-muted ms-2" style={{ fontSize: 12 }}>
              (select multiple — first image is used as cover)
            </span>
          </label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          {previews.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mt-3">
              {previews.map((src, i) => (
                <div key={i} style={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="rounded"
                    style={{ width: 100, height: 80, objectFit: "cover" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    style={{
                      position: "absolute", top: 2, right: 2,
                      background: "rgba(0,0,0,0.55)", border: "none",
                      borderRadius: "50%", color: "#fff",
                      width: 20, height: 20, fontSize: 11,
                      cursor: "pointer", lineHeight: 1,
                    }}
                  >
                    ✕
                  </button>
                  {i === 0 && (
                    <span
                      style={{
                        position: "absolute", bottom: 2, left: 2,
                        background: "rgba(37,99,235,0.85)",
                        color: "#fff", fontSize: 9, padding: "1px 5px",
                        borderRadius: 4,
                      }}
                    >
                      COVER
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            required
            rows="5"
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your property"
          />
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="featuredRequest"
              checked={formData.featuredRequest}
              onChange={(e) => setFormData({ ...formData, featuredRequest: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="featuredRequest">
              Request to be featured on the home page
              <span className="text-muted ms-2" style={{ fontSize: 12 }}>
                (subject to admin approval)
              </span>
            </label>
          </div>
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary px-4" disabled={uploading}>
            {uploading ? "Uploading…" : "Submit Property"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PropertyForm;