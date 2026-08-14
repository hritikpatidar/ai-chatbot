import { useQuery } from "@tanstack/react-query";
import { getClientTicketsService } from "../../service/Client/ticketServices";

const useClientTickets = ({
  page = 1,
  limit = 10,
  status = "",
  priority = "",
} = {}) => {
  return useQuery({
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

      return response?.data;
    },

    placeholderData: (previousData) => previousData,
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export default useClientTickets;
