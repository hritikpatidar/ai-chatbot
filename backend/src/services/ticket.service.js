import {
  createTicket,
  findOpenTicketByConversation,
  findTicketById,
  findTicketByIdAndUser,
  findTicketByIdAndClient,
  findTicketsByUser,
  findTicketsByClient,
  updateTicketById,
  deleteTicketById,
} from "../repositories/ticket.repository.js";

export const createAITicketService = async ({
  userId,
  clientId,
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
    conversationId,
    messageId,
    subject: "AI Chat Support Required",
    description: userMessage,
    status: "open",
    priority: "medium",
    source: "ai_chat",
  });

  return ticket;
};

export const getTicketService = async (ticketId) => {
  const ticket = await findTicketById(ticketId);

  if (!ticket) {
    throw new Error("Ticket not found");
  }

  return ticket;
};

export const getUserTicketsService = async ({
  userId,
  page,
  limit,
  status,
  priority,
}) => {
  return await findTicketsByUser({
    userId,
    page,
    limit,
    status,
    priority,
  });
};

export const getClientTicketsService = async ({
  clientId,
  page,
  limit,
  status,
  priority,
}) => {
  return await findTicketsByClient({
    clientId,
    page,
    limit,
    status,
    priority,
  });
};

export const updateUserTicketService = async ({ ticketId, userId, data }) => {
  const ticket = await findTicketByIdAndUser(ticketId, userId);

  if (!ticket) {
    throw new Error("Ticket not found or unauthorized");
  }
  const allowedData = {};
  if (data.subject !== undefined) {
    allowedData.subject = data.subject;
  }
  if (data.description !== undefined) {
    allowedData.description = data.description;
  }
  if (data.priority !== undefined) {
    allowedData.priority = data.priority;
  }
  const updatedTicket = await updateTicketById(ticketId, allowedData);
  return updatedTicket;
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

  if (data.priority !== undefined) {
    allowedData.priority = data.priority;
  }
  
  if (data.priority !== undefined) {
    allowedData.priority = data.priority;
  }

  if (data.subject !== undefined) {
    allowedData.subject = data.subject;
  }

  if (data.description !== undefined) {
    allowedData.description = data.description;
  }

  return await updateTicketById(ticketId, allowedData);
};

export const deleteUserTicketService = async ({ ticketId, userId }) => {
  const ticket = await findTicketByIdAndUser(ticketId, userId);

  if (!ticket) {
    throw new Error("Ticket not found or unauthorized");
  }

  await deleteTicketById(ticketId);

  return true;
};

export const deleteClientTicketService = async ({ ticketId, clientId }) => {
  const ticket = await findTicketByIdAndClient(ticketId, clientId);

  if (!ticket) {
    throw new Error("Ticket not found or unauthorized");
  }

  await deleteTicketById(ticketId);

  return true;
};
