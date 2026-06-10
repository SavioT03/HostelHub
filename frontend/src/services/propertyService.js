import API from "./api";

export const createProperty = async (data) => {
  const res = await API.post("/api/properties/add", data);
  return res.data;
};

export const getOwnerProperties = async (ownerId) => {
  const res = await API.get(`/api/properties/${ownerId}`);
  return res.data;
};

export const updateProperty = async (id, data) => {
  const res = await API.put(`/api/properties/${id}`, data);
  return res.data;
};

export const deleteProperty = async (id) => {
  const res = await API.delete(`/api/properties/${id}`);
  return res.data;
};

export const getApprovedProperties = async () => {
  const res = await API.get("/api/properties/approved");
  return res.data;
};

export const getPropertyById = async (id) => {
  const res = await API.get(`/api/properties/detail/${id}`);
  return res.data;
};

export const uploadPropertyImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await API.post("/api/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getSavedProperties = async (userId) => {
  const res = await API.get(`/api/users/${userId}/saved`);
  return res.data;
};
 
export const saveProperty = async (userId, propertyId) => {
  const res = await API.post(`/api/users/${userId}/saved/${propertyId}`);
  return res.data;
};
 
export const unsaveProperty = async (userId, propertyId) => {
  const res = await API.delete(`/api/users/${userId}/saved/${propertyId}`);
  return res.data;
};

export const getFeaturedProperties = async () => {
  const res = await API.get("/api/properties/featured");
  return res.data;
};