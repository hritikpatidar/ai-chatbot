import React, { useMemo, useState } from "react";
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
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import CustomSelect from "../../components/common/CustomSelect";
import { useAdminAnalytics } from "../../hooks/Admin/useAdminAnalytics";

const formatNumber = (value = 0) => Number(value || 0).toLocaleString("en-IN");

const formatPercentage = (value = 0) => {
  const number = Number(value || 0);
  return `${number > 0 ? "+" : ""}${number}%`;
};

const getChangeColor = (positive) =>
  positive ? "text-emerald-500" : "text-red-500";

const getChangeIcon = (positive) => (positive ? TrendingUp : TrendingDown);

const AnalyticsSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-32 rounded-xl bg-gray-200 dark:bg-white/5"
        />
      ))}
    </div>

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <div className="h-80 rounded-xl bg-gray-200 dark:bg-white/5 xl:col-span-2" />
      <div className="h-80 rounded-xl bg-gray-200 dark:bg-white/5" />
    </div>

    <div className="h-72 rounded-xl bg-gray-200 dark:bg-white/5" />
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex min-h-40 items-center justify-center text-sm text-gray-400">
    {message}
  </div>
);

// Platform Growth Tooltip

const GrowthTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-45 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#202631]">
      <p className="mb-3 text-xs font-semibold text-gray-900 dark:text-white">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="mb-2 flex items-center justify-between gap-5 last:mb-0"
        >
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />

            <span className="text-xs text-gray-500 dark:text-gray-400">
              {item.name}
            </span>
          </div>

          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {Number(item.value || 0).toLocaleString("en-IN")}
          </span>
        </div>
      ))}
    </div>
  );
};

// Client Status Tooltip

const ClientStatusTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;

  if (!item) return null;

  return (
    <div className="min-w-40 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-white/10 dark:bg-[#202631]">
      <div className="mb-2 flex items-center gap-2">
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: item.color }}
        />

        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
          {item.name}
        </span>
      </div>

      <p className="text-xl font-bold text-gray-900 dark:text-white">
        {Number(item.value || 0).toLocaleString("en-IN")}
      </p>

      <p className="mt-1 text-xs text-gray-400">
        {item.percentage}% of total clients
      </p>
    </div>
  );
};

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState("7");

  const {
    data: analytics,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminAnalytics(Number(dateRange));

  const statsData = analytics?.data?.data?.stats || {};
  const clientDistribution = analytics?.data?.data?.clientDistribution || {};
  const monthlyData = analytics?.data?.data?.platformGrowth || [];
  const topClients = analytics?.data?.data?.topClients || [];

  const stats = useMemo(() => {
    const totalClients = statsData.totalClients || {};
    const activeClients = statsData.activeClients || {};
    const inactiveClients = statsData.inactiveClients || {};
    const conversations = statsData.totalConversations || {};
    const messages = statsData.totalMessages || {};
    const chatbots = statsData.activeChatbots || {};
    const subscriptions = statsData.subscriptions || {};
    const engagement = statsData.engagement || {};

    return [
      {
        title: "New Clients",
        value: formatNumber(totalClients.value),
        change: totalClients.comparison?.change,
        positive: (totalClients.comparison?.change ?? 0) >= 0,
        comparisonLabel: "vs previous period",
        icon: Users,
      },
      {
        title: "Active Clients",
        value: formatNumber(activeClients.value),
        change: null,
        icon: UserCheck,
      },
      {
        title: "Inactive Clients",
        value: formatNumber(inactiveClients.value),
        change: null,
        icon: UserX,
      },
      {
        title: "Total Conversations",
        value: formatNumber(conversations.value),
        change: conversations.comparison?.change,
        positive: (conversations.comparison?.change ?? 0) >= 0,
        icon: MessagesSquare,
      },
      {
        title: "Total Messages",
        value: formatNumber(messages.value),
        change: messages.comparison?.change,
        positive: (messages.comparison?.change ?? 0) >= 0,
        icon: MessageSquare,
      },
      {
        title: "Active Chatbots",
        value: formatNumber(chatbots.value),
        subtitle: chatbots.isEstimated
          ? "Estimated from active clients"
          : undefined,
        change: null,
        icon: Bot,
      },
      {
        title: "Subscriptions",
        value: formatNumber(subscriptions.value),
        subtitle: `${formatNumber(subscriptions.total)} total subscriptions`,
        change: subscriptions.comparison?.change,
        positive: (subscriptions.comparison?.change ?? 0) >= 0,
        comparisonLabel: subscriptions.comparisonLabel || "vs previous period",
        icon: CreditCard,
      },
      {
        title: "Engagement",
        value: `${Number(engagement.value || 0).toFixed(1)}%`,
        subtitle: `${formatNumber(engagement.engagedClients)} engaged clients`,
        change: null,
        icon: Activity,
      },
    ];
  }, [statsData]);

  const maxConversation = Math.max(
    1,
    ...monthlyData.map((item) => Number(item.conversations || 0)),
  );

  const maxClients = Math.max(
    1,
    ...monthlyData.map((item) => Number(item.clients || 0)),
  );

  const totalClients = Number(clientDistribution.total || 0);
  const activeClients = Number(clientDistribution.active || 0);
  const inactiveClients = Number(clientDistribution.inactive || 0);

  const activePercentage = Number(clientDistribution.activePercentage || 0);

  const inactivePercentage = Number(clientDistribution.inactivePercentage || 0);
  const CLIENT_COLORS = {
    active: "#10b981",
    inactive: "#ef4444",
  };

  const clientStatusData = [
    {
      name: "Active",
      value: activeClients,
      percentage: activePercentage,
      color: CLIENT_COLORS.active,
    },
    {
      name: "Inactive",
      value: inactiveClients,
      percentage: inactivePercentage,
      color: CLIENT_COLORS.inactive,
    },
  ].filter((item) => item.value > 0);
  
  if (isLoading) {
    return (
      <div className="min-h-full">
        <AnalyticsSkeleton />
      </div>
    );
  }

  if (isError && !analytics) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-3">
        <AlertCircle size={35} className="text-red-500" />

        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Failed to load analytics
        </p>

        <p className="max-w-md text-center text-xs text-gray-400">
          {error?.response?.data?.message ||
            error?.message ||
            "Something went wrong."}
        </p>

        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full ">
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

        <div className="flex flex-wrap items-center gap-3">
          <div>
            <CustomSelect
              size="sm"
              // label="Business Status"
              name={"filter"}
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              options={[
                {
                  value: "7",
                  label: "Last 7 days",
                },
                {
                  value: "30",
                  label: "Last 30 days",
                },
                {
                  value: "90",
                  label: "Last 90 days",
                },
              ]}
              placeholder="Select status"
              // error={errors.accountStatus?.message}
              required
              icon={true}
            />
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      border
                      border-gray-200
                      hover:border-gray-300
                      bg-white
                      px-4 py-2.5
                      text-sm
                      font-medium
                      text-gray-700
                      transition-all
                      hover:bg-gray-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                      dark:border-white/8
                      dark:bg-[#171b23]
                      dark:text-gray-300
                      dark:hover:bg-white/4
                      dark:hover:border-white/20
                    "
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Background refresh error */}

      {isError && analytics && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          Could not refresh analytics. Showing the previously loaded data.
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          const ChangeIcon = getChangeIcon(item.positive);
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
                <ChangeIcon
                  size={14}
                  className={getChangeColor(item.positive)}
                />

                <span
                  className={`text-xs font-medium ${
                    item.positive ? "text-emerald-500" : "text-red-500"
                  }`}
                >
                  {formatPercentage(item.change)}
                </span>

                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div
          className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
            xl:col-span-2
            dark:border-white/10
            dark:bg-[#151a22]
          "
        >
          {/* Header */}

          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Platform Growth
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Monthly client and conversation growth
              </p>
            </div>

            {/* Custom Legend */}

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" />

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Clients
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />

                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Conversations
                </span>
              </div>
            </div>
          </div>

          {/* Chart */}

          {monthlyData.length === 0 ? (
            <EmptyState message="No platform growth data available." />
          ) : (
            <div className="h-75 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={monthlyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                  barGap={6}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="currentColor"
                    opacity={0.1}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 11,
                    }}
                    dy={10}
                  />

                  {/* Left axis: Clients */}

                  <YAxis
                    yAxisId="clients"
                    orientation="left"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 10,
                    }}
                    width={40}
                  />

                  {/* Right axis: Conversations */}

                  <YAxis
                    yAxisId="conversations"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 10,
                    }}
                    width={40}
                  />

                  <Tooltip
                    content={<GrowthTooltip />}
                    cursor={{
                      fill: "currentColor",
                      opacity: 0.04,
                    }}
                  />

                  {/* Clients */}

                  <Bar
                    yAxisId="clients"
                    dataKey="clients"
                    name="Clients"
                    fill="#3b82f6"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={22}
                    animationDuration={700}
                  />

                  {/* Conversations */}

                  <Bar
                    yAxisId="conversations"
                    dataKey="conversations"
                    name="Conversations"
                    fill="#10b981"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={22}
                    animationDuration={900}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#151a22]
          "
        >
          {/* Header */}

          <div className="mb-3">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Client Status
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Current client distribution
            </p>
          </div>

          {totalClients === 0 ? (
            <EmptyState message="No clients available." />
          ) : (
            <>
              {/* Donut Chart */}

              <div className="relative h-57.5 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={clientStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={90}
                      paddingAngle={4}
                      cornerRadius={5}
                      stroke="none"
                      animationDuration={800}
                    >
                      {clientStatusData.map((item) => (
                        <Cell key={item.name} fill={item.color} />
                      ))}
                    </Pie>

                    <Tooltip
                      content={<ClientStatusTooltip />}
                      wrapperStyle={{
                        zIndex: 50,
                        pointerEvents: "none",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Content */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatNumber(totalClients)}
                  </span>

                  <span className="mt-1 text-xs text-gray-400">
                    Total Clients
                  </span>
                </div>
              </div>

              {/* Status Details */}

              <div className="mt-3 space-y-4">
                {/* Active */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-emerald-500" />

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Active
                      </p>

                      <p className="text-[11px] text-gray-400">
                        {activePercentage}% of total
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatNumber(activeClients)}
                  </span>
                </div>

                {/* Inactive */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="h-3 w-3 rounded-full bg-red-500" />

                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        Inactive
                      </p>

                      <p className="text-[11px] text-gray-400">
                        {inactivePercentage}% of total
                      </p>
                    </div>
                  </div>

                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatNumber(inactiveClients)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
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
