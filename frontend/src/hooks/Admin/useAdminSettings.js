
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminGeminiModelsService,
  getAdminSettingsService,
  updateAdminSettingsService,
} from "../../service/Admin/adminSettingsService";



export const adminSettingsKeys = {
  all: ["adminSettings"],
  geminiModels: ["adminGeminiModels"],
};

// GET SETTINGS
export const useAdminSettings = () => {
  return useQuery({
    queryKey: adminSettingsKeys.all,
    queryFn: getAdminSettingsService,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

export const useAdminGeminiModels = () => {
  return useQuery({
    queryKey: adminSettingsKeys.geminiModels,
    queryFn: getAdminGeminiModelsService,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};

// UPDATE SETTINGS
export const useUpdateAdminSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAdminSettingsService,

    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(
        adminSettingsKeys.all,
        updatedSettings
      );
    },
  });
};
