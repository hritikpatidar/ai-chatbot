import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Building2,
  Package,
  HelpCircle,
  Bot,
  ArrowRight,
  Settings,
  Ticket,
  Zap,
  MessageSquare,
  TrendingUp,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import PageLoader from "../../components/common/PageLoader";
import { getClientById } from "../../redux/features/Client/clientSlice";
import StatCard from "../../components/ClientComponent/StatCard";
import ClientOverview from "../../components/ClientComponent/Client/ClientOverview";
import {
  useClientById,
  useUsageAnalytics,
} from "../../hooks/Client/useUsageAnalytics";

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

export default function ClientDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { clientConfigLoading } = useSelector((store) => store.chatSlice);

  const { client, loading } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );

  const { profileDetails, refreshToken } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  // Client Details API
  const {
    data: clientResponse,
    isLoading: clientLoading,
    isFetchingClient,
    isError: clientError,
    error: clientErrorMessage,
    refetch: refetchClient,
  } = useClientById(dispatch, profileDetails?.clientId);

  // Adjust this path according to your actual API response
  const clientDetails = clientResponse?.payload?.client || {};

  const {
    data: usageAnalyticsResponse,
    isLoading,
    isFetching,
    isError,
    error,
    status,
    fetchStatus,
    refetch: refetchUsage,
  } = useUsageAnalytics(Boolean(client?.active_plan));

  const usage = usageAnalyticsResponse?.data?.data?.usage || {};

  // useEffect(() => {
  //   dispatch(getClientById(profileDetails?.clientId));
  // }, [dispatch]);

  if (isLoading && clientLoading && !clientDetails && clientConfigLoading) {
    return <PageLoader />;
  }

  const chatbot = clientDetails?.chatbot || {};

  return (
    <div className="min-h-full w-full bg-transparent text-gray-900 dark:text-white">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
          flex h-10 w-10 items-center justify-center
          rounded-xl bg-blue-500/10 text-blue-500
        "
            >
              <LayoutDashboard size={21} />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manage your client, products, FAQs and chatbot configuration.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Refresh Button */}
          <button
            type="button"
            onClick={() => {
              refetchUsage();
              refetchClient();
            }}
            disabled={isFetching || isFetchingClient}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4 py-2
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
            "
          >
            <RefreshCw
              size={16}
              className={isFetching || isFetchingClient ? "animate-spin" : ""}
            />
            Refresh
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={() => navigate("/client/client-settings")}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4 py-2
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
            "
          >
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Client"
          value={clientDetails?.businessName || "Not configured"}
          icon={Building2}
          description={clientDetails?.status || "inactive"}
        />

        <StatCard
          title="Products"
          value="Manage"
          icon={Package}
          description="Product catalogue"
          onClick={() => navigate("/client/products")}
        />

        <StatCard
          title="FAQs"
          value="Manage"
          icon={HelpCircle}
          description="Frequently asked questions"
          onClick={() => navigate("/client/faqs")}
        />

        <StatCard
          title="Chatbot"
          value={chatbot?.name || "AI Assistant"}
          icon={Bot}
          description={chatbot?.language || "English"}
        />
      </div>

      {/* Main Content */}
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Client Overview */}
        <div className="xl:col-span-2">
          <ClientOverview />
        </div>

        {clientDetails?.active_plan && (
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
            <div className="grid grid-cols-1 gap-4 mt-5">
              <UsageCard
                title="Gemini Tokens"
                description="Total token consumption"
                icon={Zap}
                used={usage?.tokens?.used}
                limit={usage?.tokens?.limit}
                unit="tokens"
                color="blue"
              />

              <UsageCard
                title="Conversations"
                description="Conversations created"
                icon={MessageSquare}
                used={usage?.conversations?.used}
                limit={usage?.conversations?.limit}
                unit="conversations"
                color="violet"
              />

              <UsageCard
                title="AI Responses"
                description="Responses generated"
                icon={Bot}
                used={usage?.aiResponses?.used}
                limit={usage?.aiResponses?.limit}
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
                  {usage?.tokens?.limit > 0
                    ? (
                        (usage?.tokens?.used / usage?.tokens?.limit) *
                        100
                      ).toFixed(1)
                    : "0.0"}
                  % of your token quota,{" "}
                  {usage?.conversations?.limit > 0
                    ? (
                        (usage?.conversations?.used /
                          usage?.conversations?.limit) *
                        100
                      ).toFixed(0)
                    : "0"}
                  % of your conversation quota and{" "}
                  {usage?.aiResponses?.limit > 0
                    ? (
                        (usage?.aiResponses?.used / usage?.aiResponses?.limit) *
                        100
                      ).toFixed(0)
                    : "0"}
                  % of your AI response quota.
                </p>
              </div>
            </div>
            {client?.active_plan === "Pro" && (
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/client/analytics")}
                  className="
                    inline-flex items-center gap-1.5
                    text-sm font-medium
                    text-blue-600 transition
                    hover:text-blue-700
                    dark:text-blue-400
                    dark:hover:text-blue-300
                  "
                >
                  View More
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
        {!clientDetails?.active_plan && (
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
            <h2 className="text-base font-semibold">Quick Actions</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Manage your chatbot data quickly.
            </p>

            <div className="mt-5 space-y-3">
              <QuickAction
                title="Manage Products"
                description="Add or update products"
                icon={Package}
                onClick={() => navigate("/client/products")}
              />

              <QuickAction
                title="Manage FAQs"
                description="Add or update FAQs"
                icon={HelpCircle}
                onClick={() => navigate("/client/faqs")}
              />

              <QuickAction
                title="Manage Tickets"
                description="Resolve your tickets"
                icon={Ticket}
                onClick={() => navigate("/client/tickets")}
              />

              <QuickAction
                title="Chatbot Settings"
                description="Configure your AI chatbot"
                icon={Bot}
                onClick={() => navigate("/client/chatbot-settings")}
              />

              <QuickAction
                title="Client Settings"
                description="Update business information"
                icon={Building2}
                onClick={() => navigate("/client/client-settings")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Chatbot Information */}
      <div
        className="
            mt-6
            rounded-2xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
          "
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-blue-500" />

              <h2 className="text-base font-semibold">Chatbot Configuration</h2>
            </div>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Current chatbot configuration for your client.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/client/chatbot-settings")}
            className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-medium
                text-blue-600
                hover:text-blue-700
                dark:text-blue-400
                dark:hover:text-blue-300
              "
          >
            Edit
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <InfoItem label="Bot Name" value={chatbot?.name || "AI Assistant"} />
          <InfoItem label="Language" value={chatbot?.language || "English"} />
          <InfoItem label="Tone" value={chatbot?.tone || "Friendly"} />
          <InfoItem
            label="Status"
            value={clientDetails?.status || "inactive"}
          />
        </div>

        {chatbot?.welcomeMessage && (
          <div
            className="
                mt-4
                rounded-xl
                bg-gray-50
                p-4
                dark:bg-[#0f131b]
              "
          >
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Welcome Message
            </p>

            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
              {chatbot.welcomeMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAction({ title, description, icon: Icon, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ x: 3 }}
      onClick={onClick}
      className="
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-3
        text-left
        transition
        hover:border-blue-500
        hover:bg-blue-50
        dark:border-white/10
        dark:bg-[#0f131b]
        dark:hover:border-blue-500
        dark:hover:bg-blue-500/5
      "
    >
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
          text-blue-600
          dark:text-blue-400
        "
      >
        <Icon size={18} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>

      <ArrowRight size={15} className="shrink-0 text-gray-400" />
    </motion.button>
  );
}

function InfoItem({ label, value }) {
  return (
    <div
      className="
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        p-4
        dark:border-white/10
        dark:bg-[#0f131b]
      "
    >
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>

      <p className="mt-1 truncate text-sm font-medium">{value}</p>
    </div>
  );
}
