import {
  createProduct as createProductRepository,
  getClientProducts as getClientProductsRepository,
  updateProduct as updateProductRepository,
  deleteProduct as deleteProductRepository,
} from "../repositories/product.repository.js";

import { findClientById } from "../repositories/client.repository.js";

export const createProduct = async (productData) => {
  const client = await findClientById(productData.clientId);

  if (!client) {
    throw new Error("Client not found");
  }

  return await createProductRepository(productData);
};

export const getClientProducts = async ({ clientId, page = 1, limit = 10 }) => {
  const client = await findClientById(clientId);

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return await getClientProductsRepository({
    clientId,
    page,
    limit,
  });
};

export const updateProduct = async (productId, data) => {
  const product = await updateProductRepository(productId, data);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};

export const deleteProduct = async (productId) => {
  const product = await deleteProductRepository(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};
