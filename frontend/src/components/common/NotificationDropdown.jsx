
import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  MessageSquare,
  AlertCircle,
  X,
  LoaderCircle,
  RefreshCw,
  Ticket,
  Settings,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

import {
  notificationKeys,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../../hooks/useNotifications";

import { useSocket } from "../../context/SocketContext";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const [isOpen, setIsOpen] = useState(false);

  const notificationRef = useRef(null);

  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice
  );

  // Latest 3 notifications for dropdown
  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useNotifications(1, 3);

  // Mutations
  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();

  // Notification response mapping
  const notifications = Array.isArray(data?.data?.notifications)
    ? data.data.notifications
    : [];

  const unreadCount =
    data?.data?.unreadCount ??
    notifications.filter((notification) => !notification.isRead).length;

  // Get notification ID
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

  // Socket notification listener
  useEffect(() => {
    if (!socket) return;

    const handleNotification = () => {
      queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    };

    socket.on("notification:created", handleNotification);

    return () => {
      socket.off("notification:created", handleNotification);
    };
  }, [socket, queryClient]);

  // Close dropdown on outside click / touch
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
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

  // Notification icons
  const getNotificationIcon = (type) => {
    const iconClass =
      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl";

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

  // Toggle dropdown
  const handleToggle = () => {
    const nextState = !isOpen;

    setIsOpen(nextState);

    if (nextState) {
      refetch();
    }
  };

  // Notification click
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

  // Mark all as read
  const handleMarkAllRead = () => {
    if (unreadCount > 0) {
      markAllMutation.mutate();
    }
  };

  // View all notifications
  const handleViewAll = () => {
    setIsOpen(false);

    const role =
      profileDetails?.role === "client" ? "client" : "admin";

    navigate(`/${role}/notifications`);
  };

  return (
    <div ref={notificationRef} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label="Notifications"
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="
          relative flex h-10 w-10 shrink-0 items-center justify-center
          rounded-xl text-gray-600 transition
          hover:bg-gray-100
          dark:text-gray-300 dark:hover:bg-white/5
        "
      >
        <Bell size={19} />

        {unreadCount > 0 && (
          <span
            className="
              absolute right-1 top-1 flex h-4 min-w-4
              items-center justify-center rounded-full
              bg-red-500 px-1 text-[9px] font-bold text-white
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
          role="dialog"
          aria-label="Notifications"
          className="
            fixed inset-x-3 top-16 z-100
            flex max-h-[calc(100dvh-5rem)] flex-col
            overflow-hidden rounded-2xl
            border border-gray-200 bg-white
            shadow-2xl shadow-black/10

            dark:border-white/10 dark:bg-[#171b23]

            sm:absolute sm:inset-x-auto sm:right-0
            sm:top-full sm:mt-2
            sm:max-h-[min(32rem,calc(100dvh-6rem))]
            sm:w-95
          "
        >
          {/* Header */}
          <div
            className="
              flex shrink-0 items-center justify-between gap-2
              border-b border-gray-200 px-4 py-3
              dark:border-white/10
            "
          >
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {unreadCount} unread notification
                {unreadCount === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {/* Mark All Read */}
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  disabled={markAllMutation.isPending}
                  title="Mark all as read"
                  className="
                    flex h-8 items-center gap-1.5 rounded-lg
                    px-2 text-xs font-medium text-indigo-600
                    transition hover:bg-indigo-50
                    disabled:cursor-not-allowed disabled:opacity-60
                    dark:text-indigo-400 dark:hover:bg-indigo-500/10
                  "
                >
                  {markAllMutation.isPending ? (
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                  ) : (
                    <CheckCheck size={14} />
                  )}

                  <span className="hidden sm:inline">
                    Mark all read
                  </span>
                </button>
              )}

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close notifications"
                className="
                  flex h-8 w-8 shrink-0 items-center justify-center
                  rounded-lg text-gray-500 transition
                  hover:bg-gray-100
                  dark:text-gray-400 dark:hover:bg-white/5
                "
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div
            className="
              min-h-0 flex-1 overflow-y-auto overscroll-contain
              scrollbar-thin
              max-h-[calc(100dvh-12rem)]
              sm:max-h-none
            "
          >
            {/* Initial Loader */}
            {isPending ? (
              <div className="flex min-h-44 flex-col items-center justify-center gap-3">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-indigo-600"
                />

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Loading notifications...
                </p>
              </div>
            ) : isError ? (
              /* API Error */
              <div className="flex min-h-44 flex-col items-center justify-center gap-3 px-5 text-center">
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
              /* Empty State */
              <div className="px-6 py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                  <Bell
                    size={25}
                    className="text-gray-400"
                  />
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-gray-300">
                  No notifications
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                  You're all caught up.
                </p>
              </div>
            ) : (
              <>
                {/* Background Refetch */}
                {isFetching && (
                  <div
                    className="
                      flex items-center justify-center gap-2
                      border-b border-gray-100 py-2
                      text-xs text-gray-500
                      dark:border-white/5 dark:text-gray-400
                    "
                  >
                    <LoaderCircle
                      size={14}
                      className="animate-spin"
                    />
                    Updating notifications...
                  </div>
                )}

                {/* Notification Items */}
                {notifications.map((notification) => {
                  const notificationId =
                    getNotificationId(notification);

                  const isMarkingRead =
                    markReadMutation.isPending &&
                    markReadMutation.variables === notificationId;

                  return (
                    <div
                      key={notificationId}
                      className={`
                        flex items-start gap-3
                        border-b border-gray-100
                        px-3 py-3 transition sm:px-4
                        dark:border-white/5
                        ${
                          !notification.isRead
                            ? "bg-indigo-50/40 dark:bg-indigo-500/5"
                            : ""
                        }
                      `}
                    >
                      {/* Notification Click Area */}
                      <button
                        type="button"
                        onClick={() =>
                          handleNotificationClick(notification)
                        }
                        className="
                          flex min-w-0 flex-1 items-start gap-3
                          text-left outline-none
                          focus-visible:ring-2
                          focus-visible:ring-indigo-500
                          focus-visible:ring-inset
                        "
                      >
                        {getNotificationIcon(notification.type)}

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start gap-2">
                            <p
                              className={`
                                min-w-0 flex-1 wrap-break-word text-sm
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

                          <p className="mt-1 line-clamp-2 wrap-break-word text-xs leading-5 text-gray-500 dark:text-gray-400">
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
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="
              shrink-0 border-t border-gray-200 p-2
              dark:border-white/10
            "
          >
            <button
              type="button"
              onClick={handleViewAll}
              className="
                flex w-full items-center justify-center gap-2
                rounded-lg px-3 py-2.5 text-center text-xs
                font-semibold text-indigo-600 transition
                hover:bg-indigo-50
                dark:text-indigo-400 dark:hover:bg-indigo-500/10
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
