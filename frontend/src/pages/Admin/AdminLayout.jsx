import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../../components/AdminComponent/AdminSidebar";
import AdminHeader from "../../components/AdminComponent/AdminHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  // Baad me Redux se profile lenge
  const profile = {
    fullName: "Admin",
    email: "admin@example.com",
  };

  const handleLogout = () => {
    console.log("Admin logout");
  };

  return (
    <div
      className="
        min-h-screen
        bg-gray-50
        dark:bg-[#0d1117]
      "
    >
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      <AdminHeader
        onMenuClick={() => setSidebarOpen(true)}
        collapsed={sidebarCollapsed}
      />

      <main
        className={`
          min-h-screen
          pt-18
          transition-all
          duration-300
          ${
            sidebarCollapsed
              ? "lg:pl-19.5"
              : "lg:pl-65"
          }
        `}
      >
        <div
          className="
            mx-auto
            w-full
            max-w-[1600px]
            p-4
            sm:p-6
            xl:p-7
          "
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}