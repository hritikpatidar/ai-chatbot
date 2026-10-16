import {
  Activity,
  Bot,
  MessageSquare,
  Zap,
  TrendingUp,
  Gauge,
  MessageCircleQuestion,
  Plus,
} from "lucide-react";

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
          <span className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
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

export default function ClientAnalytices() {
  // Demo values: replace with API usage data.
  const usage = {
    tokens: {
      used: 325000,
      limit: 1000000,
    },
    conversations: {
      used: 12,
      limit: 20,
    },
    aiResponses: {
      used: 286,
      limit: 500,
    },
  };

  const totalUsage =
    usage.tokens.limit + usage.conversations.limit + usage.aiResponses.limit;

  return (
    <>
      <div className="flex flex-col gap-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
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
              <Gauge size={21} />
            </div>

            <div>
              <h1
                className="
                  text-xl font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Usage Analytics
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Track your Gemini API usage and plan limits.
              </p>
            </div>
          </div>
        </div>
        <div
          className="
            inline-flex w-fit items-center gap-1.5 rounded-lg
            border border-gray-200 px-3 py-2
            text-xs font-medium text-gray-600
            dark:border-white/10 dark:text-gray-300
          "
        >
          <Activity size={14} className="text-emerald-500" />
          Current usage
        </div>
      </div>
      <section
        className="
        min-w-0 rounded-2xl border border-gray-200
        bg-white p-4 shadow-sm sm:p-5
        dark:border-white/10 dark:bg-[#171b23]
      "
      >
        {/* Usage Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <UsageCard
            title="Gemini Tokens"
            description="Total token consumption"
            icon={Zap}
            used={usage.tokens.used}
            limit={usage.tokens.limit}
            unit="tokens"
            color="blue"
          />

          <UsageCard
            title="Conversations"
            description="Conversations created"
            icon={MessageSquare}
            used={usage.conversations.used}
            limit={usage.conversations.limit}
            unit="conversations"
            color="violet"
          />

          <UsageCard
            title="AI Responses"
            description="Responses generated"
            icon={Bot}
            used={usage.aiResponses.used}
            limit={usage.aiResponses.limit}
            unit="responses"
            color="emerald"
          />
        </div>

        {/* Bottom Summary */}
        <div
          className="
          mt-4 flex items-start gap-3 rounded-xl
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
              {usage.tokens.limit > 0
                ? ((usage.tokens.used / usage.tokens.limit) * 100).toFixed(1)
                : "0.0"}
              % of your token quota,{" "}
              {usage.conversations.limit > 0
                ? (
                    (usage.conversations.used / usage.conversations.limit) *
                    100
                  ).toFixed(0)
                : "0"}
              % of your conversation quota and{" "}
              {usage.aiResponses.limit > 0
                ? (
                    (usage.aiResponses.used / usage.aiResponses.limit) *
                    100
                  ).toFixed(0)
                : "0"}
              % of your AI response quota.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
