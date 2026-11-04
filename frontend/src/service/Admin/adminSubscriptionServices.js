import httpServices from "../httpServices";

export const getAdminSubscriptionsService = ({ search = "", status = "all" }) => {
    return httpServices.get(`/admin/subscriptions?search=${search}&status=${status}`);
};
