import FAQ from "../models/FAQ.js";

export const createFAQ = async (faqData) => {
  return await FAQ.create(faqData);
};

export const findFAQById = async (faqId) => {
  return await FAQ.findById(faqId);
};

export const getClientFAQs = async ({
  clientId,
  page = 1,
  limit = 10,
  search = "",
}) => {
  const filter = {
    clientId,
  };

  if (search?.trim()) {
    filter.$or = [
      {
        question: {
          $regex: search.trim(),
          $options: "i",
        },
      },
      {
        answer: {
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
    ];
  }

  const skip = (page - 1) * limit;

  const [faqs, total] = await Promise.all([
    FAQ.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    FAQ.countDocuments(filter),
  ]);

  return {
    faqs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const searchClientFAQs = async (clientId, searchText, limit = 5) => {
  return await FAQ.find(
    {
      clientId,
      // status: "active",
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

export const updateFAQ = async (faqId, data) => {
  return await FAQ.findByIdAndUpdate(faqId, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteFAQ = async (faqId) => {
  return await FAQ.findByIdAndDelete(faqId);
};

export const getFaqCountByClientId = async (clientId) => {
  return await FAQ.countDocuments({
    clientId,
    // status: "active",
  });
};
