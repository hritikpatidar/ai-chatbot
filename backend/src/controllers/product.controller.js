import {
  createProduct,
  getClientProducts,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";

export const createProductController = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const product = await createProduct({
      clientId,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductsController = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const products = await getClientProducts(clientId);

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProductController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await updateProduct(productId, req.body);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductController = async (req, res, next) => {
  try {
    const { productId } = req.params;

    await deleteProduct(productId);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
