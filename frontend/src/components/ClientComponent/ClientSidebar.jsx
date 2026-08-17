import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LayoutDashboard,
  Package,
  HelpCircle,
  Building2,
  Bot,
  LogOut,
  X,
  Ticket,
} from "lucide-react";

import { handleLogout } from "../../utils/logout";
import { useState } from "react";
import { getImageUrl } from "../../utils/imageUrl";
import profile from "../../assets/profile1.jpg";

export default function ClientSidebar({ mobileOpen, setMobileOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const { profileDetails, refreshToken } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const menuItems = [
    {
      label: "Dashboard",
      path: "/client",
      icon: LayoutDashboard,
    },
    {
      label: "Products",
      path: "/client/products",
      icon: Package,
    },
    {
      label: "FAQs",
      path: "/client/faqs",
      icon: HelpCircle,
    },
    {
      label: "Tickets",
      path: "/client/tickets",
      icon: Ticket,
    },
    {
      label: "Chatbot Settings",
      path: "/client/chatbot-settings",
      icon: Building2,
    },
    {
      label: "Settings",
      path: "/client/client-settings",
      icon: Building2,
    },
  ];

  const handleAuth = async () => {
    await handleLogout({
      dispatch,
      navigate,
      setIsLogoutLoading,
      refreshToken,
    });
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="
            fixed
            inset-0
            z-40
            bg-black/50
            backdrop-blur-sm
            lg:hidden
          "
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-65
          flex-col
          border-r
          border-gray-200
          bg-white
          transition-transform
          duration-300
          dark:border-white/10
          dark:bg-[#11151d]

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div
          className="
            flex
            h-18
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            px-5
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-600
                text-white
                shadow-lg
                shadow-blue-500/20
              "
            >
              <Bot size={21} />
            </div>
            <div>
              <h1 className="text-sm font-semibold">AI Chatbot</h1>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Client Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="
              rounded-lg
              p-2
              text-gray-500
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-white/10
              lg:hidden
            "
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="
            mx-4
            mt-5
            rounded-xl
            border
            border-gray-200
            bg-gray-50
            p-3
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-full
                bg-blue-500/10
                text-sm
                font-semibold
                text-blue-600
                dark:text-blue-400
              "
            >
              {profileDetails?.profileImage ? (
                <img
                  src={getImageUrl(profileDetails?.profileImage, profile)}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                profileDetails?.fullName?.charAt(0)?.toUpperCase() || "A"
              )}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {profileDetails?.fullName || "Admin"}
              </p>

              <p className="truncate text-[11px] text-gray-500 dark:text-gray-400">
                {profileDetails?.email || "Admin account"}
              </p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 overflow-y-auto px-4">
          <p
            className="
              mb-2
              px-3
              text-[10px]
              font-semibold
              uppercase
              tracking-wider
              text-gray-400
            "
          >
            Management
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/client"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
                    group
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition

                    ${
                      isActive
                        ? `
                          bg-blue-600
                          text-white
                          shadow-lg
                          shadow-blue-500/20
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
                    `
                  }
                >
                  <Icon size={18} />
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div
          className="
            shrink-0
            border-t
            border-gray-200
            p-4
            dark:border-white/10
          "
        >
          <button
            type="button"
            onClick={handleAuth}
            disabled={isLogoutLoading}
            className="
              flex
              w-full
              items-center
              gap-3
              rounded-xl
              px-3
              py-2.5
              text-sm
              font-medium
              text-red-500
              transition
              hover:bg-red-50
              dark:hover:bg-red-500/10
            "
          >
            <LogOut size={18} />
            <span> {isLogoutLoading ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
