import axiosInstance from "./axios";

const httpServices = {
  async get(endpoint, config = {}) {
    const response = await axiosInstance.get(`${endpoint}`, config);

    return response;
  },

  async post(endpoint, data, config = {}) {
    const response = await axiosInstance.post(`${endpoint}`, data, config);

    return response;
  },

  async put(endpoint, data, config = {}) {
    const response = await axiosInstance.put(`${endpoint}`, data, config);

    return response;
  },

  async patch(endpoint, data, config = {}) {
    const response = await axiosInstance.patch(`${endpoint}`, data, config);

    return response;
  },

  async delete(endpoint, config = {}) {
    const response = await axiosInstance.delete(`${endpoint}`, config);

    return response;
  },
};

export default httpServices;
