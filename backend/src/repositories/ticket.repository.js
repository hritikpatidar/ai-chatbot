import Ticket from "../models/Ticket.js";

export const createTicket = async (data) => {
  const ticket = await Ticket.create(data);

  return await Ticket.findById(ticket._id)
    .populate("userId", "fullName email")
    .populate("guestKeyId", "fullName email phone")
    .populate("clientId", "businessName clientKey")
    .populate("conversationId")
    .populate("messageId");
};

export const findOpenTicketByConversation = async (conversationId) => {
  return await Ticket.findOne({
    conversationId,
    status: {
      $in: ["open", "in_progress"],
    },
  });
};


export const findTicketsByClient = async ({
  clientId,
  page = 1,
  limit = 10,
  status,
}) => {
  const filter = {
    clientId,
  };

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [tickets, total] = await Promise.all([
    Ticket.find(filter)
      .populate("userId", "fullName email")
      .populate("guestKeyId", "fullName email phone")
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
  return await Ticket.findByIdAndUpdate(ticketId, updateData, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("userId", "fullName email")
    .populate("guestKeyId", "fullName email phone")
    .populate("clientId", "businessName clientKey")
    .populate("conversationId")
    .populate("messageId");
};

export const deleteTicketById = async (ticketId) => {
  return await Ticket.findByIdAndDelete(ticketId);
};


export const findTicketByIdAndClient = async (ticketId, clientId) => {
  return await Ticket.findOne({
    _id: ticketId,
    clientId,
  });
};
