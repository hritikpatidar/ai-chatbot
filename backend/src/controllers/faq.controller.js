import {
  createFAQ,
  getClientFAQs,
  updateFAQ,
  deleteFAQ,
} from "../services/faq.service.js";

export const createFAQController = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const faq = await createFAQ({
      clientId,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "FAQ created successfully",
      faq,
    });
  } catch (error) {
    next(error);
  }
};

export const getFAQsController = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const faqs = await getClientFAQs(clientId);

    return res.status(200).json({
      success: true,
      faqs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFAQController = async (req, res, next) => {
  try {
    const { faqId } = req.params;

    const faq = await updateFAQ(faqId, req.body);

    return res.status(200).json({
      success: true,
      message: "FAQ updated successfully",
      faq,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQController = async (req, res, next) => {
  try {
    const { faqId } = req.params;

    await deleteFAQ(faqId);

    return res.status(200).json({
      success: true,
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
