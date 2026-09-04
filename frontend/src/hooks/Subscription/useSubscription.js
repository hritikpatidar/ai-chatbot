import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getSubscriptionPlansApi,
  getCurrentSubscriptionApi,
  getUserCurrentSubscriptionApi,
  createSubscriptionApi,
  previewSubscriptionApi,
  changeSubscriptionPlanApi,
  getPaymentMethodsApi,
  addPaymentMethodApi,
  setDefaultPaymentMethodApi,
  removePaymentMethodApi,
} from "../../service/Subscription/subscriptionServices";

/* =========================================================
   QUERY KEYS
========================================================= */

export const subscriptionKeys = {
  all: ["subscription"],

  plans: () => [
    ...subscriptionKeys.all,
    "plans",
  ],

  current: () => [
    ...subscriptionKeys.all,
    "current",
  ],

  userCurrent: () => [
    ...subscriptionKeys.all,
    "user-current",
  ],

  paymentMethods: () => [
    ...subscriptionKeys.all,
    "payment-methods",
  ],
};

/* =========================================================
   PLANS
========================================================= */

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: subscriptionKeys.plans(),

    queryFn: getSubscriptionPlansApi,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

/* =========================================================
   CURRENT SUBSCRIPTION
========================================================= */

export const useCurrentSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.current(),

    queryFn: getCurrentSubscriptionApi,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

/* =========================================================
   USER CURRENT SUBSCRIPTION
========================================================= */

export const useUserCurrentSubscription = () => {
  return useQuery({
    queryKey: subscriptionKeys.userCurrent(),

    queryFn: getUserCurrentSubscriptionApi,

    staleTime: 30 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

/* =========================================================
   CREATE SUBSCRIPTION
========================================================= */

export const useCreateSubscription = () => {
  return useMutation({
    mutationFn: createSubscriptionApi,
  });
};

/* =========================================================
   PREVIEW
========================================================= */

export const usePreviewSubscription = () => {
  return useMutation({
    mutationFn: previewSubscriptionApi,
  });
};

/* =========================================================
   CHANGE PLAN
========================================================= */

export const useChangeSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeSubscriptionPlanApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.all,
      });
    },
  });
};

/* =========================================================
   PAYMENT METHODS
========================================================= */

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: subscriptionKeys.paymentMethods(),

    queryFn: getPaymentMethodsApi,

    staleTime: 60 * 1000,

    refetchOnWindowFocus: false,
  });
};

export const useAddPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addPaymentMethodApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.paymentMethods(),
      });
    },
  });
};

export const useSetDefaultPaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultPaymentMethodApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.paymentMethods(),
      });
    },
  });
};

export const useRemovePaymentMethod = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePaymentMethodApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionKeys.paymentMethods(),
      });
    },
  });
};