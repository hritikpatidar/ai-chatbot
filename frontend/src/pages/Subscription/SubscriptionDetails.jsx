import {
  CalendarDays,
  CreditCard,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { useCurrentSubscription } from "../../hooks/Subscription/useSubscription";
import ConfirmModal from "../../components/ClientComponent/ConfirmModal";
import { cancleSubscriptionApi } from "../../service/Subscription/subscriptionServices";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const SubscriptionDetails = () => {
  const navigate= useNavigate()
  const { data, isLoading, refetch, isFetching } = useCurrentSubscription();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);

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

  // Open confirmation modal
  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    try {
      setIsCanceling(true);

      const subscriptionId = subscription?._id;

      if (!subscriptionId) {
        console.error("Subscription ID not found");
        return;
      }
      const response = await cancleSubscriptionApi(subscriptionId);
      if (response?.data?.success === false) {
        toast.error(response.data.message);
        setShowCancelModal(false);
        await refetch();
      }
      if (response?.data?.success) {
        toast.success(response.data.message);
        setShowCancelModal(false);
        await refetch();
        navigate("/client/subscription")
      }
    } catch (error) {
      console.error("Cancel subscription error:", error);
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Subscription
          </h1>

          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your current subscription.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Refresh */}
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching || isCanceling}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-gray-200
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-gray-700
              transition
              hover:bg-gray-50
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-gray-700
              dark:bg-[#171b23]
              dark:text-gray-200
              dark:hover:bg-gray-800
            "
          >
            <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
            Refresh
          </button>

          {/* Cancel Subscription */}
          {/* {subscription.status !== "canceled" && (
            <button
              type="button"
              onClick={handleCancelClick}
              disabled={isCanceling || isFetching}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-4
                py-2
                text-sm
                font-semibold
                text-red-600
                transition
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
                dark:hover:bg-red-500/20
              "
            >
              <XCircle size={16} />
              Cancel Subscription
            </button>
          )} */}
        </div>
      </div>

      {/* Subscription Card */}
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

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {plan.description}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {subscription.currency?.toUpperCase()} {subscription.amount}
            </p>

            <p className="text-sm text-gray-500">/ {subscription.interval}</p>
          </div>
        </div>

        <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

        {/* Period */}
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

        {/* Features */}
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

      {/* Cancel Confirmation Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onCancel={() => {
          if (!isCanceling) {
            setShowCancelModal(false);
          }
        }}
        onConfirm={handleConfirmCancel}
        title="Cancel Subscription"
        message={`Are you sure you want to cancel your ${plan.name} subscription?`}
        confirmText="Yes, Cancel"
        cancelText="Keep Subscription"
        loading={isCanceling}
        danger={true}
      />
    </div>
  );
};

export default SubscriptionDetails;
