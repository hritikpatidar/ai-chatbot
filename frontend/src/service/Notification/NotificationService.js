import httpServices from "../httpServices";

export const getNotificationsApi = async ({ page = 1, limit = 5, filter } = {}) => {
    return httpServices.get(`/notifications?page=${page}&limit=${limit}&filter=${filter}`);
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