import {
  AlertCircle,
  Loader2,
  RefreshCw,
  CreditCard,
} from "lucide-react";

import {
  useSubscriptionPlans,
  useCurrentSubscription,
} from "../../hooks/Subscription/useSubscription";

import PlanCard from "../../components/Subscription/PlanCard";

import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSubscriptionPlans();

  const {
    data: currentData,
  } = useCurrentSubscription();

  const plans =
    data?.data?.data ||
    data?.data ||
    [];

  const currentSubscription =
    currentData?.data?.data ||
    currentData?.data ||
    null;

  const currentPlanId =
    currentSubscription?.planId?._id ||
    currentSubscription?.planId ||
    null;

  const handleSelectPlan = (plan) => {
    navigate(
      `/client/subscription/checkout/${plan._id}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <Loader2
          className="animate-spin text-indigo-600"
          size={32}
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle
            className="mx-auto text-red-500"
            size={32}
          />

          <h2 className="mt-3 font-semibold text-red-700 dark:text-red-400">
            Unable to load subscription plans
          </h2>

          <button
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 dark:bg-indigo-500/10">
            <CreditCard
              className="text-indigo-600 dark:text-indigo-400"
              size={24}
            />
          </div>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">
            Choose Your Plan
          </h1>

          <p className="mx-auto mt-2 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            Select the subscription plan that best fits
            your business needs.
          </p>
        </div>

        {/* REFRESH */}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="flex items-center justify-center gap-2
              rounded-lg border border-gray-200
              px-3 py-2.5 text-xs font-medium
              text-gray-600 transition
              hover:bg-gray-50
              disabled:opacity-50
              dark:border-white/10
              dark:text-gray-300
              dark:hover:bg-white/5"
          >
            <RefreshCw
              size={16}
              className={
                isFetching
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </div>

        {/* PLANS */}

        {plans.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-[#171b23]">
            <p className="text-gray-500 dark:text-gray-400">
              No subscription plans available.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                currentPlanId={currentPlanId}
                onSelect={handleSelectPlan}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionPlans;