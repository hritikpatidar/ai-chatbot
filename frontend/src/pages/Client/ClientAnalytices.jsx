import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  MessageSquare,
  Users,
  Clock3,
  CircleCheck,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarDays,
  ChevronDown,
  Download,
  Sparkles,
  Flame,
  Globe,
  Smartphone,
  Monitor,
  Star,
  Search,
  Bot,
  RefreshCw,
  Activity,
  Zap,
} from "lucide-react";
import CustomSelect from "../../components/common/CustomSelect";
import { useUsageAnalytics } from "../../hooks/Client/useUsageAnalytics";
import { useSelector } from "react-redux";

// Demo data: replace with your analytics API response.
const conversationData = {
  7: [
    { day: "Mon", conversations: 120, users: 80 },
    { day: "Tue", conversations: 165, users: 105 },
    { day: "Wed", conversations: 140, users: 92 },
    { day: "Thu", conversations: 205, users: 132 },
    { day: "Fri", conversations: 175, users: 115 },
    { day: "Sat", conversations: 245, users: 160 },
    { day: "Sun", conversations: 215, users: 145 },
  ],
  30: [
    { day: "Week 1", conversations: 620, users: 410 },
    { day: "Week 2", conversations: 780, users: 520 },
    { day: "Week 3", conversations: 690, users: 470 },
    { day: "Week 4", conversations: 940, users: 650 },
  ],
  90: [
    { day: "Aug", conversations: 2100, users: 1400 },
    { day: "Sep", conversations: 2650, users: 1750 },
    { day: "Oct", conversations: 3200, users: 2200 },
  ],
};

const activityData = [
  { day: "Mon", newUsers: 42, returningUsers: 25 },
  { day: "Tue", newUsers: 58, returningUsers: 32 },
  { day: "Wed", newUsers: 46, returningUsers: 35 },
  { day: "Thu", newUsers: 71, returningUsers: 42 },
  { day: "Fri", newUsers: 83, returningUsers: 51 },
  { day: "Sat", newUsers: 65, returningUsers: 39 },
  { day: "Sun", newUsers: 76, returningUsers: 48 },
];

const topics = [
  { name: "Product Information", count: 320, color: "bg-blue-500" },
  { name: "Pricing & Plans", count: 280, color: "bg-violet-500" },
  { name: "Order Status", count: 190, color: "bg-blue-500" },
  { name: "Returns & Refunds", count: 150, color: "bg-emerald-500" },
  { name: "Other Queries", count: 120, color: "bg-amber-500" },
];

const sourceData = [
  { name: "Website", value: 62, color: "#6366f1" },
  { name: "Widget", value: 18, color: "#3b82f6" },
  { name: "Mobile App", value: 12, color: "#10b981" },
  { name: "Other", value: 8, color: "#f59e0b" },
];

const conversations = [
  {
    name: "John Doe",
    email: "john@example.com",
    initials: "JD",
    message: "How can I upgrade my plan?",
    category: "Pricing",
    status: "Resolved",
    time: "2 min ago",
  },
  {
    name: "Sarah Smith",
    email: "sarah@example.com",
    initials: "SS",
    message: "Where can I check my order?",
    category: "Order Status",
    status: "In Progress",
    time: "15 min ago",
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    initials: "MJ",
    message: "Can you tell me about your products?",
    category: "Product Info",
    status: "Resolved",
    time: "32 min ago",
  },
  {
    name: "Emily Brown",
    email: "emily@example.com",
    initials: "EB",
    message: "I need help with my account.",
    category: "Support",
    status: "Pending",
    time: "48 min ago",
  },
];

function Card({ children, className = "" }) {
  return (
    <section
      className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-colors dark:border-white/10 dark:bg-[#171b23] sm:p-5 ${className}`}
    >
      {children}
    </section>
  );
}

const UsageCard = ({
  title,
  description,
  icon: Icon,
  used,
  limit,
  unit,
  color = "blue",
}) => {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;

  const remaining = Math.max(limit - used, 0);

  const colors = {
    blue: {
      icon: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      bar: "bg-blue-600 dark:bg-blue-500",
      badge: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
    },
    violet: {
      icon: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      bar: "bg-violet-600 dark:bg-violet-500",
      badge:
        "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
    },
    emerald: {
      icon: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      bar: "bg-emerald-600 dark:bg-emerald-500",
      badge:
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
  };

  const theme = colors[color];

  const formatNumber = (number) =>
    new Intl.NumberFormat("en-IN").format(number);

  return (
    <div
      className="
        min-w-0 rounded-2xl border border-gray-200
        bg-white p-4 shadow-sm transition
        hover:shadow-md sm:p-5
        dark:border-white/10 dark:bg-[#171b23]
      "
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}
          >
            <Icon size={21} />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        <span
          className={`shrink-0 rounded-lg px-2 py-1 text-xs font-semibold ${theme.badge}`}
        >
          {percentage.toFixed(0)}%
        </span>
      </div>

      {/* Usage */}
      <div className="mt-6">
        <div className="flex flex-wrap items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-xl">
            {formatNumber(used)}
          </span>

          <span className="text-sm text-gray-400 dark:text-gray-500">
            / {formatNumber(limit)} {unit}
          </span>
        </div>

        {/* Progress */}
        <div
          className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-white/10"
          role="progressbar"
          aria-label={`${title} usage`}
          aria-valuenow={Math.round(percentage)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className={`h-full rounded-full transition-all duration-500 ${theme.bar}`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Used this billing period
          </span>

          <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
            {formatNumber(remaining)} left
          </span>
        </div>
      </div>
    </div>
  );
};

function SectionHeading({ icon: Icon, title, action }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 ">
      <div className="flex min-w-0 items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
          <Icon size={19} />
        </div>
        <h2 className="truncate text-sm font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
      </div>
      <div>{action}</div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
  iconClass,
  description,
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </p>
          <p className="mt-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {value}
          </p>
        </div>
        <div className={`rounded-xl p-3 ${iconClass}`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            positive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          }`}
        >
          {positive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {change}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {description || "vs previous period"}
        </span>
      </div>
    </Card>
  );
}

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  backgroundColor: "#ffffff",
  color: "#0f172a",
  fontSize: 12,
};

export default function Analytics() {
  const [dateRange, setDateRange] = useState("7");
  const [chartMode, setChartMode] = useState("conversations");
  const [search, setSearch] = useState("");
  const { client, loading } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );

  const {
    data: usageAnalyticsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    status,
    fetchStatus,
  } = useUsageAnalytics(Boolean(client?.active_plan));

  const usage = usageAnalyticsResponse?.data?.data?.usage || {};

  const chartData = conversationData[dateRange];

  const filteredConversations = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) return conversations;

    return conversations.filter((item) =>
      [item.name, item.email, item.message, item.category, item.status].some(
        (field) => field.toLowerCase().includes(value),
      ),
    );
  }, [search]);

  const metrics = [
    {
      title: "Total Conversations",
      value: "1,248",
      change: "+12%",
      positive: true,
      icon: MessageSquare,
      iconClass:
        "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
    },
    {
      title: "Unique Users",
      value: "892",
      change: "+8%",
      positive: true,
      icon: Users,
      iconClass:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
    },
    {
      title: "Avg. Response Time",
      value: "1.2s",
      change: "-35%",
      positive: true,
      icon: Clock3,
      iconClass:
        "bg-fuchsia-50 text-fuchsia-600 dark:bg-fuchsia-500/15 dark:text-fuchsia-400",
    },
    {
      title: "Resolution Rate",
      value: "78%",
      change: "+6%",
      positive: true,
      icon: CircleCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
    },
  ];

  return (
    <div className="min-h-full w-full text-gray-900 dark:text-white">
      <div className="w-full space-y-6">
        {/* Page heading */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row xl:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div
                className="
                  flex h-10 w-10
                  items-center justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-500
                "
              >
                <Activity size={21} />
              </div>

              <div>
                <h1
                  className="
                    text-xl font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Analytics
                </h1>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Track chatbot performance and understand your users.
                </p>
              </div>
            </div>
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
              onClick={() => {}}
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
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Informational banner */}
        <div className="flex items-start gap-3 rounded-2xl border border-indigo-100 bg-linear-to-r from-indigo-50 to-violet-50 p-4 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10">
          <Sparkles
            size={20}
            className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Your chatbot performance at a glance
            </p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Review conversations, response speed, popular topics and user
              activity from one dashboard.
            </p>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard key={metric.title} {...metric} />
          ))}
        </div>

        <div
          className="
            rounded-2xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <h2 className="text-base font-semibold">Usage Analytics</h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Track your Gemini API usage and plan limits.
          </p>

          {/* Usage Cards */}
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <UsageCard
              title="Gemini Tokens"
              description="Total token consumption"
              icon={Zap}
              used={usage?.tokens?.used ?? 0}
              limit={usage?.tokens?.limit ?? 0}
              unit="tokens"
              color="blue"
            />

            <UsageCard
              title="Conversations"
              description="Conversations created"
              icon={MessageSquare}
              used={usage?.conversations?.used ?? 0}
              limit={usage?.conversations?.limit ?? 0}
              unit="conversations"
              color="violet"
            />

            <UsageCard
              title="AI Responses"
              description="Responses generated"
              icon={Bot}
              used={usage?.aiResponses?.used ?? 0}
              limit={usage?.aiResponses?.limit ?? 0}
              unit="responses"
              color="emerald"
            />
          </div>

          {/* Bottom Summary */}
          <div
            className="
      mt-5 flex items-start gap-3 rounded-xl
      border border-gray-200 bg-gray-50 p-3.5
      dark:border-white/10 dark:bg-white/3
    "
          >
            <TrendingUp
              size={18}
              className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400"
            />

            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                Usage summary
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                You have used{" "}
                {usage?.tokens?.limit > 0
                  ? ((usage.tokens.used / usage.tokens.limit) * 100).toFixed(1)
                  : "0.0"}
                % of your token quota,{" "}
                {usage?.conversations?.limit > 0
                  ? (
                      (usage.conversations.used / usage.conversations.limit) *
                      100
                    ).toFixed(0)
                  : "0"}
                % of your conversation quota and{" "}
                {usage?.aiResponses?.limit > 0
                  ? (
                      (usage.aiResponses.used / usage.aiResponses.limit) *
                      100
                    ).toFixed(0)
                  : "0"}
                % of your AI response quota.
              </p>
            </div>
          </div>
        </div>

        {/* Main charts */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <Card className="xl:col-span-3">
            <SectionHeading
              icon={MessageSquare}
              title="Conversations Overview"
              action={
                // <select
                //   value={chartMode}
                //   onChange={(e) => setChartMode(e.target.value)}
                //   className="max-w-36 rounded-lg border border-gray-200 bg-white px-2 py-2 text-xs outline-none dark:border-white/10 dark:bg-[#171b23] dark:text-gray-200"
                //   aria-label="Conversation chart metric"
                // >
                //   <option value="conversations">Conversations</option>
                //   <option value="users">Unique users</option>
                // </select>
                <CustomSelect
                  size="sm"
                  // label="Business Status"
                  value={chartMode}
                  onChange={(e) => setChartMode(e.target.value)}
                  options={[
                    {
                      value: "conversations",
                      label: "Conversations",
                    },
                    {
                      value: "users",
                      label: "Unique users",
                    },
                  ]}
                  placeholder="Select status"
                  // error={errors.accountStatus?.message}
                  required
                  icon={false}
                />
              }
            />

            <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Total Conversations
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Unique Users
              </span>
            </div>

            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 8, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="conversationGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#6366f1"
                        stopOpacity={0.25}
                      />
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="usersGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.2}
                  />

                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    dy={8}
                  />

                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value) => [value.toLocaleString(), ""]}
                  />

                  <Area
                    type="monotone"
                    dataKey={
                      chartMode === "conversations" ? "conversations" : "users"
                    }
                    name={
                      chartMode === "conversations"
                        ? "Conversations"
                        : "Unique Users"
                    }
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="url(#conversationGradient)"
                    activeDot={{ r: 5 }}
                  />

                  {chartMode === "conversations" && (
                    <Area
                      type="monotone"
                      dataKey="users"
                      name="Unique Users"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#usersGradient)"
                      activeDot={{ r: 4 }}
                    />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="xl:col-span-2">
            <SectionHeading icon={Users} title="User Activity" />

            <div className="mb-4 flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                New Users
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-400" />
                Returning
              </span>
            </div>

            <div className="h-70 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={
                    dateRange === "7"
                      ? activityData
                      : chartData.map((item) => ({
                          day: item.day,
                          newUsers: item.users,
                          returningUsers: Math.round(item.users * 0.42),
                        }))
                  }
                  margin={{ top: 8, right: 0, left: -22, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#94a3b8"
                    strokeOpacity={0.2}
                  />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar
                    dataKey="newUsers"
                    name="New Users"
                    stackId="users"
                    fill="#6366f1"
                    radius={[0, 0, 0, 0]}
                    maxBarSize={28}
                  />
                  <Bar
                    dataKey="returningUsers"
                    name="Returning Users"
                    stackId="users"
                    fill="#60a5fa"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={28}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Insights row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* <Card>
            <SectionHeading
              icon={Flame}
              title="Popular Topics"
              action={
                <span className="text-xs font-medium text-gray-400">Top 5</span>
              }
            />

            <div className="space-y-5">
              {topics.map((topic, index) => (
                <div key={topic.name}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-semibold text-gray-500 dark:bg-[#0f131a]">
                        {index + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-gray-700 dark:text-gray-300">
                        {topic.name}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                      {topic.count}
                    </span>
                  </div>

                  <div className="ml-8 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-[#0f131a]">
                    <div
                      className={`h-full rounded-full ${topic.color}`}
                      style={{
                        width: `${(topic.count / topics[0].count) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card> */}

          <Card>
            <SectionHeading icon={Globe} title="Conversation Sources" />

            <div className="relative h-52.5">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={4}
                    stroke="none"
                  >
                    {sourceData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  1,248
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Conversations
                </span>
              </div>
            </div>

            <div className="mt-3 space-y-3">
              {sourceData.map((source, index) => {
                const SourceIcon = [Monitor, Globe, Smartphone, Bot][index];

                return (
                  <div
                    key={source.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <SourceIcon size={16} style={{ color: source.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {source.name}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {source.value}%
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card>
            <SectionHeading icon={Star} title="User Satisfaction" />

            <div className="flex flex-col items-center py-2">
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[9px] border-emerald-400/20">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  4.6
                </span>
                <div className="mt-1 flex gap-0.5 text-amber-400">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} size={13} fill="currentColor" />
                  ))}
                </div>
              </div>

              <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Based on 328 ratings
              </p>
            </div>

            <div className="mt-5 space-y-4">
              {[
                { label: "Excellent", value: 72, color: "bg-emerald-500" },
                { label: "Good", value: 18, color: "bg-blue-500" },
                { label: "Average", value: 7, color: "bg-amber-400" },
                { label: "Poor", value: 3, color: "bg-rose-500" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="w-16 text-xs text-gray-500 dark:text-gray-400">
                    {item.label}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-[#0f131a]">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="w-9 text-right text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent conversations */}
        {/* <Card className="overflow-hidden">
          <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <SectionHeading icon={MessageSquare} title="Recent Conversations" />

            <div className="flex flex-wrap items-center gap-3">
              <label className="flex min-w-0 items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-white/10 dark:bg-[#0f131a]">
                <Search size={16} className="shrink-0 text-gray-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-gray-400 sm:w-48 dark:text-white"
                />
              </label>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-[#0f131a]"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-white/10 dark:bg-[#0f131a] dark:text-gray-400">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Message</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredConversations.map((item) => (
                  <tr
                    key={item.email}
                    className="transition hover:bg-gray-50/80 dark:hover:bg-[#0f131a]/40"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-100 to-violet-100 text-xs font-bold text-blue-700 dark:from-indigo-500/20 dark:to-violet-500/20 dark:text-blue-300">
                          {item.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {item.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="max-w-60 truncate px-4 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {item.message}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.status === "Resolved"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : item.status === "In Progress"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                              : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-xs text-gray-500 dark:text-gray-400">
                      {item.time}
                    </td>
                  </tr>
                ))}

                {filteredConversations.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      No conversations found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 border-t border-slate-100 pt-4 text-xs text-gray-500 dark:border-white/10 dark:text-gray-400 sm:flex-row sm:items-center">
            <span>Showing {filteredConversations.length} conversations</span>
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Dashboard preview
            </span>
          </div>
        </Card> */}

        {/* Footer */}
        {/* <footer className="flex flex-wrap items-center justify-between gap-2 pb-2 text-xs text-gray-400">
          <span>AI Chatbot Analytics</span>
          <span className="inline-flex items-center gap-1.5">
            <Activity size={13} />
            Performance overview
          </span>
        </footer> */}
      </div>
    </div>
  );
}
