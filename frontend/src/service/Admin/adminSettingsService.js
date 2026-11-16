import httpServices from "../httpServices";

export const getAdminSettingsService = async () => {
    return httpServices.get(`/admin/settings`);
};

export const getAdminGeminiModelsService = async () => {
    return httpServices.get(`/admin/ai-models`);
};

export const updateAdminSettingsService = async (payload) => {
    return httpServices.patch(`/admin/settings`, payload);
};
