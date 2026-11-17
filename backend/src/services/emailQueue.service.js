import env from "../config/env.js";
import EmailJob from "../models/EmailJob.js";

const fromAddress = env.MAIL_FROM || `"AI Chatbot" <${env.MAIL_USER}>`;

export const enqueueEmail = async ({
  to,
  subject,
  html = "",
  text = "",
  inReplyTo = null,
  references = null,
  supportTicketId = null,
  purpose = "generic",
}) => {
  if (!env.MAIL_FROM && !env.MAIL_USER) {
    throw new Error("Email sender is not configured; set MAIL_FROM or MAIL_USER");
  }
  if (typeof to !== "string" || !to.trim()) {
    throw new Error("Email recipient is required");
  }
  if (typeof subject !== "string" || !subject.trim()) {
    throw new Error("Email subject is required");
  }
  if (!html && !text) {
    throw new Error("Email content is required");
  }

  const job = await EmailJob.create({
    to: to.trim(),
    from: fromAddress,
    subject,
    html,
    text,
    inReplyTo,
    references,
    supportTicketId,
    purpose,
  });

  return job;
};
