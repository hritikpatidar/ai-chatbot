import {
  AlertCircle,
  Bell,
  CheckCheck,
  CreditCard,
  MessageSquare,
  Settings,
  Trash2,
  XCircle,
} from "lucide-react";

import { useState } from "react";

const Notifications = () => {
  const [filter, setFilter] = useState("all");

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "subscription",
      title: "Subscription Activated",
      message:
        "Your Pro subscription has been activated successfully.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      title: "New Conversation",
      message:
        "You have received a new conversation from a visitor.",
      time: "20 min ago",
      unread: true,
    },
    {
      id: 3,
      type: "alert",
      title: "Usage Alert",
      message:
        "You have used 80% of your monthly message limit.",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 4,
      type: "payment",
      title: "Payment Successful",
      message:
        "Your subscription payment of $49 has been processed successfully.",
      time: "3 hours ago",
      unread: false,
    },
    {
      id: 5,
      type: "settings",
      title: "Chatbot Configuration Updated",
      message:
        "Your chatbot configuration has been updated successfully.",
      time: "Yesterday",
      unread: false,
    },
    {
      id: 6,
      type: "alert",
      title: "Subscription Expiring Soon",
      message:
        "Your subscription will expire in 5 days. Renew your plan to continue using the service.",
      time: "Yesterday",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const filteredNotifications =
    filter === "unread"
      ? notifications.filter(
          (notification) => notification.unread
        )
      : notifications;

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

      case "payment":
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
            <CheckCheck size={20} />
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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              unread: false,
            }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter(
        (notification) => notification.id !== id
      )
    );
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

              <span className="ml-1.5 text-xs">
                {notifications.length}
              </span>
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
        <div className="mt-5 space-y-3">
          {filteredNotifications.length === 0 ? (
            <div
              className="
                rounded-2xl
                border
                border-gray-200
                bg-white
                px-6
                py-14
                text-center
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <div
                className="
                  mx-auto
                  flex h-14 w-14
                  items-center justify-center
                  rounded-2xl
                  bg-gray-100
                  dark:bg-white/5
                "
              >
                <Bell
                  size={25}
                  className="
                    text-gray-400
                    dark:text-gray-500
                  "
                />
              </div>

              <h3
                className="
                  mt-4
                  text-sm
                  font-semibold
                  text-gray-800
                  dark:text-gray-200
                "
              >
                No notifications
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-500
                "
              >
                You're all caught up.
              </p>
            </div>
          ) : (
            filteredNotifications.map(
              (notification) => (
                <div
                  key={notification.id}
                  onClick={() =>
                    markAsRead(notification.id)
                  }
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
                          dark:bg-indigo-500/[0.04]
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
                  {getNotificationIcon(
                    notification.type
                  )}

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <h3
                          className={`
                            truncate
                            text-sm
                            ${
                              notification.unread
                                ? "font-bold text-gray-900 dark:text-white"
                                : "font-semibold text-gray-800 dark:text-gray-200"
                            }
                          `}
                        >
                          {notification.title}
                        </h3>

                        {notification.unread && (
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
                          deleteNotification(
                            notification.id
                          );
                        }}
                        className="
                          shrink-0
                          rounded-lg
                          p-1.5
                          text-gray-400
                          opacity-100
                          transition
                          hover:bg-red-50
                          hover:text-red-500
                          sm:opacity-0
                          sm:group-hover:opacity-100
                          dark:hover:bg-red-500/10
                        "
                        aria-label="Delete notification"
                      >
                        <Trash2 size={15} />
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
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;