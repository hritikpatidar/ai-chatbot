import { useQuery } from "@tanstack/react-query";
import { getAdminAnalyticsService } from "../../service/Admin/adminAnalyticsService";

export const useAdminAnalytics = (range = 7) => {
  return useQuery({
    queryKey: ["adminAnalytics", range],
    queryFn: () => getAdminAnalyticsService(range),
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};