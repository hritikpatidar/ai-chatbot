import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFAQService,
  getFAQsService,
  updateFAQService,
  deleteFAQService,
} from "../../service/Client/faqServices";

const useFAQs = ({ clientId, page = 1, limit = 10, search = "" } = {}) => {
  const queryClient = useQueryClient();

  /* =========================================================
     GET FAQs
  ========================================================= */

  const faqsQuery = useQuery({
    queryKey: ["clientFAQs", clientId, page, limit, search],

    queryFn: async () => {
      const response = await getFAQsService(clientId, {
        page,
        limit,
        search,
      });

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to fetch FAQs");
      }

      /*
        Expected backend response:

        {
          success: true,
          data: {
            faqs: [],
            total: 20,
            page: 1,
            limit: 10,
            totalPages: 2
          }
        }
      */

      return response?.data?.data;
    },

    enabled: Boolean(clientId),

    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  /* =========================================================
     CREATE FAQ
  ========================================================= */

  const createMutation = useMutation({
    mutationFn: async ({ clientId, payload }) => {
      const response = await createFAQService(clientId, payload);

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to create FAQ");
      }

      return response?.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientFAQs", variables.clientId],
      });
    },
  });

  /* =========================================================
     UPDATE FAQ
  ========================================================= */

  const updateMutation = useMutation({
    mutationFn: async ({ faqId, payload }) => {
      const response = await updateFAQService(faqId, payload);

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to update FAQ");
      }

      return response?.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientFAQs"],
      });
    },
  });

  /* =========================================================
     DELETE FAQ
  ========================================================= */

  const deleteMutation = useMutation({
    mutationFn: async (faqId) => {
      const response = await deleteFAQService(faqId);

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to delete FAQ");
      }

      return response?.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientFAQs"],
      });
    },
  });

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    // -------------------------
    // GET
    // -------------------------

    faqs: faqsQuery.data?.faqs || [],

    pagination: {
      total: faqsQuery.data?.total || 0,

      page: faqsQuery.data?.page || page,

      limit: faqsQuery.data?.limit || limit,

      totalPages: faqsQuery.data?.totalPages || 0,
    },

    isLoading: faqsQuery.isLoading,

    isFetching: faqsQuery.isFetching,

    error: faqsQuery.error,

    refetch: faqsQuery.refetch,

    // -------------------------
    // CREATE
    // -------------------------

    createFAQ: createMutation.mutateAsync,

    createLoading: createMutation.isPending,

    createError: createMutation.error,

    // -------------------------
    // UPDATE
    // -------------------------

    updateFAQ: updateMutation.mutateAsync,

    updateLoading: updateMutation.isPending,

    updateError: updateMutation.error,

    // -------------------------
    // DELETE
    // -------------------------

    deleteFAQ: deleteMutation.mutateAsync,

    deleteLoading: deleteMutation.isPending,

    deleteError: deleteMutation.error,

    // -------------------------
    // Combined
    // -------------------------

    mutationLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
};

export default useFAQs;
