import FAQ from "../models/FAQ.js";

export const createFAQ = async (faqData) => {
  return await FAQ.create(faqData);
};

export const findFAQById = async (faqId) => {
  return await FAQ.findById(faqId);
};

export const getClientFAQs = async ({
  client,
  clientId,
  page = 1,
  limit = 5,
  search = "",
}) => {
  //client faq list service
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
  const isBasicPlan = client?.active_plan === "Basic";
  const skip = (page - 1) * limit;

  const [faqs, totalCount] = await Promise.all([
    FAQ.find(filter)
      // .sort({
      //   createdAt: -1,
      // })
      // .skip(skip)
      // .limit(limit),
      .sort({ createdAt: isBasicPlan ? 1 : -1 })
      .skip(isBasicPlan ? 0 : skip)
      .limit(isBasicPlan ? 5 : limit),

    FAQ.countDocuments(filter),
  ]);

  const total = isBasicPlan
    ? Math.min(totalCount, 5)
    : totalCount;

  const totalPages = Math.ceil(total / (isBasicPlan ? 5 : limit));

  return {
    faqs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const searchClientFAQs = async (clientId, searchText, limit = 5) => {
  //ai faq service
  const query = FAQ.find(
    {
      clientId,
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
