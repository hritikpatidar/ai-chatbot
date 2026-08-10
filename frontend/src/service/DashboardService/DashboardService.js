import getUrl from "../../config";
import httpServices from "../httpServices";

export const getDashboardTotal = () => {
    return httpServices.get(`/${getUrl()}/dashboard-total`);
};

e