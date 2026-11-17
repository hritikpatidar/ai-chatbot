import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAdminTransactionStatsService,
  getAdminTransactionsService,
} from "../../service/Admin/adminTransactionServices";

export const useAdminTransactions = ({
  search = "",
  status = "all",
  from = "",
  to = "",
  startingAfter = null,
} = {}) => {
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  return useQuery({
    queryKey: [
      "adminTransactions",
      debouncedSearch,
      status,
      from,
      to,
      startingAfter,
    ],
    queryFn: () =>
      getAdminTransactionsService({
        search: debouncedSearch,
        status,
        from,
        to,
        startingAfter,
      }),
    staleTime: 30 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    placeholderData: (previousData) => previousData,
  });
};

export const useAdminTransactionStats = () => {
  return useQuery({
    queryKey: ["adminTransactionStats"],
    queryFn: getAdminTransactionStatsService,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
