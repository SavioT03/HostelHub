import API from "./api";

export const getProfile = async (id) => {

  const response = await API.get(
    `/api/profile/${id}`
  );

  return response.data;

};

export const updateProfile = async (
  id,
  data
) => {

  const response = await API.put(
    `/api/profile/${id}`,
    data
  );

  return response.data;

};