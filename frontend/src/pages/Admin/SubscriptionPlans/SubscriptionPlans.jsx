import { useState } from "react";

import {
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  useSubscriptionPlans,
  useCreateSubscriptionPlan,
  useUpdateSubscriptionPlan,
  useDeleteSubscriptionPlan,
} from "../../../hooks/Subscription/useSubscriptionPlans";

import SubscriptionPlanForm from "../../../components/AdminComponent/SubscriptionPlans/SubscriptionPlanForm";
import SubscriptionPlanStatus from "../../../components/AdminComponent/SubscriptionPlans/SubscriptionPlanStatus";
import ConfirmModal from "../../../components/ClientComponent/ConfirmModal";

const SubscriptionPlans = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [viewPlan, setViewPlan] = useState(null);
  const [deletePlan, setDeletePlan] = useState(null);
  const { data, isLoading, isFetching, isError, refetch } =
    useSubscriptionPlans();
  const { mutateAsync: createPlan, isPending: isCreating } =
    useCreateSubscriptionPlan();
  const { mutateAsync: updatePlan, isPending: isUpdating } =
    useUpdateSubscriptionPlan();
  const deleteMutation = useDeleteSubscriptionPlan();
  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const plans = data?.data?.data || [];

  const filteredPlans = plans?.filter((plan) => {
    const value =
      `${plan.name} ${plan.description || ""} ${plan.currency}`.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  const showFormError = (message) => {
    setFormError(message);
    setTimeout(() => {
      setFormError("");
    }, 3000);
  };

  const handleSubmit = async (payload) => {
    setFormError("");

    try {
      if (editingPlan) {
        await updatePlan({
          planId: editingPlan._id,
          payload,
        });
      } else {
        await createPlan(payload);
      }

      // ==========================================
      // ONLY SUCCESS
      // ==========================================

      setShowForm(false);
      setEditingPlan(null);

      showSuccessMessage(
        editingPlan
          ? "Subscription plan updated successfully."
          : "Subscription plan created successfully.",
      );
    } catch (error) {
      console.error("Subscription plan save error:", error);

      // ==========================================
      // ERROR
      // FORM OPEN RAHEGA
      // ==========================================

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      showFormError(message);
    }
  };

  const handleDelete = async () => {
    if (!deletePlan?._id) return;

    await deleteMutation.mutateAsync(deletePlan._id);

    setDeletePlan(null);
  };

  if (showForm) {
    return (
      <div className="min-h-full bg-gray-50 p-4 dark:bg-gray-950 sm:p-6">
        <div className="mx-auto max-w-6xl">
          <SubscriptionPlanForm
            initialData={editingPlan}
            loading={isCreating || isUpdating}
            apiError={formError}
            success={successMessage}
            onSubmit={handleSubmit}
            onCancel={() => {
              if (!isCreating && !isUpdating) {
                setShowForm(false);
                setEditingPlan(null);
                setFormError("");
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-50 p-4 dark:bg-gray-950 sm:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* HEADER */}
        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/40 dark:text-green-400">
            {successMessage}
          </div>
        )}

        {formError && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-400">
            {formError}
          </div>
        )}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Subscription Plans
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage pricing plans, Stripe configuration and features.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setShowForm(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus size={18} />
            Add Subscription Plan
          </button>
        </div>

        {/* SEARCH / TOOLBAR */}

        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscription plans..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* LOADING */}

        {isLoading && (
          <div className="flex min-h-75 items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <Loader2 size={30} className="animate-spin text-indigo-600" />
          </div>
        )}

        {/* ERROR */}

        {isError && !isLoading && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-500/20 dark:bg-red-500/10">
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load subscription plans.
            </p>

            <button
              onClick={() => refetch()}
              className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
            >
              Try Again
            </button>
          </div>
        )}

        {/* EMPTY */}

        {!isLoading && !isError && filteredPlans.length === 0 && (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              No subscription plans found
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create your first subscription plan.
            </p>

            <button
              type="button"
              onClick={() => {
                setEditingPlan(null);
                setShowForm(true);
              }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white"
            >
              <Plus size={16} />
              Add Plan
            </button>
          </div>
        )}

        {/* DESKTOP TABLE */}

        {!isLoading && !isError && filteredPlans.length > 0 && (
          <>
            <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900 lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-250">
                  <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
                    <tr>
                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Plan
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Price
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Stripe
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Features
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {filteredPlans.map((plan) => (
                      <tr
                        key={plan._id}
                        className="transition hover:bg-gray-50 dark:hover:bg-gray-800/40"
                      >
                        <td className="px-5 py-4">
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {plan.name}
                            </p>

                            <p className="mt-1 max-w-xs truncate text-xs text-gray-500 dark:text-gray-400">
                              {plan.description || "No description"}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {plan.currency?.toUpperCase()}{" "}
                            {(Number(plan.amount) / 100).toFixed(2)}
                          </p>

                          <p className="text-xs text-gray-500">
                            / {plan.interval}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-45 truncate text-xs text-gray-600 dark:text-gray-400">
                            {plan.stripePriceId}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                            {plan.features?.length || 0} features
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <SubscriptionPlanStatus status={plan.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <ActionButton
                              title="View"
                              onClick={() => setViewPlan(plan)}
                            >
                              <Eye size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Edit"
                              onClick={() => {
                                setEditingPlan(plan);
                                setShowForm(true);
                              }}
                            >
                              <Pencil size={16} />
                            </ActionButton>

                            <ActionButton
                              title="Delete"
                              danger
                              onClick={() => setDeletePlan(plan)}
                            >
                              <Trash2 size={16} />
                            </ActionButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE / TABLET CARDS */}

            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {filteredPlans.map((plan) => (
                <div
                  key={plan._id}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {plan.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {plan.description || "No description"}
                      </p>
                    </div>

                    <SubscriptionPlanStatus status={plan.status} />
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <Info
                      label="Price"
                      value={`${plan.currency?.toUpperCase()} ${(Number(plan.amount) / 100).toFixed(2)}`}
                    />

                    <Info label="Interval" value={plan.interval} />

                    <Info label="Features" value={plan.features?.length || 0} />

                    <Info label="Sort Order" value={plan.sortOrder} />
                  </div>

                  <div className="mt-5 flex gap-2 border-t border-gray-100 pt-4 dark:border-gray-800">
                    <button
                      onClick={() => setViewPlan(plan)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-medium dark:border-gray-700 dark:text-gray-300"
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setShowForm(true);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-medium text-white"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      onClick={() => setDeletePlan(plan)}
                      className="rounded-xl border border-red-200 px-3 text-red-600 dark:border-red-500/20 dark:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* VIEW MODAL */}

      {viewPlan && (
        <PlanDetailsModal plan={viewPlan} onClose={() => setViewPlan(null)} />
      )}

      {/* DELETE */}
      <ConfirmModal
        isOpen={Boolean(deletePlan)}
        title="Delete Subscription Plan"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>{deletePlan?.name}</strong>
            ?
            <br />
            <span className="text-xs">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={deleteMutation.isPending}
        onCancel={() => setDeletePlan(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const ActionButton = ({ children, title, onClick, danger = false }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`rounded-lg p-2 ${
      danger
        ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
    }`}
  >
    {children}
  </button>
);

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400">{label}</p>

    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
      {value}
    </p>
  </div>
);

const PlanDetailsModal = ({ plan, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {plan.name}
              </h2>

              <SubscriptionPlanStatus status={plan.status} />
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {plan.description || "No description"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-2 text-xl text-gray-500"
          >
            ×
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Info
            label="Amount"
            value={`${plan.currency?.toUpperCase()} ${(Number(plan.amount) / 100).toFixed(2)}`}
          />

          <Info label="Interval" value={plan.interval} />

          <Info label="Sort Order" value={plan.sortOrder} />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Features
          </h3>

          <div className="mt-3 space-y-2">
            {plan.features?.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700 dark:bg-gray-950 dark:text-gray-300"
              >
                <span className="h-2 w-2 rounded-full bg-indigo-500" />

                {feature}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gray-50 p-4 dark:bg-gray-950">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
            Stripe Information
          </h3>

          <div className="space-y-3">
            <Info label="Product ID" value={plan.stripeProductId} />

            <Info label="Price ID" value={plan.stripePriceId} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
