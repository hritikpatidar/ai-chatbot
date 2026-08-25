import fs from "fs/promises";
import path from "path";
import {
  createProduct as createProductRepository,
  getClientProducts as getClientProductsRepository,
  updateProduct as updateProductRepository,
  deleteProduct as deleteProductRepository,
  findProductById,
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

export const updateProduct = async (productId, data, user) => {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (
    user?.role === "client" &&
    product.clientId?.toString() !== user.id?.toString()
  ) {
    throw new Error("You are not authorized to update this product");
  }

  const oldImagePath = product.image;
  const updatedProduct = await updateProductRepository(productId, data);

  if (!updatedProduct) {
    throw new Error("Product not found");
  }

  if (data.image && oldImagePath && oldImagePath !== data.image) {
    try {
      const oldFilePath = path.join(
        process.cwd(),
        "src",
        oldImagePath.replace(/^\/uploads\//, "uploads/"),
      );
      await fs.unlink(oldFilePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("❌ Old product image delete failed:", error);
      }
    }
  }

  return updatedProduct;
};

export const deleteProduct = async (productId) => {
  const product = await findProductById(productId);

  if (!product) {
    throw new Error("Product not found");
  }
  const imagePath = product.image;

  await deleteProductRepository(productId);

  if (imagePath) {
    try {
      const cleanImagePath = imagePath.replace(/^\/+/, "");
      const filePath = path.join(process.cwd(), "src", cleanImagePath);
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Product image delete error:", error);
      }
    }
  }

  return product;
};
