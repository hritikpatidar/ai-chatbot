import { AlertCircle, Loader2, RefreshCw, CreditCard } from "lucide-react";

import {
  useSubscriptionPlans,
  useCurrentSubscription,
} from "../../hooks/Subscription/useSubscription";

import PlanCard from "../../components/Subscription/PlanCard";

import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ChangePlanModal from "../../components/Subscription/ChangePlanModal";
import StripeProvider from "../../components/Subscription/StripeProvider";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  // monthly / yearly
  const [billingCycle, setBillingCycle] = useState("month");
  const [changePlanModal, setChangePlanModal] = useState({
    open: false,
    plan: null,
  });
  const { data, isLoading, isFetching, isError, refetch } =
    useSubscriptionPlans();
  const { data: currentData, refetch: currentSubscriptionRefetch } =
    useCurrentSubscription();
  const { client, loading } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const plans = data?.data?.data || data?.data || [];
  const currentSubscription = currentData?.data?.data || null;
  const currentPlanId =
    currentSubscription?.planId?._id ||
    currentSubscription?.planId ||
    client?.active_plan ||
    null;

  const currentPlan = useMemo(() => {
    if (!currentSubscription || !plans.length) {
      return null;
    }

    const currentId =
      currentSubscription?.planId?._id ||
      currentSubscription?.planId ||
      client?.active_plan;

    return (
      plans.find((plan) => plan._id === currentId) ||
      currentSubscription?.planId ||
      null
    );
  }, [currentSubscription, plans, client?.active_plan]);

  const filteredPlans = useMemo(() => {
    return plans.filter(
      (plan) => plan.interval?.toLowerCase() === billingCycle,
    );
  }, [plans, billingCycle]);

  const handleSelectPlan = (plan) => {
    if (!currentSubscription) {
      navigate(`/client/subscription/checkout/${plan._id}`);
      return;
    }
    if (plan._id === currentPlanId) {
      return;
    }
    setChangePlanModal({
      open: true,
      plan,
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
          <AlertCircle className="mx-auto text-red-500" size={32} />

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
    <div className="min-h-full ">
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
          Select the subscription plan that best fits your business needs.
        </p>
      </div>

      {/* BILLING TOGGLE + REFRESH */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* BILLING TOGGLE */}
        <div className="flex justify-center sm:justify-start">
          {/* <div
            className="
                inline-flex items-center
                rounded-xl
                border border-gray-200
                bg-gray-100
                p-1
                dark:border-white/10
                dark:bg-[#171b23]
              "
          >
            <button
              type="button"
              onClick={() => setBillingCycle("month")}
              className={`
                  rounded-lg px-5 py-2.5
                  text-sm font-semibold
                  transition-all duration-200
                  ${
                    billingCycle === "month"
                      ? `
                        bg-white
                        text-indigo-600
                        shadow-sm
                        dark:bg-[#252b36]
                        dark:text-indigo-400
                      `
                      : `
                        text-gray-500
                        hover:text-gray-900
                        dark:text-gray-400
                        dark:hover:text-white
                      `
                  }
                `}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("year")}
              className={`
                  rounded-lg px-5 py-2.5
                  text-sm font-semibold
                  transition-all duration-200
                  ${
                    billingCycle === "year"
                      ? `
                        bg-white
                        text-indigo-600
                        shadow-sm
                        dark:bg-[#252b36]
                        dark:text-indigo-400
                      `
                      : `
                        text-gray-500
                        hover:text-gray-900
                        dark:text-gray-400
                        dark:hover:text-white
                      `
                  }
                `}
            >
              Yearly
            </button>
          </div> */}
        </div>

        {/* REFRESH */}
        <div className="flex justify-center sm:justify-end">
          <button
            type="button"
            onClick={() => {
              refetch();
              currentSubscriptionRefetch();
            }}
            disabled={isFetching}
            className="
                flex items-center justify-center gap-2
                rounded-lg border border-gray-200
                px-3 py-2.5
                text-xs font-medium
                text-gray-600
                transition
                hover:bg-gray-50
                disabled:opacity-50
                dark:border-white/10
                dark:text-gray-300
                dark:hover:bg-white/5
              "
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* PLANS */}
      {filteredPlans.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-[#171b23]">
          <p className="text-gray-500 dark:text-gray-400">
            No {billingCycle === "month" ? "monthly" : "yearly"} subscription
            plans available.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.map((plan) => (
            <PlanCard
              key={plan._id}
              plan={plan}
              currentPlanId={currentPlanId}
              currentPlan={currentPlan}
              onSelect={handleSelectPlan}
            />
          ))}
        </div>
      )}
      <StripeProvider>
        <ChangePlanModal
          isOpen={changePlanModal.open}
          onClose={() =>
            setChangePlanModal({
              open: false,
              plan: null,
            })
          }
          currentPlan={currentPlan}
          selectedPlan={changePlanModal.plan}
          subscriptionId={currentSubscription?._id}
          onSuccess={() => {
            refetch();
          }}
        />
      </StripeProvider>
    </div>
  );
};

export default SubscriptionPlans;
