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

  return await updateTicketById(ticketId, allowedData);
};


export const deleteClientTicketService = async ({ ticketId, clientId }) => {
  const ticket = await findTicketByIdAndClient(ticketId, clientId);

  if (!ticket) {
    throw new Error("Ticket not found or unauthorized");
  }

  await deleteTicketById(ticketId);

  return true;
};
