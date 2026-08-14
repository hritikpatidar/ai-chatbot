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

    const { page = 1, limit = 10 } = req.query;

    const result = await getClientProducts({
      clientId,
      page: Number(page),
      limit: Number(limit),
    });

    return res.status(200).json({
      success: true,
      data: result,
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
