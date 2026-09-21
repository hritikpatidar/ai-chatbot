import httpServices from "../httpServices";

/* =========================================================
   PAYMENT METHODS
========================================================= */

export const getPaymentMethodsApi = async (subscriptionId) => {
    return httpServices.get(`/subscription/payment-methods?subscriptionId=${subscriptionId}`);
};

/* =========================================================
   ADD PAYMENT METHOD
========================================================= */

export const addPaymentMethodApi = async (payload) => {
    return httpServices.post("/subscription/payment-method", payload);
};

/* =========================================================
   SET DEFAULT PAYMENT METHOD
========================================================= */

export const setDefaultPaymentMethodApi = async (payload) => {
    return httpServices.patch(
        `/subscription/payment-method/default`, payload
    );
};

/* =========================================================
   REMOVE PAYMENT METHOD
========================================================= */

export const removePaymentMethodApi = async ({paymentMethodId,subscriptionId}) => {
    return httpServices.delete(`/subscription/payment-method/${paymentMethodId}?subscriptionId=${subscriptionId}`);
};
