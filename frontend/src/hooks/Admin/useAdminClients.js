import {useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminClientDetailsService,
  getAdminClientsService,
  deleteAdminClientService,
  updateAdminClientService
} from "../../service/Admin/adminClientServices";

export const useAdminClients = ({
  page = 1,
  limit = 10,
  search = "",
  status = "",
} = {}) => {
  const clientsQuery = useQuery({
    queryKey: ["adminClients", page, limit, search, status],

    queryFn: async () => {
      const response = await getAdminClientsService({
        page,
        limit,
        search,
        status,
      });

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to fetch clients");
      }

      return response?.data?.data;
    },

    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
  });
  return {
    clients: clientsQuery.data?.clients || [],

    pagination: {
      total: clientsQuery.data?.pagination?.total || 0,
      page: clientsQuery.data?.pagination?.page || page,
      limit: clientsQuery.data?.pagination?.limit || limit,
      totalPages: clientsQuery.data?.pagination?.totalPages || 0,
    },

    isLoading: clientsQuery.isLoading,
    isFetching: clientsQuery.isFetching,
    error: clientsQuery.error,

    refetch: clientsQuery.refetch,
  };
};

export const useAdminClientDetails = (clientId) => {
  const clientQuery = useQuery({
    queryKey: ["adminClientDetails", clientId],

    queryFn: async () => {
      const response = await getAdminClientDetailsService(clientId);

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message || "Failed to fetch client details",
        );
      }

      return response?.data?.data;
    },

    enabled: Boolean(clientId),

    staleTime: 30 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
  });
  return {
    client: clientQuery.data?.client || null,
    user: clientQuery.data?.user,
    isLoading: clientQuery.isLoading,
    isFetching: clientQuery.isFetching,
    error: clientQuery.error,
    refetch: clientQuery.refetch,
  };
};

export const useDeleteAdminClient = () => {
  return useMutation({
    mutationFn: async (clientId) => {
      const response = await deleteAdminClientService(clientId);

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message ||
            "Failed to delete client",
        );
      }

      return response?.data;
    },
  });
};


export const useUpdateAdminClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ clientId, payload }) =>
      updateAdminClientService(clientId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["adminClients"],
      });

      queryClient.invalidateQueries({
        queryKey: [
          "adminClientDetails",
          variables.clientId,
        ],
      });
    },
  });
};