import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Loader2,
} from "lucide-react";

import {
  useSubscriptionPlan,
} from "../../../hooks/useSubscriptionPlans";

import SubscriptionPlanStatus from "../../../components/Admin/SubscriptionPlans/SubscriptionPlanStatus";

const SubscriptionPlanDetails = () => {
  const { planId } = useParams();

  const navigate = useNavigate();

  const {
    data,
    isLoading,
    isError,
  } = useSubscriptionPlan(planId);

  const plan = data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2
          size={30}
          className="animate-spin text-indigo-600"
        />
      </div>
    );
  }

  if (isError || !plan) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          Subscription plan not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-gray-950 sm:p-6">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() =>
            navigate(
              "/admin/subscription-plans",
            )
          }
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Subscription Plans
        </button>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h1>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {plan.description}
              </p>
            </div>

            <SubscriptionPlanStatus
              status={plan.status}
            />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
            <Detail
              label="Price"
              value={`${plan.currency?.toUpperCase()} ${(Number(plan.amount) / 100).toFixed(2)}`}
            />

            <Detail
              label="Interval"
              value={plan.interval}
            />

            <Detail
              label="Features"
              value={
                plan.features?.length || 0
              }
            />

            <Detail
              label="Sort Order"
              value={plan.sortOrder}
            />
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Features
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {plan.features?.map(
                (feature, index) => (
                  <div
                    key={index}
                    className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 dark:bg-gray-950 dark:text-gray-300"
                  >
                    ✓ {feature}
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Stripe Configuration
            </h2>

            <div className="mt-4 space-y-4">
              <Detail
                label="Stripe Product ID"
                value={
                  plan.stripeProductId
                }
              />

              <Detail
                label="Stripe Price ID"
                value={
                  plan.stripePriceId
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({
  label,
  value,
}) => (
  <div>
    <p className="text-xs text-gray-400">
      {label}
    </p>

    <p className="mt-1 break-all text-sm font-semibold text-gray-800 dark:text-gray-200">
      {value}
    </p>
  </div>
);

export default SubscriptionPlanDetails;