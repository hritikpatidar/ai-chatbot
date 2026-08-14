import httpServices from "../httpServices";

export const createProductService = async (clientId, data) => {
  return httpServices.post(`/products/client/${clientId}`, data);
};

export const getProductsService = async (
  clientId,
  { page = 1, limit = 10, status = "" } = {},
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (status) {
    params.append("status", status);
  }

  return httpServices.get(`/products/client/${clientId}?${params.toString()}`);
};

export const updateProductService = async (productId, payload) => {
  return httpServices.patch(`/products/${productId}`, payload);
};

export const deleteProductService = async (productId) => {
  return httpServices.delete(`/products/${productId}`);
};
