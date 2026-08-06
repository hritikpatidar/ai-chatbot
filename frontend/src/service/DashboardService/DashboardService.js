import getUrl from "../../config";
import httpServices from "../httpServices";

export const getDashboardTotal = () => {
    return httpServices.get(`/${getUrl()}/dashboard-total`);
};

export const getDashboardSales = ({ city, period }) => {
    return httpServices.get(`/${getUrl()}/dashboard-sales?city=${city}&period=${period}`);
}

export const getDashboardOrders = ({ city }) => {
    return httpServices.get(`/${getUrl()}/dashboard-order?city=${city}`);
}

export const getDashboardRecentOrders = ({ city }) => {
    return httpServices.get(`/${getUrl()}/dashboard-recent-order?city=${city}`);
}

export const getDashboardStock = () => {
    return httpServices.get(`/${getUrl()}/dashboard-stock`);
}

export const getDashboardTopProducts = ({ period }) => {
    return httpServices.get(`/${getUrl()}/dashboard-top-five-product?period=${period}`);
}

export const getDashboardTopCustomers = () => {
    return httpServices.get(`/${getUrl()}/dashboard-top-five-customer`);
}

export const getDashboardServiceTotal = () => {
    return httpServices.get(`/${getUrl()}/dashboard-service-total`);
};

export const getDashboardServiceSales = ({ city, period }) => {
    return httpServices.get(`/${getUrl()}/dashboard-service-sales?city=${city}&period=${period}`);
}

export const getDashboardServiceOrders = ({ city }) => {
    return httpServices.get(`/${getUrl()}/dashboard-service-order?city=${city}`);
}

export const getDashboardServiceRecentOrders = ({ city }) => {
    return httpServices.get(`/${getUrl()}/dashboard-service-recent-order?city=${city}`);
}

export const getDashboardServiceTopProducts = ({ period }) => {
    return httpServices.get(`/${getUrl()}/dashboard-service-top-five-product?period=${period}`);
}

export const getDashboardServiceTopCustomers = () => {
    return httpServices.get(`/${getUrl()}/dashboard-service-top-five-customer`);
}
