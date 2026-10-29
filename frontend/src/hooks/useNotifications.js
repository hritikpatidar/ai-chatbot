import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteNotificationsApi, getNotificationsApi, markAllNotificationsReadApi, markNotificationReadApi } from "../service/Notification/NotificationService";

export const notificationKeys = {
  all: ["notifications"],
  list: (page, limit, filter) => ["notifications", page, limit, filter],
};

// Fetch notifications
export const useNotifications = (page, limit, filter = "all") => {
  return useQuery({
    queryKey: notificationKeys.list(page, limit, filter),
    queryFn: () => getNotificationsApi({ page, limit, filter }),
  });
};

// Mark one notification as read
export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationReadApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

// Mark all notifications as read
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllNotificationsReadApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};

// Mark all notifications as read
export const useDeleteNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNotificationsApi,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
  });
};