import { useEffect, useRef, useState } from "react";
import {
  Bell,
  CheckCheck,
  CreditCard,
  MessageSquare,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef(null);
const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );
  const notifications = [
    {
      id: 1,
      type: "subscription",
      title: "Subscription Activated",
      message: "Your Pro subscription has been activated successfully.",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      type: "message",
      title: "New Conversation",
      message: "You have received a new conversation from a visitor.",
      time: "20 min ago",
      unread: true,
    },
    {
      id: 3,
      type: "alert",
      title: "Usage Alert",
      message: "You have used 80% of your monthly message limit.",
      time: "1 hour ago",
      unread: true,
    },
  ];

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  // Close dropdown when clicked outside
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

  const getNotificationIcon = (type) => {
    switch (type) {
      case "subscription":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
            <CreditCard size={18} />
          </div>
        );

      case "message":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
            <MessageSquare size={18} />
          </div>
        );

      case "alert":
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
            <AlertCircle size={18} />
          </div>
        );

      default:
        return (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300">
            <Bell size={18} />
          </div>
        );
    }
  };

  const handleMarkAllRead = () => {
    // API call yahan laga sakte ho
    console.log("Mark all notifications as read");
  };

  return (
    <div ref={notificationRef} className="relative">
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-expanded={isOpen}
        className="
          relative
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-lg
          text-gray-600
          transition
          hover:bg-gray-100
          dark:text-gray-300
          dark:hover:bg-white/5
        "
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span
            className="
              absolute
              right-2
              top-2
              h-2
              w-2
              rounded-full
              bg-red-500
              ring-2
              ring-white
              dark:ring-[#11151d]
            "
          />
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          className="
            absolute
            right-0
            top-full
            z-50
            mt-2
            w-[calc(100vw-2rem)]
            max-w-[380px]
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-xl
            dark:border-white/10
            dark:bg-[#171b23]
            sm:w-[380px]
          "
        >
          {/* Header */}
          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-200
              px-4
              py-3
              dark:border-white/10
            "
          >
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>

              {unreadCount > 0 && (
                <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {unreadCount} unread notification
                  {unreadCount > 1 ? "s" : ""}
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="
                    hidden
                    items-center
                    gap-1
                    rounded-lg
                    px-2
                    py-1.5
                    text-xs
                    font-medium
                    text-indigo-600
                    transition
                    hover:bg-indigo-50
                    sm:flex
                    dark:text-indigo-400
                    dark:hover:bg-indigo-500/10
                  "
                >
                  <CheckCheck size={14} />
                  Mark all read
                </button>
              )}

              {/* Mobile close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-500
                  hover:bg-gray-100
                  sm:hidden
                  dark:text-gray-400
                  dark:hover:bg-white/5
                "
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
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
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className="
                    flex
                    w-full
                    gap-3
                    border-b
                    border-gray-100
                    px-4
                    py-3
                    text-left
                    transition
                    hover:bg-gray-50
                    dark:border-white/5
                    dark:hover:bg-white/[0.03]
                  "
                >
                  {/* Icon */}
                  {getNotificationIcon(notification.type)}

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`
                          text-sm
                          ${
                            notification.unread
                              ? "font-semibold text-gray-900 dark:text-white"
                              : "font-medium text-gray-700 dark:text-gray-300"
                          }
                        `}
                      >
                        {notification.title}
                      </p>

                      {notification.unread && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {notification.message}
                    </p>

                    <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                      {notification.time}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-2 dark:border-white/10">
              <button
                type="button"
                className="
                  w-full
                  rounded-lg
                  px-3
                  py-2
                  text-center
                  text-xs
                  font-semibold
                  text-indigo-600
                  transition
                  hover:bg-indigo-50
                  dark:text-indigo-400
                  dark:hover:bg-indigo-500/10
                "
                onClick={() => {
                  setIsOpen(false);
                  navigate(`/${profileDetails?.role === "client" ? "client" : "admin"}/notifications`);
                }}
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
