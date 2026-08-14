import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getClientTicketsService,
  updateClientTicketService,
  deleteClientTicketService,
} from "../../service/Client/ticketServices";

/* =========================================================
   CLIENT TICKETS
========================================================= */

const useClientTickets = ({
  page = 1,
  limit = 10,
  status = "",
  priority = "",
} = {}) => {
  const queryClient = useQueryClient();

  /* =========================================================
     GET TICKETS
  ========================================================= */

  const ticketsQuery = useQuery({
    queryKey: ["clientTickets", page, limit, status, priority],

    queryFn: async () => {
      const response = await getClientTicketsService({
        page,
        limit,
        status,
        priority,
      });

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to fetch tickets");
      }

      /*
        Backend response:

        {
          success: true,
          data: {
            tickets: [],
            total: 20,
            page: 1,
            limit: 10,
            totalPages: 2
          }
        }
      */

      return response?.data?.data;
    },

    placeholderData: (previousData) => previousData,

    staleTime: 30 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,
  });

  /* =========================================================
     UPDATE TICKET
  ========================================================= */

  const updateMutation = useMutation({
    mutationFn: async ({ ticketId, payload }) => {
      const response = await updateClientTicketService(ticketId, payload);

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to update ticket");
      }

      return response?.data;
    },

    onSuccess: () => {
      /*
        Current page ke saath saare
        clientTickets queries refresh hongi.
      */

      queryClient.invalidateQueries({
        queryKey: ["clientTickets"],
      });
    },
  });

  /* =========================================================
     DELETE TICKET
  ========================================================= */

  const deleteMutation = useMutation({
    mutationFn: async (ticketId) => {
      const response = await deleteClientTicketService(ticketId);

      if (response?.data?.success === false) {
        throw new Error(response?.data?.message || "Failed to delete ticket");
      }

      return response?.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["clientTickets"],
      });
    },
  });

  /* =========================================================
     RETURN
  ========================================================= */

  return {
    /* -------------------------
       Tickets
    ------------------------- */

    tickets: ticketsQuery.data?.tickets || [],

    /* -------------------------
       Pagination
    ------------------------- */

    pagination: {
      total: ticketsQuery.data?.total || 0,

      page: ticketsQuery.data?.page || page,

      limit: ticketsQuery.data?.limit || limit,

      totalPages: ticketsQuery.data?.totalPages || 0,
    },

    /* -------------------------
       GET STATES
    ------------------------- */

    isLoading: ticketsQuery.isLoading,

    isFetching: ticketsQuery.isFetching,

    error: ticketsQuery.error,

    refetch: ticketsQuery.refetch,

    /* -------------------------
       UPDATE
    ------------------------- */

    updateTicket: updateMutation.mutateAsync,

    updateLoading: updateMutation.isPending,

    updateError: updateMutation.error,

    /* -------------------------
       DELETE
    ------------------------- */

    deleteTicket: deleteMutation.mutateAsync,

    deleteLoading: deleteMutation.isPending,

    deleteError: deleteMutation.error,

    /* -------------------------
       Combined Mutation Loading
    ------------------------- */

    mutationLoading: updateMutation.isPending || deleteMutation.isPending,
  };
};

export default useClientTickets;
