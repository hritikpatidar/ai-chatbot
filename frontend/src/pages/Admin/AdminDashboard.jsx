import React, { useMemo } from "react";
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
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import AdminStatCard from "../../components/AdminComponent/AdminStatCard";
import ActionButton from "../../components/common/ActionButton";
import { useNavigate } from "react-router-dom";
import useAdminDashboard from "../../hooks/Admin/useAdminDashboard";

/* =========================================================
   HELPERS
========================================================= */

const formatRelativeTime = (date) => {
  if (!date) {
    return "Never";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  const diff = Date.now() - parsedDate.getTime();

  if (diff < 0) {
    return "Just now";
  }

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (days === 1) {
    return "Yesterday";
  }

  if (days < 30) {
    return `${days} days ago`;
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getInitials = (name = "") => {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (!words.length) {
    return "CL";
  }

  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const formatNumber = (value) => {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-IN").format(number);
};

const getPercentage = (value, total) => {
  const numericValue = Number(value || 0);
  const numericTotal = Number(total || 0);

  if (!numericTotal) {
    return 0;
  }

  return Math.min(
    100,
    Math.max(0, Math.round((numericValue / numericTotal) * 100)),
  );
};

/* =========================================================
   NORMALIZE API DATA

   Backend response thoda different ho to yaha handle
   kar sakte ho.
========================================================= */

const normalizeDashboardData = (data) => {
  if (!data) {
    return {
      stats: {},
      activity: [],
      system: {},
      recentClients: [],
    };
  }

  const stats = data?.stats || data?.statistics || {};

  const recentClients =
    data?.recentClients || data?.clients?.recent || data?.recent?.clients || [];

  const activity =
    data?.clientActivity || data?.activity || data?.clientActivityData || [];

  const system = data?.systemOverview || data?.system || {};

  return {
    stats,
    activity,
    system,
    recentClients,
  };
};

/* =========================================================
   STATUS STYLES
========================================================= */

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

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { dashboard, isLoading, isFetching, error, refetch } =
    useAdminDashboard();
  /* =======================================================
     NORMALIZED DATA
  ======================================================= */

  const normalizedData = useMemo(
    () => normalizeDashboardData(dashboard),
    [dashboard],
  );

  const { stats, activity, system, recentClients } = normalizedData;

  /* =======================================================
     STATS
  ======================================================= */

  const totalClients =
    stats?.totalClients ??
    stats?.clients?.total ??
    dashboard?.totalClients ??
    0;

  const activeClients =
    stats?.activeClients ??
    stats?.clients?.active ??
    dashboard?.activeClients ??
    0;

  const inactiveClients =
    stats?.inactiveClients ??
    stats?.clients?.inactive ??
    dashboard?.inactiveClients ??
    0;

  const newClients =
    stats?.newClients ?? stats?.clients?.new ?? dashboard?.newClients ?? 0;

  /* =======================================================
     TRENDS
  ======================================================= */

  const totalClientsTrend =
    stats?.totalClientsTrend ?? stats?.trends?.totalClients ?? null;

  const activeClientsTrend =
    stats?.activeClientsTrend ?? stats?.trends?.activeClients ?? null;

  const newClientsTrend =
    stats?.newClientsTrend ?? stats?.trends?.newClients ?? null;

  /* =======================================================
     SYSTEM OVERVIEW
  ======================================================= */

  const chatbotOnline =
    system?.chatbotsOnline ??
    system?.onlineChatbots ??
    stats?.chatbotsOnline ??
    0;

  const totalChatbots =
    system?.totalChatbots ?? stats?.totalChatbots ?? totalClients;

  const activeSubscriptions =
    system?.activeSubscriptions ?? stats?.activeSubscriptions ?? 0;

  const totalSubscriptions =
    system?.totalSubscriptions ?? stats?.totalSubscriptions ?? totalClients;

  const activeClientPercentage = getPercentage(activeClients, totalClients);

  const chatbotPercentage =
    system?.chatbotsOnlinePercentage ??
    system?.chatbotPercentage ??
    getPercentage(chatbotOnline, totalChatbots);

  const subscriptionPercentage =
    system?.subscriptionsActivePercentage ??
    system?.subscriptionPercentage ??
    getPercentage(activeSubscriptions, totalSubscriptions);

  /* =======================================================
     ACTIVITY CHART

     Expected:
     [
       { month: "Jan", value: 45 },
       { month: "Feb", value: 65 }
     ]

     Or:
     [
       { label: "Jan", count: 45 }
     ]
  ======================================================= */

  const chartData = useMemo(() => {
    if (!Array.isArray(activity)) {
      return [];
    }

    return activity.map((item, index) => ({
      label:
        item?.month ||
        item?.label ||
        item?.name ||
        item?.date ||
        `Item ${index + 1}`,

      value: Number(
        item?.value ?? item?.count ?? item?.clients ?? item?.total ?? 0,
      ),
    }));
  }, [activity]);

  const maxChartValue =
    chartData.length > 0
      ? Math.max(...chartData.map((item) => item.value), 1)
      : 1;

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh = () => {
    refetch();
  };

  /* =======================================================
     VIEW CLIENT
  ======================================================= */

  const handleViewClient = (client) => {
    const clientId = client?._id || client?.id || client?.clientId;

    if (!clientId) {
      return;
    }

    navigate(`/admin/clients/${clientId}`);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

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

        <div className="flex items-center gap-2">
          {/* Refresh */}

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isFetching}
            className="
              inline-flex
              h-10
              items-center
              gap-2
              rounded-lg
              border
              border-gray-200
              bg-white
              px-3
              text-xs
              font-medium
              text-gray-600
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-white/10
              dark:bg-[#171b23]
              dark:text-gray-300
              dark:hover:bg-white/5
              sm:text-sm
            "
          >
            <RefreshCw size={15} className={isFetching ? "animate-spin" : ""} />

            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* View Clients */}

          <button
            type="button"
            onClick={() => navigate("/admin/clients")}
            className="
              inline-flex
              h-10
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-3.5
              text-xs
              font-medium
              text-white
              transition
              hover:bg-blue-700
              sm:text-sm
            "
          >
            <Users size={16} />

            <span>View All Clients</span>
          </button>
        </div>
      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            dark:border-red-500/20
            dark:bg-red-500/10
          "
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              size={18}
              className="
                mt-0.5
                shrink-0
                text-red-500
                dark:text-red-400
              "
            />

            <div>
              <p
                className="
                  text-sm
                  font-medium
                  text-red-700
                  dark:text-red-400
                "
              >
                Failed to load dashboard
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-red-600
                  dark:text-red-400
                "
              >
                {error?.message ||
                  "Something went wrong while loading dashboard data."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="
              shrink-0
              rounded-lg
              bg-red-600
              px-3
              py-1.5
              text-xs
              font-medium
              text-white
              hover:bg-red-700
            "
          >
            Retry
          </button>
        </div>
      )}

      {/* =====================================================
          STATS
      ===================================================== */}

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
          value={formatNumber(totalClients)}
          description="Registered clients"
          icon={Users}
          iconClass="
            bg-blue-500/10
            text-blue-600
            dark:text-blue-400
          "
          trend={totalClientsTrend}
        />

        <AdminStatCard
          title="Active Clients"
          value={formatNumber(activeClients)}
          description="Currently active"
          icon={UserCheck}
          iconClass="
            bg-green-500/10
            text-green-600
            dark:text-green-400
          "
          trend={activeClientsTrend}
        />

        <AdminStatCard
          title="Inactive Clients"
          value={formatNumber(inactiveClients)}
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
          value={formatNumber(newClients)}
          description="Added this month"
          icon={UserPlus}
          iconClass="
            bg-purple-500/10
            text-purple-600
            dark:text-purple-400
          "
          trend={newClientsTrend}
        />
      </div>

      {/* =====================================================
          MIDDLE SECTION
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-3
        "
      >
        {/* ===================================================
            CLIENT ACTIVITY
        =================================================== */}

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
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-50
                    text-blue-600
                    dark:bg-blue-500/10
                    dark:text-blue-400
                  "
                >
                  <Activity size={16} />
                </div>

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
              </div>

              <p
                className="
                  mt-2
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
              onClick={handleRefresh}
              disabled={isFetching}
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-gray-200
                text-gray-400
                transition
                hover:bg-gray-50
                hover:text-gray-600
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-white/10
                dark:hover:bg-white/5
                dark:hover:text-gray-300
              "
              title="Refresh activity"
            >
              <RefreshCw
                size={15}
                className={isFetching ? "animate-spin" : ""}
              />
            </button>
          </div>

          {chartData.length === 0 ? (
            <EmptyChart />
          ) : (
            <div className="mt-6">
              {/* Chart Area */}
              <div className="relative">
                {/* Horizontal Grid Lines */}
                <div
                  className="
                    pointer-events-none
                    absolute
                    inset-0
                    flex
                    flex-col
                    justify-between
                    pb-8
                  "
                >
                  {[0, 1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="
                        border-t
                        border-dashed
                        border-gray-100
                        dark:border-white/5
                      "
                    />
                  ))}
                </div>

                {/* Bars */}
                <div
                  className="
                    relative
                    flex
                    h-55
                    items-end
                    gap-2
                    sm:gap-4
                  "
                >
                  {chartData.map((item, index) => {
                    const height = Math.max(
                      (item.value / maxChartValue) * 175,
                      item.value > 0 ? 10 : 0,
                    );

                    return (
                      <div
                        key={`${item.label}-${index}`}
                        className="
                          group
                          flex
                          h-full
                          min-w-0
                          flex-1
                          flex-col
                          items-center
                          justify-end
                        "
                      >
                        {/* Value */}
                        {item.value > 0 && (
                          <span
                            className="
                              mb-2
                              text-[10px]
                              font-semibold
                              text-gray-500
                              opacity-0
                              transition-all
                              duration-200
                              group-hover:-translate-y-1
                              group-hover:opacity-100
                              dark:text-gray-400
                            "
                          >
                            {formatNumber(item.value)}
                          </span>
                        )}

                        {/* Bar Wrapper */}
                        <div
                          className="
                            relative
                            flex
                            w-full
                            justify-center
                          "
                        >
                          {/* Tooltip */}
                          <div
                            className="
                              pointer-events-none
                              absolute
                              bottom-full
                              left-1/2
                              z-20
                              mb-2
                              -translate-x-1/2
                              scale-95
                              whitespace-nowrap
                              rounded-lg
                              bg-gray-900
                              px-2.5
                              py-1.5
                              text-[10px]
                              font-medium
                              text-white
                              opacity-0
                              shadow-lg
                              transition-all
                              duration-200
                              group-hover:scale-100
                              group-hover:opacity-100
                              dark:bg-white
                              dark:text-gray-900
                            "
                          >
                            {formatNumber(item.value)} clients
                          </div>

                          {/* Bar */}
                          <div
                            className="
                              relative
                              w-full
                              max-w-10
                              overflow-hidden
                              rounded-t-lg
                              bg-blue-100
                              transition-all
                              duration-300
                              group-hover:bg-blue-200
                              dark:bg-blue-500/10
                              dark:group-hover:bg-blue-500/20
                            "
                            style={{
                              height: `${Math.max(height, 4)}px`,
                            }}
                          >
                            {/* Gradient Fill */}
                            <div
                              className="
                                absolute
                                inset-0
                                rounded-t-lg
                                bg-linear-to-t
                                from-blue-600
                                via-blue-500
                                to-cyan-400
                                opacity-90
                                transition-all
                                duration-300
                                group-hover:opacity-100
                              "
                            />

                            {/* Shine */}
                            <div
                              className="
                                absolute
                                inset-x-0
                                top-0
                                h-1
                                rounded-full
                                bg-white/40
                              "
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Labels */}
                <div
                  className="
                    mt-3
                    flex
                    gap-2
                    border-t
                    border-gray-100
                    pt-3
                    dark:border-white/5
                    sm:gap-4
                  "
                >
                  {chartData.map((item, index) => (
                    <div
                      key={`${item.label}-label-${index}`}
                      className="
                        min-w-0
                        flex-1
                        text-center
                      "
                    >
                      <span
                        className="
                          block
                          truncate
                          text-[9px]
                          font-medium
                          text-gray-400
                          dark:text-gray-500
                          sm:text-[10px]
                        "
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Summary */}
              {/* <div
        className="
          mt-5
          flex
          items-center
          justify-between
          rounded-xl
          border
          border-gray-100
          bg-gray-50/70
          px-4
          py-3
          dark:border-white/5
          dark:bg-white/[0.02]
        "
      >
        <div className="flex items-center gap-2">
          <span
            className="
              h-2
              w-2
              rounded-full
              bg-blue-500
              shadow-[0_0_8px_rgba(59,130,246,0.6)]
            "
          />

          <span
            className="
              text-[11px]
              font-medium
              text-gray-500
              dark:text-gray-400
            "
          >
            Activity
          </span>
        </div>

        <span
          className="
            text-xs
            font-semibold
            text-gray-700
            dark:text-gray-200
          "
        >
          {formatNumber(
            chartData.reduce(
              (total, item) => total + Number(item.value || 0),
              0,
            ),
          )}{" "}
          total
        </span>
      </div> */}
            </div>
          )}
        </div>

        {/* ===================================================
            SYSTEM OVERVIEW
        =================================================== */}

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
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
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
            <ProgressItem
              label="Active Clients"
              value={`${activeClientPercentage}%`}
              progress={activeClientPercentage}
            />

            <ProgressItem
              label="Chatbots Online"
              value={`${chatbotPercentage}%`}
              progress={chatbotPercentage}
            />

            <ProgressItem
              label="Subscriptions Active"
              value={`${subscriptionPercentage}%`}
              progress={subscriptionPercentage}
            />
          </div>

          {/* System Status */}

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
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  relative
                  flex
                  h-2.5
                  w-2.5
                "
              >
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

            <CheckCircle2
              size={15}
              className="
                text-green-500
              "
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          RECENT CLIENTS
      ===================================================== */}

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

        {/* Empty */}

        {recentClients.length === 0 ? (
          <div className="px-5 py-12">
            <div
              className="
                mx-auto
                flex
                max-w-sm
                flex-col
                items-center
                text-center
              "
            >
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-gray-100
                  text-gray-400
                  dark:bg-white/5
                  dark:text-gray-500
                "
              >
                <Users size={22} />
              </div>

              <p
                className="
                  mt-3
                  text-sm
                  font-medium
                  text-gray-900
                  dark:text-white
                "
              >
                No clients found
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                There are no recent clients to display.
              </p>
            </div>
          </div>
        ) : (
          /* Table */

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
                {recentClients.map((client, index) => {
                  const clientId =
                    client?._id || client?.id || client?.clientId || index;

                  const name =
                    client?.businessName ||
                    client?.name ||
                    client?.fullName ||
                    "Unknown Client";

                  const email =
                    client?.email ||
                    client?.contact?.email ||
                    client?.user?.email ||
                    "-";

                  const plan =
                    client?.plan?.name ||
                    client?.subscription?.planName ||
                    client?.plan ||
                    "-";

                  const status =
                    client?.status || client?.accountStatus || "inactive";

                  const chatbotStatus =
                    client?.chatbot?.status ||
                    client?.chatbotStatus ||
                    (client?.chatbot?.online ? "online" : "offline");

                  const lastLogin =
                    client?.lastLogin || client?.user?.lastLogin || null;

                  const initials = client?.initials || getInitials(name);

                  return (
                    <tr
                      key={clientId}
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
                      {/* Client */}

                      <td className="table-cell">
                        <div
                          className="
                              flex
                              items-center
                              gap-3
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
                                text-[11px]
                                font-semibold
                                text-blue-600
                                dark:text-blue-400
                              "
                          >
                            {initials}
                          </div>

                          <div className="min-w-0">
                            <p
                              className="
                                  truncate
                                  text-xs
                                  font-semibold
                                  text-gray-900
                                  dark:text-white
                                "
                            >
                              {name}
                            </p>

                            <p
                              className="
                                  mt-0.5
                                  truncate
                                  text-[10px]
                                  text-gray-500
                                  dark:text-gray-400
                                "
                            >
                              {email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}

                      <td className="table-cell">
                        <span
                          className="
                              text-xs
                              font-medium
                              text-gray-700
                              dark:text-gray-300
                            "
                        >
                          {plan}
                        </span>
                      </td>

                      {/* Status */}

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
                              ${statusStyles[status] || statusStyles.inactive}
                            `}
                        >
                          <span
                            className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  status === "active"
                                    ? "bg-green-500"
                                    : "bg-gray-400"
                                }
                              `}
                          />

                          {status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>

                      {/* Chatbot */}

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
                                  chatbotStatus === "online" ||
                                  chatbotStatus === "active"
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
                            {chatbotStatus === "online" ||
                            chatbotStatus === "active"
                              ? "Online"
                              : "Offline"}
                          </span>
                        </span>
                      </td>

                      {/* Last Login */}

                      <td className="table-cell">
                        <span
                          className="
                              text-xs
                              text-gray-500
                              dark:text-gray-400
                            "
                        >
                          {formatRelativeTime(lastLogin)}
                        </span>
                      </td>

                      {/* Action */}

                      <td className="table-cell text-right">
                        <div
                          className="
                              flex
                              items-center
                              justify-end
                            "
                        >
                          <ActionButton
                            icon={<Eye size={14} />}
                            title="View"
                            onClick={() => handleViewClient(client)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   PROGRESS ITEM
========================================================= */

function ProgressItem({ label, value, progress }) {
  return (
    <div>
      <div
        className="
          mb-2
          flex
          justify-between
          gap-3
        "
      >
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
            duration-500
          "
          style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
          }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY CHART
========================================================= */

function EmptyChart() {
  return (
    <div
      className="
        flex
        h-47.5
        flex-col
        items-center
        justify-center
        text-center
      "
    >
      <div
        className="
          flex
          h-11
          w-11
          items-center
          justify-center
          rounded-xl
          bg-gray-100
          text-gray-400
          dark:bg-white/5
          dark:text-gray-500
        "
      >
        <Activity size={20} />
      </div>

      <p
        className="
          mt-3
          text-xs
          font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        No activity data
      </p>

      <p
        className="
          mt-1
          text-[10px]
          text-gray-400
          dark:text-gray-500
        "
      >
        Client activity will appear here.
      </p>
    </div>
  );
}

/* =========================================================
   DASHBOARD SKELETON
========================================================= */

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}

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
        <div className="space-y-2">
          <div
            className="
              h-7
              w-32
              animate-pulse
              rounded-lg
              bg-gray-200
              dark:bg-white/10
            "
          />

          <div
            className="
              h-4
              w-56
              animate-pulse
              rounded
              bg-gray-100
              dark:bg-white/5
            "
          />
        </div>

        <div
          className="
            h-10
            w-36
            animate-pulse
            rounded-lg
            bg-gray-200
            dark:bg-white/10
          "
        />
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
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="
                h-32
                animate-pulse
                rounded-xl
                bg-gray-100
                dark:bg-white/5
              "
          />
        ))}
      </div>

      {/* Middle */}

      <div
        className="
          grid
          grid-cols-1
          gap-5
          xl:grid-cols-3
        "
      >
        <div
          className="
            h-80
            animate-pulse
            rounded-2xl
            bg-gray-100
            dark:bg-white/5
            xl:col-span-2
          "
        />

        <div
          className="
            h-80
            animate-pulse
            rounded-2xl
            bg-gray-100
            dark:bg-white/5
          "
        />
      </div>

      {/* Table */}

      <div
        className="
          h-80
          animate-pulse
          rounded-2xl
          bg-gray-100
          dark:bg-white/5
        "
      />
    </div>
  );
}
