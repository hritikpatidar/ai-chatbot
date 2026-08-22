import React from "react";
import {
  Users,
  UserCheck,
  UserX,
  MessageSquare,
  MessagesSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  Bot,
  CalendarDays,
} from "lucide-react";

export default function AdminAnalytics() {
  const stats = [
    {
      title: "Total Clients",
      value: "248",
      change: "+12.5%",
      positive: true,
      icon: Users,
    },
    {
      title: "Active Clients",
      value: "192",
      change: "+8.2%",
      positive: true,
      icon: UserCheck,
    },
    {
      title: "Inactive Clients",
      value: "56",
      change: "-4.3%",
      positive: true,
      icon: UserX,
    },
    {
      title: "Total Conversations",
      value: "18,492",
      change: "+18.7%",
      positive: true,
      icon: MessagesSquare,
    },
    {
      title: "Total Messages",
      value: "84,721",
      change: "+24.1%",
      positive: true,
      icon: MessageSquare,
    },
    {
      title: "Active Chatbots",
      value: "214",
      change: "+6.8%",
      positive: true,
      icon: Bot,
    },
    {
      title: "Subscriptions",
      value: "221",
      change: "+10.4%",
      positive: true,
      icon: CreditCard,
    },
    {
      title: "Engagement",
      value: "76.8%",
      change: "+5.6%",
      positive: true,
      icon: Activity,
    },
  ];

  const monthlyData = [
    { month: "Jan", clients: 120, conversations: 4200 },
    { month: "Feb", clients: 145, conversations: 5100 },
    { month: "Mar", clients: 158, conversations: 6300 },
    { month: "Apr", clients: 176, conversations: 7200 },
    { month: "May", clients: 194, conversations: 8900 },
    { month: "Jun", clients: 218, conversations: 10500 },
    { month: "Jul", clients: 231, conversations: 12800 },
    { month: "Aug", clients: 248, conversations: 14600 },
  ];

  const maxConversation = Math.max(
    ...monthlyData.map((item) => item.conversations),
  );

  const topClients = [
    {
      name: "Fresh Basket",
      email: "contact@freshbasket.com",
      conversations: "2,842",
      messages: "12,492",
      status: "active",
    },
    {
      name: "Tech Store",
      email: "hello@techstore.com",
      conversations: "2,316",
      messages: "10,827",
      status: "active",
    },
    {
      name: "Fashion Hub",
      email: "support@fashionhub.com",
      conversations: "1,984",
      messages: "8,412",
      status: "active",
    },
    {
      name: "Food Corner",
      email: "info@foodcorner.com",
      conversations: "1,742",
      messages: "7,891",
      status: "active",
    },
    {
      name: "Home Store",
      email: "admin@homestore.com",
      conversations: "1,428",
      messages: "6,723",
      status: "inactive",
    },
  ];

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-[#0d1117] sm:p-6 lg:p-7">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitor your chatbot platform performance and growth.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              text-sm
              text-gray-600
              shadow-sm
              dark:border-white/10
              dark:bg-[#151a22]
              dark:text-gray-300
            "
          >
            <CalendarDays size={16} />

            <span>Last 30 days</span>
          </div>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="
                rounded-xl
                border
                border-gray-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:shadow-md
                dark:border-white/10
                dark:bg-[#151a22]
              "
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <h3 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {item.value}
                  </h3>
                </div>

                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                    dark:bg-blue-500/10
                    dark:text-blue-400
                  "
                >
                  <Icon size={19} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-1.5">
                {item.positive ? (
                  <TrendingUp size={14} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={14} className="text-red-500" />
                )}

                <span
                  className={`text-xs font-medium ${
                    item.positive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {item.change}
                </span>

                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* =====================================================
          CHART SECTION
      ===================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Growth Chart */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            xl:col-span-2
            dark:border-white/10
            dark:bg-[#151a22]
          "
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Platform Growth
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Client and conversation growth
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Clients
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Conversations
              </div>
            </div>
          </div>

          <div className="flex h-72 items-end gap-3 overflow-x-auto pb-6">
            {monthlyData.map((item) => {
              const height = (item.conversations / maxConversation) * 100;

              return (
                <div
                  key={item.month}
                  className="flex min-w-12 flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-56 w-full items-end justify-center gap-1">
                    {/* Clients */}

                    <div
                      className="
                        w-2.5
                        rounded-t-md
                        bg-blue-500
                        transition-all
                      "
                      style={{
                        height: `${Math.max((item.clients / 250) * 100, 8)}%`,
                      }}
                      title={`${item.clients} clients`}
                    />

                    {/* Conversations */}

                    <div
                      className="
                        w-2.5
                        rounded-t-md
                        bg-emerald-500
                        transition-all
                      "
                      style={{
                        height: `${height}%`,
                      }}
                      title={`${item.conversations} conversations`}
                    />
                  </div>

                  <span className="text-[11px] text-gray-400">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Client Status */}

        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#151a22]
          "
        >
          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Client Status
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Current client distribution
            </p>
          </div>

          <div className="flex items-center justify-center py-4">
            <div
              className="
                relative
                flex
                h-44
                w-44
                items-center
                justify-center
                rounded-full
                bg-[conic-gradient(#22c55e_0_77%,#ef4444_77%_100%)]
              "
            >
              <div
                className="
                  flex
                  h-28
                  w-28
                  flex-col
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  dark:bg-[#151a22]
                "
              >
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  248
                </span>

                <span className="text-xs text-gray-400">Total</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-green-500" />

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Active
                </span>
              </div>

              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                192
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500" />

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Inactive
                </span>
              </div>

              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                56
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TOP CLIENTS
      ===================================================== */}

      <div
        className="
          mt-6
          overflow-hidden
          rounded-xl
          border
          border-gray-200
          bg-white
          shadow-sm
          dark:border-white/10
          dark:bg-[#151a22]
        "
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-white/10">
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Top Clients
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Clients with highest chatbot activity
            </p>
          </div>

          <button
            type="button"
            className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            View All
          </button>
        </div>

        {/* Desktop */}

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/10">
                <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Client
                </th>

                <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Conversations
                </th>

                <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Messages
                </th>

                <th className="px-5 py-3 text-xs font-medium text-gray-500 dark:text-gray-400">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {topClients.map((client) => (
                <tr
                  key={client.email}
                  className="border-b border-gray-100 last:border-0 dark:border-white/10"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {client.name}
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        {client.email}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {client.conversations}
                  </td>

                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                    {client.messages}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        client.status === "active"
                          ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                          : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      }`}
                    >
                      {client.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}

        <div className="divide-y divide-gray-100 dark:divide-white/10 md:hidden">
          {topClients.map((client) => (
            <div key={client.email} className="p-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {client.name}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-gray-400">
                    {client.email}
                  </p>
                </div>

                <span
                  className={`ml-3 rounded-full px-2.5 py-1 text-[10px] font-medium ${
                    client.status === "active"
                      ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                      : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  }`}
                >
                  {client.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 p-3 dark:bg-white/5">
                  <p className="text-[10px] text-gray-400">Conversations</p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {client.conversations}
                  </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-3 dark:bg-white/5">
                  <p className="text-[10px] text-gray-400">Messages</p>

                  <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                    {client.messages}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
