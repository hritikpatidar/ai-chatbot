import {
  createFAQ as createFAQRepository,
  getClientFAQs as getClientFAQsRepository,
  updateFAQ as updateFAQRepository,
  deleteFAQ as deleteFAQRepository,
} from "../repositories/faq.repository.js";

import { findClientById } from "../repositories/client.repository.js";

export const createFAQ = async (faqData) => {
  const client = await findClientById(faqData.clientId);

  if (!client) {
    throw new Error("Client not found");
  }

  return await createFAQRepository(faqData);
};

export const getClientFAQs = async ({ clientId, page, limit, search }) => {
  const client = await findClientById(clientId);

  if (!client) {
    throw new Error("Client not found");
  }

  return await getClientFAQsRepository({
    clientId,
    page,
    limit,
    search,
  });
};

export const updateFAQ = async (faqId, data) => {
  const faq = await updateFAQRepository(faqId, data);

  if (!faq) {
    throw new Error("FAQ not found");
  }

  return faq;
};

export const deleteFAQ = async (faqId) => {
  const faq = await deleteFAQRepository(faqId);

  if (!faq) {
    throw new Error("FAQ not found");
  }

  return faq;
};
