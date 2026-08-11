import express from "express";

import {
  createProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

/*
 * Create Product
 */
router.post("/client/:clientId", authMiddleware, createProductController);

/*
 * Get Client Products
 */
router.get("/client/:clientId", authMiddleware, getProductsController);

/*
 * Update Product
 */
router.patch("/:productId", authMiddleware, updateProductController);

/*
 * Delete Product
 */
router.delete("/:productId", authMiddleware, deleteProductController);

export default router;
