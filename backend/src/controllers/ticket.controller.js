import * as ticketService from "../services/ticket.service.js";
/* =========================================================
   CREATE TICKET
========================================================= */

export const createTicket = async (req, res, next) => {
  try {
    const {
      clientId,
      conversationId,
      messageId,
      subject,
      description,
      priority,
      source,
    } = req.body;

    const userId = req.user?.id || null;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    if (!subject?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Subject is required",
      });
    }

    if (!description?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required",
      });
    }

    const ticket = await ticketService.createTicketService({
      userId,
      clientId,
      conversationId,
      messageId: messageId || null,
      subject: subject.trim(),
      description: description.trim(),
      priority: priority || "medium",
      source: source || "ai_chat",
    });

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET SINGLE TICKET
========================================================= */

export const getTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const ticket = await ticketService.getTicketService(ticketId);

    return res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET USER TICKETS
========================================================= */

export const getUserTickets = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    const { page = 1, limit = 10, status, priority } = req.query;

    const result = await ticketService.getUserTicketsService({
      userId,
      page: Number(page),
      limit: Number(limit),
      status,
      priority,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getClientTickets = async (req, res, next) => {
  try {
    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const page = Math.max(Number(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const { status, priority } = req.query;

    const result = await ticketService.getClientTicketsService({
      clientId,
      page,
      limit,
      status,
      priority,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE USER TICKET
========================================================= */

export const updateUserTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const userId = req.user?.id;

    const ticket = await ticketService.updateUserTicketService({
      ticketId,
      userId,
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE CLIENT TICKET
========================================================= */

export const updateClientTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    const ticket = await ticketService.updateClientTicketService({
      ticketId,
      clientId,
      data: req.body,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      data: ticket,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DELETE USER TICKET
========================================================= */

export const deleteUserTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const userId = req.user?.id;

    await ticketService.deleteUserTicketService({
      ticketId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DELETE CLIENT TICKET
========================================================= */

export const deleteClientTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const clientId = req.user?.id;

    if (!clientId) {
      return res.status(400).json({
        success: false,
        message: "Client ID is required",
      });
    }

    await ticketService.deleteClientTicketService({
      ticketId,
      clientId,
    });

    return res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
