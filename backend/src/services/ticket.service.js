import env from "../config/env.js";
import transporter from "../config/mail.js";
import { ticketCreatedEmailTemplate, ticketStatusUpdateEmailTemplate } from "../helpers/emailTemplate.js";
import {
  createTicket,
  findOpenTicketByConversation,
  findTicketByIdAndClient,
  findTicketsByClient,
  updateTicketById,
  deleteTicketById,
} from "../repositories/ticket.repository.js";

export const createAITicketService = async ({
  userId,
  clientId,
  guestId,
  conversationId,
  messageId,
  userMessage,
}) => {
  const existingTicket = await findOpenTicketByConversation(conversationId);

  if (existingTicket) {
    return existingTicket;
  }

  const ticket = await createTicket({
    userId,
    clientId,
    guestId,
    conversationId,
    messageId,
    subject: "AI Chat Support Required",
    description: userMessage,
    status: "open",
    source: "ai_chat",
  });

  try {

    const emailTemplate = ticketCreatedEmailTemplate({
      fullName: ticket.guestKeyId.fullName,
      ticketId: ticket.id?.slice(-8) || ticket._id,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
    });

    const info = await transporter.sendMail({
      from: `"AI Chatbot" <${env.MAIL_USER}>`,
      to: ticket.guestKeyId.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log(
      `✅ Ticket creation email sent to ${ticket.guestKeyId.email}`,
      info.messageId
    );

  } catch (error) {

    console.error(
      `❌ Failed to send ticket creation email to ${ticket.guestKeyId.email}`,
      error
    );

  }

  return ticket;
};


export const getClientTicketsService = async ({
  clientId,
  page,
  limit,
  status,
}) => {
  return await findTicketsByClient({
    clientId,
    page,
    limit,
    status,
  });
};


export const updateClientTicketService = async ({
  ticketId,
  clientId,
  data,
}) => {
  const ticket = await findTicketByIdAndClient(ticketId, clientId);

  if (!ticket) {
    throw new Error("Ticket not found or unauthorized");
  }

  const allowedData = {};

  if (data.status !== undefined) {
    allowedData.status = data.status;
  }
  const previousStatus = ticket.status;
  // Update ticket
  const updatedTicket = await updateTicketById(
    ticketId,
    allowedData
  );
  // Send email only when status is actually changed
  if (
    data.status !== undefined &&
    previousStatus !== data.status
  ) {
    const emailTemplate = ticketStatusUpdateEmailTemplate({
      fullName: updatedTicket.guestKeyId.fullName,
      ticketId: updatedTicket.id?.slice(-8) || updatedTicket._id,
      subject: updatedTicket.subject,
      status: data.status,
      previousStatus,
    });

    try {
      const info = await transporter.sendMail({
        from: `"AI Chatbot" <${env.MAIL_USER}>`,
        to: updatedTicket.guestKeyId.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      console.log(
        `✅ Ticket status update email sent to ${updatedTicket.guestKeyId.email}`,
        info.messageId
      );
    } catch (error) {
      console.error(
        `❌ Failed to send ticket status email to ${updatedTicket.guestKeyId.email}`,
        error
      );
    }
  }

  return updatedTicket;
};


export const deleteClientTicketService = async ({ ticketId, clientId }) => {
  const ticket = await findTicketByIdAndClient(ticketId, clientId);

  if (!ticket) {
    throw new Error("Ticket not found or unauthorized");
  }

  await deleteTicketById(ticketId);

  return true;
};
