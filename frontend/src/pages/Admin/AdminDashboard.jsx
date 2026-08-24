import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  UserPlus,
  Bot,
  MoreHorizontal,
  ArrowUpRight,
  Activity,
  Eye,
} from "lucide-react";
import AdminStatCard from "../../components/AdminComponent/AdminStatCard";
import ActionButton from "../../components/common/ActionButton";
import { useNavigate } from "react-router-dom";

const recentClients = [
  {
    id: 1,
    name: "Fresh Basket Grocery",
    email: "admin@freshbasket.com",
    plan: "Professional",
    status: "active",
    chatbot: "online",
    lastLogin: "2 min ago",
    initials: "FB",
  },
  {
    id: 2,
    name: "Tech Store",
    email: "admin@techstore.com",
    plan: "Enterprise",
    status: "active",
    chatbot: "online",
    lastLogin: "12 min ago",
    initials: "TS",
  },
  {
    id: 3,
    name: "Fashion Hub",
    email: "admin@fashionhub.com",
    plan: "Basic",
    status: "inactive",
    chatbot: "offline",
    lastLogin: "2 hours ago",
    initials: "FH",
  },
  {
    id: 4,
    name: "Demo Business",
    email: "demo@business.com",
    plan: "Free",
    status: "inactive",
    chatbot: "offline",
    lastLogin: "Yesterday",
    initials: "DB",
  },
  {
    id: 5,
    name: "Smart Solutions",
    email: "hello@smartsolutions.com",
    plan: "Professional",
    status: "active",
    chatbot: "online",
    lastLogin: "Yesterday",
    initials: "SS",
  },
];

const statusStyles = {
  active: `
    bg-green-500/10
    text-green-600
    dark:text-green-400
  `,
  inactive: `
    bg-gray-500/10
    text-gray-600
    dark:text-gray-400
  `,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div>
          <h1
            className="
              text-xl
              font-bold
              text-gray-900
              dark:text-white
              sm:text-2xl
            "
          >
            Dashboard
          </h1>

          <p
            className="
              mt-1
              text-xs
              text-gray-500
              dark:text-gray-400
              sm:text-sm
            "
          >
            Monitor clients and chatbot activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/clients")}
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-lg
            bg-blue-600
            px-4
            py-2.5
            text-xs
            font-medium
            text-white
            transition
            hover:bg-blue-700
            sm:text-sm
          "
        >
          <Users size={16} />
          View All Clients
        </button>
      </div>

      {/* Stats */}
      <div
        className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          xl:grid-cols-4
        "
      >
        <AdminStatCard
          title="Total Clients"
          value="120"
          description="Registered clients"
          icon={Users}
          iconClass="
            bg-blue-500/10
            text-blue-600
            dark:text-blue-400
          "
          trend="+12.5%"
        />

        <AdminStatCard
          title="Active Clients"
          value="95"
          description="Currently active"
          icon={UserCheck}
          iconClass="
            bg-green-500/10
            text-green-600
            dark:text-green-400
          "
          trend="+8.2%"
        />

        <AdminStatCard
          title="Inactive Clients"
          value="20"
          description="Currently inactive"
          icon={UserX}
          iconClass="
            bg-orange-500/10
            text-orange-600
            dark:text-orange-400
          "
        />

        <AdminStatCard
          title="New Clients"
          value="05"
          description="Added this month"
          icon={UserPlus}
          iconClass="
            bg-purple-500/10
            text-purple-600
            dark:text-purple-400
          "
          trend="+18.4%"
        />
      </div>

      {/* Middle Section */}
      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-3
        "
      >
        {/* Client Activity */}
        <div
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
            xl:col-span-2
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <h2
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Client Activity
              </h2>

              <p
                className="
                  mt-1
                  text-[11px]
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Client activity overview
              </p>
            </div>

            <button
              type="button"
              className="
                rounded-lg
                p-2
                text-gray-400
                hover:bg-gray-100
                dark:hover:bg-white/5
              "
            >
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Fake Chart */}
          <div className="mt-6">
            <div
              className="
                flex
                h-47.5
                items-end
                gap-2
                sm:gap-4
              "
            >
              {[45, 65, 52, 78, 60, 88, 72, 95, 82, 100, 86, 110].map(
                (height, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      flex-1
                      flex-col
                      items-center
                      justify-end
                      gap-2
                    "
                  >
                    <div
                      className="
                        w-full
                        max-w-8
                        rounded-t-md
                        bg-blue-500/80
                        transition
                        hover:bg-blue-600
                      "
                      style={{
                        height: `${height}px`,
                      }}
                    />
                  </div>
                ),
              )}
            </div>

            <div
              className="
                mt-3
                flex
                justify-between
                border-t
                border-gray-100
                pt-3
                dark:border-white/5
              "
            >
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map(
                (month) => (
                  <span
                    key={month}
                    className="
                    text-[9px]
                    text-gray-400
                    dark:text-gray-500
                    sm:text-[10px]
                  "
                  >
                    {month}
                  </span>
                ),
              )}
            </div>
          </div>
        </div>

        {/* System Overview */}
        <div
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
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
                items-center
                justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-500
              "
            >
              <Activity size={19} />
            </div>

            <div>
              <h2
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                System Overview
              </h2>

              <p
                className="
                  text-[10px]
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Current platform status
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <ProgressItem label="Active Clients" value="79%" progress={79} />

            <ProgressItem label="Chatbots Online" value="84%" progress={84} />

            <ProgressItem
              label="Subscriptions Active"
              value="72%"
              progress={72}
            />
          </div>

          <div
            className="
              mt-7
              flex
              items-center
              justify-between
              rounded-xl
              bg-green-500/5
              px-3
              py-3
              dark:bg-green-500/5
            "
          >
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className="
                    absolute
                    inline-flex
                    h-full
                    w-full
                    animate-ping
                    rounded-full
                    bg-green-400
                    opacity-75
                  "
                />

                <span
                  className="
                    relative
                    inline-flex
                    h-2.5
                    w-2.5
                    rounded-full
                    bg-green-500
                  "
                />
              </span>

              <span
                className="
                  text-xs
                  font-medium
                  text-green-600
                  dark:text-green-400
                "
              >
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Clients */}
      <div
        className="
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            flex-col
            gap-3
            border-b
            border-gray-200
            p-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-white/10
          "
        >
          <div>
            <h2
              className="
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Recent Clients
            </h2>

            <p
              className="
                mt-1
                text-[11px]
                text-gray-500
                dark:text-gray-400
              "
            >
              Latest registered clients
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-medium
              text-blue-600
              hover:text-blue-700
              dark:text-blue-400
            "
          >
            View all
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5">
            <thead>
              <tr
                className="
                  border-b
                  border-gray-100
                  dark:border-white/5
                "
              >
                <th className="table-head">Client</th>

                <th className="table-head">Plan</th>

                <th className="table-head">Status</th>

                <th className="table-head">Chatbot</th>

                <th className="table-head">Last Login</th>

                <th className="table-head text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {recentClients.map((client) => (
                <tr
                  key={client.id}
                  className="
                    border-b
                    border-gray-100
                    transition
                    hover:bg-gray-50
                    last:border-0
                    dark:border-white/5
                    dark:hover:bg-white/2
                  "
                >
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          bg-blue-500/10
                          text-[11px]
                          font-semibold
                          text-blue-600
                          dark:text-blue-400
                        "
                      >
                        {client.initials}
                      </div>

                      <div>
                        <p
                          className="
                            text-xs
                            font-semibold
                            text-gray-900
                            dark:text-white
                          "
                        >
                          {client.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[10px]
                            text-gray-500
                            dark:text-gray-400
                          "
                        >
                          {client.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="table-cell">
                    <span
                      className="
                        text-xs
                        font-medium
                        text-gray-700
                        dark:text-gray-300
                      "
                    >
                      {client.plan}
                    </span>
                  </td>

                  <td className="table-cell">
                    <span
                      className={`
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        px-2.5
                        py-1
                        text-[10px]
                        font-medium
                        ${statusStyles[client.status]}
                      `}
                    >
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${
                            client.status === "active"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }
                        `}
                      />

                      {client.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="table-cell">
                    <span
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        text-[10px]
                        font-medium
                      "
                    >
                      <span
                        className={`
                          h-1.5
                          w-1.5
                          rounded-full
                          ${
                            client.chatbot === "online"
                              ? "bg-green-500"
                              : "bg-gray-400"
                          }
                        `}
                      />

                      <span
                        className="
                          text-gray-600
                          dark:text-gray-400
                        "
                      >
                        {client.chatbot === "online" ? "Online" : "Offline"}
                      </span>
                    </span>
                  </td>

                  <td className="table-cell">
                    <span
                      className="
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      {client.lastLogin}
                    </span>
                  </td>

                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end">
                      <ActionButton
                        icon={<Eye size={14} />}
                        title="View"
                        onClick={() => onView?.(client)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ProgressItem({ label, value, progress }) {
  return (
    <div>
      <div className="mb-2 flex justify-between">
        <span
          className="
            text-xs
            text-gray-600
            dark:text-gray-400
          "
        >
          {label}
        </span>

        <span
          className="
            text-xs
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          {value}
        </span>
      </div>

      <div
        className="
          h-2
          overflow-hidden
          rounded-full
          bg-gray-100
          dark:bg-white/5
        "
      >
        <div
          className="
            h-full
            rounded-full
            bg-blue-600
            transition-all
          "
          style={{
            width: `${progress}%`,
          }}
        />
      </div>
    </div>
  );
}
