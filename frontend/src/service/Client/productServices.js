import httpServices from "../httpServices";

// Create Product
export const createProductService = async (clientId, payload) => {
  return httpServices.post(`/products/client/${clientId}`, payload);
};

// Get Products
export const getProductsService = async (clientId) => {
  return httpServices.get(`/products/client/${clientId}`);
};

// Update Product
export const updateProductService = async (productId, payload) => {
  return httpServices.patch(`/products/${productId}`, payload);
};

// Delete Product
export const deleteProductService = async (productId) => {
  return httpServices.delete(`/products/${productId}`);
};
