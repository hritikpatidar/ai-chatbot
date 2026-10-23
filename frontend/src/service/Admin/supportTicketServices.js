import httpServices from "../httpServices";

export const getSupportTicketsService = ({ page, limit, search = "", status = "", priority = "" }) => {
    return httpServices.get(`/support-tickets/admin?page=${page}&limit=${limit}&search=${search}&status=${status}&priority=${priority}`);
};

export const getSupportTicketByIdService = (ticketId) => {
    return httpServices.get(`/support-tickets/admin/${ticketId}`);
};

export const replyToSupportTicketService = (ticketId, payload) => {
    return httpServices.post(`/support-tickets/admin/${ticketId}/reply`, payload);
};

export const updateSupportTicketStatusService = (ticketId, payload) => {
    return httpServices.patch(`/support-tickets/admin/${ticketId}/status`, payload);
};