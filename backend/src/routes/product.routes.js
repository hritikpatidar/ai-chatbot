import express from "express";

import {
  createProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

import authMiddleware from "../middlewares/auth.js";

const router = express.Router();


router.post("/client/:clientId", authMiddleware, createProductController);
router.get("/client/:clientId", authMiddleware, getProductsController);
router.patch("/:productId", authMiddleware, updateProductController);
router.delete("/:productId", authMiddleware, deleteProductController);

export default router;
