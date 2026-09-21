import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    addPaymentMethodApi,
    getPaymentMethodsApi,
    removePaymentMethodApi,
    setDefaultPaymentMethodApi,
} from "../../service/Subscription/subscriptionPaymentService";

export const paymentMethodKeys = {
    all: ["payment-methods"],

    list: (subscriptionId) => [
        ...paymentMethodKeys.all,
        "list",
        subscriptionId,
    ],
};

/**
 * Get payment methods
 */
export const usePaymentMethods = (subscriptionId) => {
    return useQuery({
        queryKey: paymentMethodKeys.list(subscriptionId),

        queryFn: async () => {
            const response = await getPaymentMethodsApi(subscriptionId);

            if (response?.data?.success === false) {
                throw new Error(
                    response?.data?.message ||
                    "Failed to fetch payment methods",
                );
            }
            return response?.data?.data;
        },

        enabled: Boolean(subscriptionId),
        staleTime: 30 * 1000,
        refetchOnWindowFocus: false,
        retry: 1,
    });
};

/**
 * Add payment method
 */
export const useAddPaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: addPaymentMethodApi,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.list(
                    variables.subscriptionId,
                ),
            });
        },
    });
};

/**
 * Set default payment method
 */
export const useSetDefaultPaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: setDefaultPaymentMethodApi,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.list(
                    variables.subscriptionId,
                ),
            });
        },
    });
};

/**
 * Remove payment method
 */
export const useRemovePaymentMethod = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: removePaymentMethodApi,
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: paymentMethodKeys.list(
                    variables.subscriptionId,
                ),
            });
        },
    });
};