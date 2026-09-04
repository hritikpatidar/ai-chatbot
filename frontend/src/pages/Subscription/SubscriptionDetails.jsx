import {
  CalendarDays,
  CreditCard,
  RefreshCw,
  CheckCircle2,
} from "lucide-react";

import { useCurrentSubscription } from "../../hooks/Subscription/useSubscription";

const SubscriptionDetails = () => {
  const { data, isLoading, refetch, isFetching } = useCurrentSubscription();

  const subscription = data?.data?.data || data?.data || null;

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center dark:border-gray-800 dark:bg-[#171b23]">
          <CreditCard className="mx-auto text-gray-400" size={40} />

          <h2 className="mt-4 text-lg font-semibold">No Active Subscription</h2>

          <p className="mt-1 text-sm text-gray-500">
            Choose a plan to get started.
          </p>
        </div>
      </div>
    );
  }

  const plan = subscription.planId || {};

  return (
    <div className="min-h-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Subscription
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your current subscription.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm dark:border-gray-700"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#171b23]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h2>

              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                {subscription.status}
              </span>
            </div>

            <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {subscription.currency?.toUpperCase()} {subscription.amount}
            </p>

            <p className="text-sm text-gray-500">/ {subscription.interval}</p>
          </div>
        </div>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDays size={17} />
              <span className="text-xs">Current Period Start</span>
            </div>

            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              {subscription.currentPeriodStart
                ? new Date(subscription.currentPeriodStart).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
            <div className="flex items-center gap-2 text-gray-500">
              <CalendarDays size={17} />
              <span className="text-xs">Current Period End</span>
            </div>

            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">
              {subscription.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "-"}
            </p>
          </div>
        </div>

        {plan.features?.length > 0 && (
          <div className="mt-7">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Included Features
            </h3>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {plan.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-2 text-sm text-gray-600 dark:text-gray-300"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-emerald-500"
                  />

                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionDetails;
