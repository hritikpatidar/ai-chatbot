import { useQuery } from "@tanstack/react-query";
import { getAnalyticsOverviewService, getConversationsChartService, getConversationSourcesService, getPopularTopicsService, getUsageAnalyticsService, getUserActivityService, getUserSatisfactionService } from "../../service/Client/clientServices";
import { getClientById } from "../../redux/features/Client/clientSlice";

const analyticsQueryOptions = {
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
};

export const useUsageAnalytics = (enabled = true) => {
    return useQuery({
        queryKey: ["clientUsageAnalytics"],
        queryFn: getUsageAnalyticsService,
        enabled,
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
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

export const useAnalyticsOverview = (range = "7", enabled = true) => {
    return useQuery({
        queryKey: ["clientAnalytics", "overview", range],
        queryFn: () => getAnalyticsOverviewService(range),
        enabled,
        ...analyticsQueryOptions,
    });
};

export const useConversationsChart = (
    range = "7",
    metric = "conversations",
    enabled = true
) => {
    return useQuery({
        queryKey: ["clientAnalytics", "conversations", range, metric],
        queryFn: () => getConversationsChartService(range, metric),
        enabled,
        ...analyticsQueryOptions,
    });
};

export const useUserActivity = (range = "7", enabled = true) => {
    return useQuery({
        queryKey: ["clientAnalytics", "userActivity", range],
        queryFn: () => getUserActivityService(range),
        enabled,
        ...analyticsQueryOptions,
    });
};

export const useConversationSources = (range = "7", enabled = true) => {
    return useQuery({
        queryKey: ["clientAnalytics", "sources", range],
        queryFn: () => getConversationSourcesService(range),
        enabled,
        ...analyticsQueryOptions,
    });
};

export const usePopularTopics = (range = "7", enabled = true) => {
    return useQuery({
        queryKey: ["clientAnalytics", "topics", range],
        queryFn: () => getPopularTopicsService(range),
        enabled,
        ...analyticsQueryOptions,
    });
};

export const useUserSatisfaction = (range = "7", enabled = true) => {
    return useQuery({
        queryKey: ["clientAnalytics", "satisfaction", range],
        queryFn: () => getUserSatisfactionService(range),
        enabled,
        ...analyticsQueryOptions,
    });
};