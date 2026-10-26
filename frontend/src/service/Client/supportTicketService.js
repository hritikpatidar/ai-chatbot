import httpServices from "../httpServices";

export const createSupportTicketService = (payload) => {
    return httpServices.post("/client/support-ticket", payload);
};