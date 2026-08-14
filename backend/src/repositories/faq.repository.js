import FAQ from "../models/FAQ.js";

export const createFAQ = async (faqData) => {
  return await FAQ.create(faqData);
};

export const findFAQById = async (faqId) => {
  return await FAQ.findById(faqId);
};

export const getClientFAQs = async (clientId) => {
  return await FAQ.find({
    clientId,
    // status: "active",
  }).sort({
    createdAt: -1,
  });
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