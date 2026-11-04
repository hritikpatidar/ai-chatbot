import { useQuery } from "@tanstack/react-query";
import { getAdminSubscriptionsService } from "../../service/Admin/adminSubscriptionServices";
import { useEffect, useState } from "react";

export const useAdminSubscriptions = ({
    search = "",
    status = "all",
} = {}) => {
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search.trim());
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    return useQuery({
        queryKey: ["adminSubscriptions", debouncedSearch, status],

        queryFn: () =>
            getAdminSubscriptionsService({
                search: debouncedSearch,
                status,
            }),

        staleTime: 30 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
        placeholderData: (previousData) => previousData,
    });
};