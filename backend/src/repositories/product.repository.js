import Product from "../models/Product.js";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const findProductById = async (productId) => {
  return await Product.findById(productId);
};

export const getClientProducts = async ({ clientId, page = 1, limit = 10 }) => {
  const filter = {
    clientId,
    // status: "active",
  };

  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
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

export const getProductCountByClientId = async (clientId) => {
  return await Product.countDocuments({
    clientId,
    // status: "active",
  });
};
