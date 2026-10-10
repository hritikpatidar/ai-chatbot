import httpServices from "../httpServices";

export const getNotificationsApi = async ({ page = 1, limit = 10, } = {}) => {
    return httpServices.get(`/notifications?page=${page}&limit=${limit}`);
};

export const markAllNotificationsReadApi = async () => {
    return httpServices.patch(`/notifications/read-all`);
};

export const markNotificationReadApi = async (notificationId) => {
    return httpServices.patch(`/notifications/${notificationId}/read`);
};

export const deleteNotificationsApi = async (notificationId) => {
    return httpServices.delete(`/notifications/${notificationId}/delete`);
};