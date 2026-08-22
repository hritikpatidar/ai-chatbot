import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  X,
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true, // ⭐ Important
  },
  {
    label: "Clients",
    path: "/admin/clients",
    icon: Users,
    end: true,
  },
  {
    label: "Subscriptions",
    path: "/admin/subscriptions",
    icon: CreditCard,
    end: true,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
    end: true,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
    end: true,
  },
];

export default function AdminSidebar({
  isOpen,
  onClose,
  collapsed,
  setCollapsed,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="
            fixed inset-0 z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          flex-col
          border-r
          border-gray-200
          bg-white
          transition-all
          duration-300
          dark:border-white/10
          dark:bg-[#11151d]

          ${collapsed ? "w-19.5" : "w-65"}

          lg:translate-x-0

          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div
          className="
            flex
            h-18
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            px-4
            dark:border-white/10
          "
        >
          <div
            className={`
              flex
              items-center
              gap-3
              overflow-hidden
              ${collapsed ? "justify-center w-full" : ""}
            `}
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-lg
                shadow-blue-600/20
              "
            >
              <Bot size={21} />
            </div>

            {!collapsed && (
              <div className="min-w-0">
                <h1
                  className="
                    truncate
                    text-sm
                    font-bold
                    text-gray-900
                    dark:text-white
                  "
                >
                  AI Chatbot
                </h1>

                <p
                  className="
                    text-[11px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Admin Panel
                </p>
              </div>
            )}
          </div>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:bg-white/10
              dark:hover:text-white
              lg:hidden
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {!collapsed && (
            <p
              className="
                mb-3
                px-3
                text-[10px]
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
                dark:text-gray-500
              "
            >
              Main Menu
            </p>
          )}

          <div className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  onClick={onClose}
                  title={collapsed ? item.label : ""}
                  className={({ isActive }) => `
                    group
                    flex
                    h-11
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    text-sm
                    font-medium
                    transition-all

                    ${collapsed ? "justify-center" : ""}

                    ${
                      isActive
                        ? `
                          bg-blue-600
                          text-white
                          shadow-md
                          shadow-blue-600/20
                        `
                        : `
                          text-gray-600
                          hover:bg-gray-100
                          hover:text-gray-900
                          dark:text-gray-400
                          dark:hover:bg-white/5
                          dark:hover:text-white
                        `
                    }
                  `}
                >
                  <Icon size={19} className="shrink-0" />

                  {!collapsed && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Collapse Button */}
        <div
          className="
            hidden
            border-t
            border-gray-200
            p-3
            dark:border-white/10
            lg:block
          "
        >
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="
              flex
              h-10
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:bg-white/5
              dark:hover:text-white
            "
          >
            {collapsed ? (
              <ChevronRight size={18} />
            ) : (
              <>
                <ChevronLeft size={18} />
                <span className="text-xs">
                  Collapse Sidebar
                </span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}