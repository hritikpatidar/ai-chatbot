import { useQuery } from "@tanstack/react-query";
import { getUsageAnalyticsService } from "../../service/Client/clientServices";
import { getClientById } from "../../redux/features/Client/clientSlice";

export const useUsageAnalytics = (enabled = true) => {
    return useQuery({
        queryKey: ["clientUsageAnalytics"],
        queryFn: getUsageAnalyticsService,
        enabled,
        staleTime: 0,
    });
};

export const useClientById = (dispatch, clientId) => {
    return useQuery({
        queryKey: ["clientDetails", clientId],
        queryFn: () => dispatch(getClientById(clientId)),
        enabled: Boolean(clientId),
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
    });
};