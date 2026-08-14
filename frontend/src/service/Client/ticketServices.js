import httpServices from "../httpServices";

export const getClientTicketsService = async () => {
  return httpServices.get("/tickets/client/all");
};

export const updateClientTicketService = async (ticketId, payload) => {
  return httpServices.patch(`/tickets/client/${ticketId}`, payload);
};

export const deleteClientTicketService = async (ticketId) => {
  return httpServices.delete(`/tickets/client/${ticketId}`);
};