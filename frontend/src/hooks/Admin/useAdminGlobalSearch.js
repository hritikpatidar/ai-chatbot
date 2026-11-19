import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchAdminRecordsService } from "../../service/Admin/adminSearchService";

export const useAdminGlobalSearch = (search, enabled = true) => {
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const searchQuery = useQuery({
    queryKey: ["adminGlobalSearch", debouncedSearch],
    queryFn: async () => {
      const response = await searchAdminRecordsService(debouncedSearch);
      if (response?.data?.success === false) {
        throw new Error(response.data.message || "Admin search failed");
      }
      const results = response?.data?.data?.results;
      if (!Array.isArray(results)) {
        throw new Error("Admin search returned an invalid response");
      }
      return results;
    },
    enabled: enabled && debouncedSearch.length >= 2,
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return {
    ...searchQuery,
    isDebouncing: search.trim() !== debouncedSearch,
  };
};
