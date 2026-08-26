import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSubscriptionPlanApi,
  deleteSubscriptionPlanApi,
  getSubscriptionPlanApi,
  getSubscriptionPlansApi,
  updateSubscriptionPlanApi,
} from "../../service/Subscription/subscriptionPlanService";

/* =========================================================
   QUERY KEYS
========================================================= */

export const subscriptionPlanKeys = {
  all: ["subscription-plans"],

  list: () => [...subscriptionPlanKeys.all, "list"],

  detail: (planId) => [...subscriptionPlanKeys.all, "detail", planId],
};

/* =========================================================
   GET ALL
========================================================= */

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: subscriptionPlanKeys.list(),

    queryFn: getSubscriptionPlansApi,

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

/* =========================================================
   GET SINGLE
========================================================= */

export const useSubscriptionPlan = (planId) => {
  return useQuery({
    queryKey: subscriptionPlanKeys.detail(planId),

    queryFn: () => getSubscriptionPlanApi(planId),

    enabled: Boolean(planId),

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,

    retry: 1,
  });
};

/* =========================================================
   CREATE
========================================================= */

export const useCreateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSubscriptionPlanApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanKeys.list(),
      });
    },
  });
};

/* =========================================================
   UPDATE
========================================================= */

export const useUpdateSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSubscriptionPlanApi,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanKeys.list(),
      });

      queryClient.invalidateQueries({
        queryKey: subscriptionPlanKeys.detail(variables.planId),
      });
    },
  });
};

/* =========================================================
   DELETE
========================================================= */

export const useDeleteSubscriptionPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscriptionPlanApi,

    onSuccess: (_, planId) => {
      queryClient.invalidateQueries({
        queryKey: subscriptionPlanKeys.list(),
      });

      queryClient.removeQueries({
        queryKey: subscriptionPlanKeys.detail(planId),
      });
    },
  });
};
