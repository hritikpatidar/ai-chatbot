import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  MessageSquare,
  AlertCircle,
  X,
  LoaderCircle,
  Trash2,
  RefreshCw,
  Ticket,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  notificationKeys,
  useDeleteNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/useNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../context/SocketContext";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);

  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  // Latest 5 notifications for dropdown
  const { data, isPending, isError, error, isFetching, refetch } =
    useNotifications(1, 3);

  useEffect(() => {
    if (!socket) return;

    const handleNotification = (payload) => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    };

    socket.on("notification:created", handleNotification);
    return () => {
      socket.off("notification:created", handleNotification);
    };
  }, [socket]);

  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotifications();

  // API response mapping
  const notifications = Array.isArray(data?.data?.notifications)
    ? data.data.notifications
    : [];

  const unreadCount =
    data?.data?.unreadCount ??
    notifications.filter((notification) => !notification.isRead).length;

  // Support both id and _id
  const getNotificationId = (notification) =>
    notification.id || notification._id;

  // Relative time formatter
  const getRelativeTime = (date) => {
    if (!date) return "";

    const timestamp = new Date(date).getTime();

    if (Number.isNaN(timestamp)) return "";

    const difference = Math.max(0, Date.now() - timestamp);
    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return new Date(date).toLocaleDateString();
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown on Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const getNotificationIcon = (type) => {
    const iconClass =
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg";

    switch (type) {
      case "subscription":
        return (
          <div
            className={`${iconClass} bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400`}
          >
            <CreditCard size={18} />
          </div>
        );

      case "message":
        return (
          <div
            className={`${iconClass} bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400`}
          >
            <MessageSquare size={18} />
          </div>
        );

      case "ticket":
        return (
          <div
            className={`${iconClass} bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400`}
          >
            <Ticket size={18} />
          </div>
        );

      case "settings":
        return (
          <div
            className={`${iconClass} bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300`}
          >
            <Settings size={18} />
          </div>
        );

      case "alert":
      case "system":
        return (
          <div
            className={`${iconClass} bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400`}
          >
            <AlertCircle size={18} />
          </div>
        );

      default:
        return (
          <div
            className={`${iconClass} bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300`}
          >
            <Bell size={18} />
          </div>
        );
    }
  };

  // Notification click: mark as read, then navigate
  const handleNotificationClick = (notification) => {
    const notificationId = getNotificationId(notification);

    if (!notification.isRead && notificationId) {
      markReadMutation.mutate(notificationId);
    }

    setIsOpen(false);

    if (notification.webRoute) {
      navigate(notification.webRoute);
    }
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllMutation.mutate();
    }
  };

  // Delete notification
  // const handleDeleteNotification = (event, notification) => {
  //   event.stopPropagation();

  //   const notificationId = getNotificationId(notification);

  //   if (notificationId) {
  //     deleteMutation.mutate(notificationId);
  //   }
  // };

  // View all notifications
  const handleViewAll = () => {
    setIsOpen(false);

    const role = profileDetails?.role === "client" ? "client" : "admin";

    navigate(`/${role}/notifications`);
  };

  return (
    <div ref={notificationRef} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => {
          refetch();
          setIsOpen((previous) => !previous);
        }}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="
          relative flex h-10 w-10 items-center justify-center
          rounded-lg text-gray-600 transition hover:bg-gray-100
          dark:text-gray-300 dark:hover:bg-white/5
        "
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span
            className="
              absolute right-1.5 top-1.5 flex h-4 min-w-4
              items-center justify-center rounded-full bg-red-500
              px-1 text-[9px] font-bold text-white
              ring-2 ring-white dark:ring-[#11151d]
            "
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="
            absolute right-0 top-full z-50 mt-2
            w-[calc(100vw-2rem)] max-w-95
            overflow-hidden rounded-2xl border border-gray-200
            bg-white shadow-xl dark:border-white/10
            dark:bg-[#171b23] sm:w-95
          "
        >
          {/* Header */}
          <div
            className="
              flex items-center justify-between gap-3 border-b
              border-gray-200 px-4 py-3 dark:border-white/10
            "
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {unreadCount} unread notification
                {unreadCount === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex items-center gap-1">
              {/* Mark all as read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={markAllMutation.isPending}
                  title="Mark all as read"
                  className="
                    flex h-8 items-center gap-1 rounded-lg px-2
                    text-xs font-medium text-indigo-600 transition
                    hover:bg-indigo-50 disabled:cursor-not-allowed
                    disabled:opacity-60 dark:text-indigo-400
                    dark:hover:bg-indigo-500/10
                  "
                >
                  {markAllMutation.isPending ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <CheckCheck size={14} />
                  )}

                  <span className="hidden sm:inline">Mark all read</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
                className="
                  flex h-8 w-8 items-center justify-center rounded-lg
                  text-gray-500 hover:bg-gray-100 dark:text-gray-400
                  dark:hover:bg-white/5
                "
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-100 overflow-y-auto">
            {/* Initial GET loader */}
            {isPending ? (
              <div className="flex min-h-45 flex-col items-center justify-center gap-3">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-indigo-600"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading notifications...
                </p>
              </div>
            ) : isError ? (
              /* GET API error */
              <div className="flex min-h-45 flex-col items-center justify-center gap-3 px-5 text-center">
                <AlertCircle size={28} className="text-red-500" />

                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {error?.message || "Failed to load notifications."}
                </p>

                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="
                    inline-flex items-center gap-2 rounded-lg
                    bg-indigo-50 px-3 py-2 text-xs font-semibold
                    text-indigo-600 disabled:opacity-60
                    dark:bg-indigo-500/10 dark:text-indigo-400
                  "
                >
                  <RefreshCw
                    size={14}
                    className={isFetching ? "animate-spin" : ""}
                  />
                  Try again
                </button>
              </div>
            ) : notifications.length === 0 ? (
              /* Empty state */
              <div className="px-6 py-10 text-center">
                <Bell size={30} className="mx-auto text-gray-400" />

                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  You're all caught up.
                </p>
              </div>
            ) : (
              <>
                {/* Background refetch indicator */}
                {isFetching && (
                  <div className="flex items-center justify-center gap-2 border-b border-gray-100 py-2 text-xs text-gray-500 dark:border-white/5 dark:text-gray-400">
                    <LoaderCircle size={14} className="animate-spin" />
                    Updating notifications...
                  </div>
                )}

                {notifications.map((notification) => {
                  const notificationId = getNotificationId(notification);

                  const isDeleting =
                    deleteMutation.isPending &&
                    deleteMutation.variables === notificationId;

                  const isMarkingRead =
                    markReadMutation.isPending &&
                    markReadMutation.variables === notificationId;

                  return (
                    <div
                      key={notificationId}
                      className={`
                        flex items-start gap-3 border-b border-gray-100
                        px-4 py-3 transition dark:border-white/5
                        ${
                          !notification.isRead
                            ? "bg-indigo-50/40 dark:bg-indigo-500/4"
                            : ""
                        }
                      `}
                    >
                      {/* Notification click area */}
                      <button
                        type="button"
                        onClick={() => handleNotificationClick(notification)}
                        className="
                          flex min-w-0 flex-1 items-start gap-3
                          text-left
                        "
                      >
                        {getNotificationIcon(notification.type)}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <p
                              className={`
                                min-w-0 flex-1 text-sm
                                ${
                                  !notification.isRead
                                    ? "font-semibold text-gray-900 dark:text-white"
                                    : "font-medium text-gray-700 dark:text-gray-300"
                                }
                              `}
                            >
                              {notification.title}
                            </p>

                            {!notification.isRead && (
                              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                            )}
                          </div>

                          <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                            {notification.message}
                          </p>

                          <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                            {notification.time ||
                              getRelativeTime(notification.createdAt)}
                          </p>

                          {isMarkingRead && (
                            <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-indigo-500">
                              <LoaderCircle
                                size={12}
                                className="animate-spin"
                              />
                              Marking as read...
                            </span>
                          )}
                        </div>
                      </button>

                      {/* Delete button with item-specific loader */}
                      {/* <button
                        type="button"
                        onClick={(event) =>
                          handleDeleteNotification(event, notification)
                        }
                        disabled={isDeleting}
                        aria-label="Delete notification"
                        title="Delete notification"
                        className="
                          mt-1 flex h-7 w-7 shrink-0 items-center
                          justify-center rounded-lg text-gray-400
                          transition hover:bg-red-50 hover:text-red-500
                          disabled:cursor-not-allowed disabled:opacity-50
                          dark:hover:bg-red-500/10
                        "
                      >
                        {isDeleting ? (
                          <LoaderCircle size={15} className="animate-spin" />
                        ) : (
                          <Trash2 size={15} />
                        )}
                      </button> */}
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-2 dark:border-white/10">
            <button
              type="button"
              onClick={handleViewAll}
              className="
                flex w-full items-center justify-center gap-2
                rounded-lg px-3 py-2 text-center text-xs
                font-semibold text-indigo-600 transition
                hover:bg-indigo-50 dark:text-indigo-400
                dark:hover:bg-indigo-500/10
              "
            >
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
