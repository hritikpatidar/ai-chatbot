import Ticket from "../models/Ticket.js";

export const createTicket = async (data) => {
  return await Ticket.create(data);
};

export const findOpenTicketByConversation = async (conversationId) => {
  return await Ticket.findOne({
    conversationId,
    status: {
      $in: ["open", "in_progress"],
    },
  });
};

export const findTicketById = async (ticketId) => {
  return await Ticket.findById(ticketId)
    .populate("userId", "fullName email")
    .populate("clientId", "businessName clientKey")
    .populate("conversationId")
    .populate("messageId");
};

export const findTicketRawById = async (ticketId) => {
  return await Ticket.findById(ticketId);
};

export const findTicketsByUser = async ({
  userId,
  page = 1,
  limit = 10,
  status,
  priority,
}) => {
  const filter = {
    userId,
  };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate("clientId", "businessName clientKey")
      .populate("conversationId", "title lastMessage lastMessageAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Ticket.countDocuments(filter),
  ]);

  return {
    tickets,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const findTicketsByClient = async ({
  clientId,
  page = 1,
  limit = 10,
  status,
  priority,
}) => {
  const filter = {
    clientId,
  };

  if (status) {
    filter.status = status;
  }

  if (priority) {
    filter.priority = priority;
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate("userId", "fullName email")
      .populate("conversationId", "title lastMessage lastMessageAt")
      .populate("messageId", "role text createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Ticket.countDocuments(filter),
  ]);

  return {
    tickets,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const updateTicketById = async (ticketId, updateData) => {
  return await Ticket.findByIdAndUpdate(
    ticketId,
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .populate("userId", "fullName email")
    .populate("clientId", "businessName clientKey")
    .populate("conversationId")
    .populate("messageId");
};

export const deleteTicketById = async (ticketId) => {
  return await Ticket.findByIdAndDelete(ticketId);
};

export const findTicketByIdAndUser = async (ticketId, userId) => {
  return await Ticket.findOne({
    _id: ticketId,
    userId,
  });
};

export const findTicketByIdAndClient = async (ticketId, clientId) => {
  return await Ticket.findOne({
    _id: ticketId,
    clientId,
  });
};
