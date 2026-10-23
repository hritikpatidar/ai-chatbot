import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getSupportTicketByIdService, getSupportTicketsService, replyToSupportTicketService, updateSupportTicketStatusService } from "../../service/Admin/supportTicketServices";


export const supportTicketKeys = {
  all: ["support-tickets"],
  lists: () => [...supportTicketKeys.all, "list"],
  list: (params) => [...supportTicketKeys.lists(), params],
  details: () => [...supportTicketKeys.all, "detail"],
  detail: (ticketId) => [...supportTicketKeys.details(), ticketId],
};

// GET: ticket list with search, filters and pagination
export const useSupportTickets = (params) => {
  return useQuery({
    queryKey: supportTicketKeys.list(params),
    queryFn: () => getSupportTicketsService(params),
    placeholderData: (previousData) => previousData,
  });
};

// GET: ticket details
export const useSupportTicketDetails = (ticketId, enabled = true) => {
  return useQuery({
    queryKey: supportTicketKeys.detail(ticketId),
    queryFn: () => getSupportTicketByIdService(ticketId),
    enabled: Boolean(ticketId) && enabled,
  });
};

// POST: send reply email
export const useReplyToSupportTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, payload }) =>
      replyToSupportTicketService(ticketId, payload),

    onSuccess: (data, variables) => {
      if (data?.ticket) {
        queryClient.setQueryData(
          supportTicketKeys.detail(variables.ticketId),
          { success: true, ticket: data.ticket }
        );
      }

      queryClient.invalidateQueries({
        queryKey: supportTicketKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: supportTicketKeys.detail(variables.ticketId),
      });
    },
  });
};

// PATCH: update ticket status
export const useUpdateSupportTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, payload }) =>
      updateSupportTicketStatusService(ticketId, payload),

    onSuccess: (data, variables) => {
      if (data?.ticket) {
        queryClient.setQueryData(
          supportTicketKeys.detail(variables.ticketId),
          { success: true, ticket: data.ticket }
        );
      }

      queryClient.invalidateQueries({
        queryKey: supportTicketKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: supportTicketKeys.detail(variables.ticketId),
      });
    },
  });
};