import httpServices from "../httpServices";

export const createProductService = async (clientId, data) => {
  return httpServices.post(`/products/client/${clientId}`, data);
};

export const getProductsService = async (clientId) => {
  return httpServices.get(`/products/client/${clientId}`);
};

export const updateProductService = async (productId, payload) => {
  return httpServices.patch(`/products/${productId}`, payload);
};

export const deleteProductService = async (productId) => {
  return httpServices.delete(`/products/${productId}`);
};
