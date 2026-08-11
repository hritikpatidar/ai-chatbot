import Product from "../models/Product.js";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const findProductById = async (productId) => {
  return await Product.findById(productId);
};

export const getClientProducts = async (clientId) => {
  return await Product.find({
    clientId,
    status: "active",
  }).sort({
    createdAt: -1,
  });
};

export const searchClientProducts = async (clientId, searchText, limit = 5) => {
  return await Product.find(
    {
      clientId,
      status: "active",
      $text: {
        $search: searchText,
      },
    },
    {
      score: {
        $meta: "textScore",
      },
    },
  )
    .sort({
      score: {
        $meta: "textScore",
      },
    })
    .limit(limit);
};

export const updateProduct = async (productId, data) => {
  return await Product.findByIdAndUpdate(productId, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProduct = async (productId) => {
  return await Product.findByIdAndDelete(productId);
};
