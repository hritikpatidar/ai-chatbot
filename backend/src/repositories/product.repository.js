import Product from "../models/Product.js";

export const createProduct = async (productData) => {
  return await Product.create(productData);
};

export const findProductById = async (productId) => {
  return await Product.findById(productId);
};

export const getClientProductsByClientId = async ({ client, clientId, page = 1, limit = 5, search = "" }) => {
  //client product list service
  const filter = {
    clientId,
    // status: "active",
  };

  if (search?.trim()) {
    filter.$or = [
      {
        name: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        category: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        description: {
          $regex: search.trim(),
          $options: "i",
        },
      },
    ];
  }
  const isBasicPlan = client?.active_plan === "Basic";
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find(filter)
      // .sort({
      //   createdAt: -1,
      // })
      // .skip(skip)
      // .limit(limit),
      .sort({ createdAt: isBasicPlan ? 1 : -1 })
      .skip(isBasicPlan ? 0 : skip)
      .limit(isBasicPlan ? 5 : limit),

    Product.countDocuments(filter),
  ]);

  const total = isBasicPlan
    ? Math.min(totalCount, 5)
    : totalCount;

  const totalPages = Math.ceil(total / (isBasicPlan ? 5 : limit));

  return {
    products,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const searchClientProducts = async (clientId, searchText, limit = 5) => {
  //ai product service
  const query = Product.find(
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
    }
  ).sort({
    score: {
      $meta: "textScore",
    },
  });

  // null means no limit
  if (limit !== null) {
    query.limit(limit);
  }

  return await query;
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
