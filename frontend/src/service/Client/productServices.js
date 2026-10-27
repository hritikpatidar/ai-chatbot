import httpServices from "../httpServices";

export const createProductService = async (clientId, data) => {
  return httpServices.post(`/products/client/${clientId}`, data);
};

export const getProductsService = async (
  clientId,
  { page = 1, limit = 10, search = "" } = {},
) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);

  if (search) {
    params.append("search", search);
  }

  return httpServices.get(`/products/client/${clientId}?${params.toString()}`);
};

export const updateProductService = async (productId, payload) => {
  return httpServices.patch(`/products/${productId}`, payload);
};

export const deleteProductService = async (productId) => {
  return httpServices.delete(`/products/${productId}`);
};
