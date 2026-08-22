import express from "express";

import {
  createProductController,
  getProductsController,
  updateProductController,
  deleteProductController,
} from "../controllers/product.controller.js";

import authMiddleware from "../middlewares/auth.js";
import uploadProductImage from "../middlewares/uploadProductImage.js";

const router = express.Router();

router.post(
  "/client/:clientId",
  authMiddleware,
  uploadProductImage.single("image"),
  createProductController,
);
router.get("/client/:clientId", authMiddleware, getProductsController);
router.patch(
  "/:productId",
  authMiddleware,
  uploadProductImage.single("image"),
  updateProductController,
);
router.delete("/:productId", authMiddleware, deleteProductController);

export default router;
