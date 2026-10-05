import * as ticketService from "../services/ticket.service.js";



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

    const { status } = req.query;

    const result = await ticketService.getClientTicketsService({
      clientId,
      page,
      limit,
      status,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};


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
