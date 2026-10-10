import {
  AlertCircle,
  Bell,
  CheckCheck,
  CreditCard,
  MessageSquare,
  Settings,
  Ticket,
  LoaderCircle,
  Trash2,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
  notificationKeys,
  useDeleteNotifications,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/common/Pagination";

const Notifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [deletingNotificationId, setDeletingNotificationId] = useState(null);
  const { data, isPending, isError, error, isFetching } = useNotifications(
    page,
    limit,
  );

  

  const markReadMutation = useMarkNotificationRead();
  const markAllMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotifications();

  // API response structure ke hisaab se mapping adjust karna.
  const notifications = Array.isArray(data?.data.notifications)
    ? data?.data?.notifications
    : [];

  const pagination = data?.data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(pagination.totalPages, prev + 1));
  };

  const unreadCount =
    data?.data?.unreadCount ??
    notifications.filter((notification) => !notification.isRead).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter((notification) => !notification.isRead)
      : notifications;

  const markAsRead = (notification) => {
    markReadMutation.mutate(notification.id);
    navigate(notification.webRoute);
  };

  const markAllAsRead = () => {
    if (unreadCount > 0) {
      markAllMutation.mutate();
    }
  };

  const deleteNotification = (id) => {
    setDeletingNotificationId(id);

    deleteMutation.mutate(id, {
      onSettled: () => {
        setDeletingNotificationId(null);
      },
    });
  };
  const getNotificationIcon = (type) => {
    switch (type) {
      case "subscription":
        return (
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-indigo-100
              text-indigo-600
              dark:bg-indigo-500/10
              dark:text-indigo-400
            "
          >
            <CreditCard size={20} />
          </div>
        );

      case "message":
        return (
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            <MessageSquare size={20} />
          </div>
        );

      case "ticket":
        return (
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-green-100
              text-green-600
              dark:bg-green-500/10
              dark:text-green-400
            "
          >
            <Ticket size={20} />
          </div>
        );

      case "settings":
        return (
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-gray-100
              text-gray-600
              dark:bg-white/5
              dark:text-gray-300
            "
          >
            <Settings size={20} />
          </div>
        );

      case "alert":
        return (
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-orange-100
              text-orange-600
              dark:bg-orange-500/10
              dark:text-orange-400
            "
          >
            <AlertCircle size={20} />
          </div>
        );

      default:
        return (
          <div
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center
              rounded-xl
              bg-gray-100
              text-gray-600
              dark:bg-white/5
              dark:text-gray-300
            "
          >
            <Bell size={20} />
          </div>
        );
    }
  };

  return (
    <div className="min-h-full">
      <div className="mx-auto ">
        {/* PAGE HEADER */}
        <div
          className="
            flex flex-col gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-11 w-11
                  items-center justify-center
                  rounded-xl
                  bg-indigo-100
                  dark:bg-indigo-500/10
                "
              >
                <Bell
                  size={22}
                  className="
                    text-indigo-600
                    dark:text-indigo-400
                  "
                />
              </div>

              <div>
                <h1
                  className="
                    text-2xl
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Notifications
                </h1>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Stay updated with your account activity.
                </p>
              </div>
            </div>
          </div>

          {/* MARK ALL READ */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-semibold
                text-gray-700
                transition
                hover:bg-gray-50
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-gray-300
                dark:hover:bg-white/5
              "
            >
              <CheckCheck size={17} />
              Mark all as read
            </button>
          )}
        </div>

        {/* FILTER */}
        <div
          className="
            mt-6
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-gray-200
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`
                relative
                px-4
                py-3
                text-sm
                font-semibold
                transition
                ${
                  filter === "all"
                    ? `
                      text-indigo-600
                      dark:text-indigo-400
                      after:absolute
                      after:bottom-0
                      after:left-0
                      after:right-0
                      after:h-0.5
                      after:bg-indigo-600
                      dark:after:bg-indigo-400
                    `
                    : `
                      text-gray-500
                      hover:text-gray-900
                      dark:text-gray-400
                      dark:hover:text-white
                    `
                }
              `}
            >
              All
              <span className="ml-1.5 text-xs">{notifications.length}</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`
                relative
                px-4
                py-3
                text-sm
                font-semibold
                transition
                ${
                  filter === "unread"
                    ? `
                      text-indigo-600
                      dark:text-indigo-400
                      after:absolute
                      after:bottom-0
                      after:left-0
                      after:right-0
                      after:h-0.5
                      after:bg-indigo-600
                      dark:after:bg-indigo-400
                    `
                    : `
                      text-gray-500
                      hover:text-gray-900
                      dark:text-gray-400
                      dark:hover:text-white
                    `
                }
              `}
            >
              Unread
              {unreadCount > 0 && (
                <span
                  className="
                    ml-1.5
                    inline-flex
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-red-500
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-bold
                    text-white
                  "
                >
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          <span
            className="
              hidden
              text-xs
              text-gray-400
              sm:block
              dark:text-gray-500
            "
          >
            {unreadCount} unread
          </span>
        </div>

        {/* NOTIFICATIONS */}

        {isPending ? (
          <div className="flex min-h-62.5 flex-col items-center justify-center gap-3">
            <LoaderCircle size={32} className="animate-spin text-blue-600" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading notifications...
            </p>
          </div>
        ) : isError ? (
          <div className="flex min-h-62.5 flex-col items-center justify-center gap-2">
            <p className="text-sm text-red-500">
              {error?.message || "Failed to load notifications."}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-62.5 items-center justify-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No notifications found.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification)}
                className={`
                    group
                    flex
                    gap-3
                    rounded-2xl
                    border
                    p-4
                    transition
                    sm:gap-4
                    ${
                      notification.unread
                        ? `
                          border-indigo-100
                          bg-indigo-50/40
                          dark:border-indigo-500/10
                          dark:bg-indigo-500/4
                        `
                        : `
                          border-gray-200
                          bg-white
                          dark:border-white/10
                          dark:bg-[#171b23]
                        `
                    }
                    hover:border-indigo-200
                    hover:shadow-sm
                    dark:hover:border-indigo-500/20
                  `}
              >
                {/* ICON */}
                {getNotificationIcon(notification.type)}

                {/* CONTENT */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-2">
                      <h3
                        className={`
                            truncate
                            text-sm
                            ${
                              !notification.isRead
                                ? "font-bold text-gray-900 dark:text-white"
                                : "font-semibold text-gray-800 dark:text-gray-200"
                            }
                          `}
                      >
                        {notification.title}
                      </h3>

                      {!notification.isRead && (
                        <span
                          className="
                              h-2
                              w-2
                              shrink-0
                              rounded-full
                              bg-indigo-500
                            "
                        />
                      )}
                    </div>

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      disabled={
                        deleteMutation.isPending &&
                        deletingNotificationId === notification.id
                      }
                      className="
                        shrink-0 rounded-lg p-1.5
                        text-gray-400 transition
                        hover:bg-red-50 hover:text-red-500
                        disabled:cursor-not-allowed disabled:opacity-50
                        dark:hover:bg-red-500/10
                      "
                      aria-label="Delete notification"
                    >
                      {deleteMutation.isPending &&
                      deletingNotificationId === notification.id ? (
                        <LoaderCircle size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>

                  <p
                    className="
                        mt-1.5
                        text-sm
                        leading-5
                        text-gray-500
                        dark:text-gray-400
                      "
                  >
                    {notification.message}
                  </p>

                  <p
                    className="
                        mt-2
                        text-xs
                        text-gray-400
                        dark:text-gray-500
                      "
                  >
                    {notification.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <Pagination
          page={pagination.page || page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          currentCount={notifications.length}
          isFetching={isFetching}
          onPrevious={handlePreviousPage}
          onNext={handleNextPage}
        />
      </div>
    </div>
  );
};

export default Notifications;
