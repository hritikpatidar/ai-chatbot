import { searchClientProducts } from "../repositories/product.repository.js";

import { searchClientFAQs } from "../repositories/faq.repository.js";

export const getRelevantClientKnowledge = async (client, clientId, userMessage) => {
  if (!clientId || !userMessage) {
    return {
      products: [],
      faqs: [],
    };
  }

  const isBasicPlan = client?.active_plan === "Basic";
  const limit = isBasicPlan ? 5 : null;
  const [products, faqs] = await Promise.all([
    searchClientProducts(clientId, userMessage, limit),
    searchClientFAQs(clientId, userMessage, limit),
  ]);

  return {
    products,
    faqs,
  };
};

export const buildKnowledgeContext = ({ products = [], faqs = [] }) => {
  const sections = [];

  if (products.length > 0) {
    const productSection = products
      .map((product) => {
        return `
          Product Name: ${product.name}
          Description: ${product.description || "N/A"}
          Category: ${product.category || "N/A"}
          Price: ${product.price !== null && product.price !== undefined
            ? `${product.currency} ${product.price}`
            : "Not available"
          }
          Availability: ${product.availability}
          Stock: ${product.stock !== null && product.stock !== undefined
            ? product.stock
            : "Not available"
          }
          `;
      })
      .join("\n---\n");

    sections.push(`
          RELEVANT PRODUCTS
          -----------------
          ${productSection}
      `);
  }

  if (faqs.length > 0) {
    const faqSection = faqs
      .map((faq) => {
        return `
          Question: ${faq.question}
          Answer: ${faq.answer}
          Category: ${faq.category || "N/A"}
          `;
      })
      .join("\n---\n");

    sections.push(`
          RELEVANT FAQs
          -------------
          ${faqSection}
      `);
  }

  if (sections.length === 0) {
    return `
          No relevant product or FAQ information
          was found for this question.
      `;
  }

  return sections.join("\n");
};
