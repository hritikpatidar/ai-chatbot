import httpServices from "../httpServices";


export const getClientTicketsService = async ({
  page = 1,
  limit = 10,
  status = "",
  priority = "",
} = {}) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  if (status) {
    params.append("status", status);
  }
  if (priority) {
    params.append("priority", priority);
  }
  return httpServices.get(`/tickets/client/all?${params.toString()}`);
};

export const updateClientTicketService = async (ticketId, payload) => {
  return httpServices.patch(`/tickets/client/${ticketId}`, payload);
};

export const deleteClientTicketService = async (ticketId) => {
  return httpServices.delete(`/tickets/client/${ticketId}`);
};
