import {
  createProduct,
  getClientProducts,
  updateProduct,
  deleteProduct,
} from "../services/product.service.js";


export const createProductController = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    let metadata = {};

    if (req.body.metadata) {
      try {
        metadata = JSON.parse(req.body.metadata);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid metadata format",
        });
      }
    }

    const productData = {
      clientId,

      name: req.body.name,

      description: req.body.description || "",

      category: req.body.category || "",

      price:
        req.body.price === "" || req.body.price === undefined
          ? null
          : Number(req.body.price),

      currency: req.body.currency || "INR",

      availability: req.body.availability || "in_stock",

      stock:
        req.body.stock === "" || req.body.stock === undefined
          ? null
          : Number(req.body.stock),

      metadata,

      status: req.body.status || "active",

      image: req.file ? `/uploads/products/${req.file.filename}` : "",
    };

    const product = await createProduct(productData);

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

    const updateData = {
      ...req.body,
    };

    // Uploaded image
    if (req.file) {
      updateData.image = `/uploads/products/${req.file.filename}`;
    }

    // Convert JSON strings from FormData
    if (typeof updateData.metadata === "string") {
      try {
        updateData.metadata = JSON.parse(updateData.metadata);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid metadata format",
        });
      }
    }

    // Convert numeric values
    if (updateData.price === "" || updateData.price === undefined) {
      updateData.price = null;
    } else if (updateData.price !== null) {
      updateData.price = Number(updateData.price);
    }

    if (updateData.stock === "" || updateData.stock === undefined) {
      updateData.stock = null;
    } else if (updateData.stock !== null) {
      updateData.stock = Number(updateData.stock);
    }

    const product = await updateProduct(productId, updateData, req.user);

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
