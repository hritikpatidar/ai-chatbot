// import { useState } from "react";
// import { Outlet } from "react-router-dom";

// import AnimatedBackground from "../../components/AnimatedBackground";
// import AdminSidebar from "../../components/AdminComponent/AdminSidebar";
// import AdminHeader from "../../components/AdminComponent/AdminHeader";

// export default function AdminLayout() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   return (
//     <div
//       className="
//         relative
//         flex
//         min-h-screen
//         w-full
//         overflow-hidden
//         bg-gray-50
//         text-gray-900
//         dark:bg-[#0b0f17]
//         dark:text-white
//       "
//     >
//       {/* Background */}
//       {/* <AnimatedBackground /> */}

//       {/* Sidebar */}
//       <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

//       {/* Main */}
//       <main
//         className="
//           relative
//           z-10
//           flex
//           h-screen
//           min-w-0
//           flex-1
//           flex-col
//           lg:ml-65
//         "
//       >
//         {/* Fixed Header */}
//         <div
//           className="
//             sticky
//             top-0
//             z-50
//             shrink-0
//           "
//         >
//           <AdminHeader onMenuClick={() => setMobileOpen(true)} />
//         </div>

//         {/* Only Page Content Scroll */}
//         <div
//           className="
//             min-h-0
//             flex-1
//             overflow-y-auto
//           "
//         >
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }

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