import { useState } from "react";

import {
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Loader2,
  Check,
  CreditCard,
  CalendarDays,
  Layers3,
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

  const [successMessage, setSuccessMessage] = useState("");
  const [formError, setFormError] = useState("");

  const { data, isLoading, isFetching, isError, refetch } =
    useSubscriptionPlans();

  const { mutateAsync: createPlan, isPending: isCreating } =
    useCreateSubscriptionPlan();

  const { mutateAsync: updatePlan, isPending: isUpdating } =
    useUpdateSubscriptionPlan();

  const deleteMutation = useDeleteSubscriptionPlan();

  const plans = data?.data?.data || [];

  /* =========================================================
     SEARCH
  ========================================================= */

  const filteredPlans = plans.filter((plan) => {
    const value =
      `${plan.name} ${plan.description || ""} ${plan.currency}`.toLowerCase();

    return value.includes(search.toLowerCase());
  });

  /* =========================================================
     SUCCESS MESSAGE
  ========================================================= */

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  /* =========================================================
     ERROR MESSAGE
  ========================================================= */

  const showFormError = (message) => {
    setFormError(message);

    setTimeout(() => {
      setFormError("");
    }, 3000);
  };

  /* =========================================================
     CREATE / UPDATE
  ========================================================= */

  const handleSubmit = async (payload) => {
    setFormError("");

    try {
      let response;
      if (editingPlan) {
        response = await updatePlan({
          planId: editingPlan._id,
          payload,
        });
      } else {
        response = await createPlan(payload);
      }
      if (response.data.success) {
        setShowForm(false);
        setEditingPlan(null);

        showSuccessMessage(
          editingPlan
            ? "Subscription plan updated successfully."
            : "Subscription plan created successfully.",
        );
      } else {
        showFormError(
          response.data.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      console.error("Subscription plan save error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      showFormError(message);
    }
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = async () => {
    if (!deletePlan?._id) return;

    try {
      const response = await deleteMutation.mutateAsync(deletePlan._id);
      if (response?.data?.success) {
        setDeletePlan(null);
        showSuccessMessage("Subscription plan deleted successfully.");
      } else {
        showFormError(
          response.data.message || "Something went wrong. Please try again.",
        );
      }
    } catch (error) {
      showFormError(
        error?.response?.data?.message || "Failed to delete subscription plan.",
      );
    }
  };

  /* =========================================================
     FORM VIEW
  ========================================================= */

  if (showForm) {
    return (
      <div className="min-h-full">
        <div className="mx-auto max-w-7xl">
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

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div
      className="
        min-h-full
        bg-transparent
        text-gray-900
        dark:text-gray-100
      "
    >
      <div className="mx-auto max-w-7xl space-y-6">
        {/* =====================================================
            SUCCESS MESSAGE
        ===================================================== */}

        {successMessage && (
          <div
            className="
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              px-4
              py-3
              text-sm
              font-medium
              text-emerald-700

              dark:border-emerald-500/20
              dark:bg-emerald-500/8
              dark:text-emerald-400
            "
          >
            <span
              className="
                h-2
                w-2
                rounded-full
                bg-emerald-500
              "
            />

            {successMessage}
          </div>
        )}

        {/* =====================================================
            ERROR MESSAGE
        ===================================================== */}

        {formError && (
          <div
            className="
              rounded-xl
              border
              border-red-200
              bg-red-50
              px-4
              py-3
              text-sm
              font-medium
              text-red-700

              dark:border-red-500/20
              dark:bg-red-500/8
              dark:text-red-400
            "
          >
            {formError}
          </div>
        )}

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div
          className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  bg-indigo-50
                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <CreditCard size={17} />
              </div>

              <span
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wider
                  text-indigo-600
                  dark:text-indigo-400
                "
              >
                Billing
              </span>
            </div>

            <h1
              className="
                text-2xl
                font-bold
                tracking-tight
                text-gray-900
                dark:text-white
                sm:text-3xl
              "
            >
              Subscription Plans
            </h1>

            <p
              className="
                mt-1.5
                max-w-2xl
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Manage pricing, billing intervals and subscription features for
              your clients.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setFormError("");
              setShowForm(true);
            }}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-3
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition-all
              duration-200

              hover:bg-indigo-700
              hover:shadow-md

              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500/30
            "
          >
            <Plus size={18} />
            Add Subscription Plan
          </button>
        </div>

        {/* =====================================================
            TOOLBAR
        ===================================================== */}

        <div
          className="
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-3
            shadow-sm

            dark:border-white/8
            dark:bg-[#171b23]
            dark:shadow-none
          "
        >
          <div
            className="
              flex
              flex-col
              gap-3
              md:flex-row
              md:items-center
              md:justify-between
            "
          >
            {/* SEARCH */}

            <div className="relative w-full md:max-w-md">
              <Search
                size={17}
                className="
                  absolute
                  left-3.5
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                  dark:text-gray-500
                "
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscription plans..."
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  pl-10
                  pr-4
                  text-sm
                  text-gray-900
                  outline-none
                  transition-all

                  placeholder:text-gray-400

                  focus:border-indigo-500
                  focus:bg-white
                  focus:ring-2
                  focus:ring-indigo-500/10

                  dark:border-white/8
                  dark:bg-[#11151c]
                  dark:text-gray-100
                  dark:placeholder:text-gray-500

                  dark:focus:border-indigo-500
                  dark:focus:bg-[#151a22]
                "
              />
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="
                inline-flex
                h-11
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
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
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </div>

        {/* =====================================================
            STATS
        ===================================================== */}

        {!isLoading && !isError && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard icon={Layers3} label="Total Plans" value={plans.length} />

            <StatCard
              icon={Check}
              label="Active Plans"
              value={plans.filter((plan) => plan.status === "active").length}
            />

            <StatCard
              icon={CreditCard}
              label="Currencies"
              value={
                new Set(plans.map((plan) => plan.currency?.toUpperCase())).size
              }
              className="
                col-span-2
                sm:col-span-1
              "
            />
          </div>
        )}

        {/* =====================================================
            LOADING
        ===================================================== */}

        {isLoading && (
          <div
            className="
              flex
              min-h-80
              items-center
              justify-center
              rounded-2xl
              border
              border-gray-200
              bg-white

              dark:border-white/8
              dark:bg-[#171b23]
            "
          >
            <div
              className="
                flex
                flex-col
                items-center
                gap-3
              "
            >
              <Loader2
                size={30}
                className="
                  animate-spin
                  text-indigo-600
                  dark:text-indigo-400
                "
              />

              <p
                className="
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Loading subscription plans...
              </p>
            </div>
          </div>
        )}

        {/* =====================================================
            ERROR
        ===================================================== */}

        {isError && !isLoading && (
          <div
            className="
              rounded-2xl
              border
              border-red-200
              bg-red-50
              p-8
              text-center

              dark:border-red-500/20
              dark:bg-red-500/8
            "
          >
            <p
              className="
                text-sm
                font-medium
                text-red-600
                dark:text-red-400
              "
            >
              Failed to load subscription plans.
            </p>

            <button
              type="button"
              onClick={() => refetch()}
              className="
                mt-4
                rounded-xl
                bg-red-600
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-red-700
              "
            >
              Try Again
            </button>
          </div>
        )}

        {/* =====================================================
            EMPTY
        ===================================================== */}

        {!isLoading && !isError && filteredPlans.length === 0 && (
          <div
            className="
                rounded-2xl
                border
                border-dashed
                border-gray-300
                bg-white
                px-6
                py-16
                text-center

                dark:border-white/10
                dark:bg-[#171b23]
              "
          >
            <div
              className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
            >
              <CreditCard size={22} />
            </div>

            <h3
              className="
                  mt-4
                  text-lg
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
            >
              No subscription plans found
            </h3>

            <p
              className="
                  mx-auto
                  mt-1
                  max-w-md
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
            >
              Create a subscription plan to start managing your billing options.
            </p>

            <button
              type="button"
              onClick={() => {
                setEditingPlan(null);
                setFormError("");
                setShowForm(true);
              }}
              className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-indigo-600
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-indigo-700
                "
            >
              <Plus size={16} />
              Add Plan
            </button>
          </div>
        )}

        {/* =====================================================
            PLAN CARDS
        ===================================================== */}

        {!isLoading && !isError && filteredPlans.length > 0 && (
          <div
            className="
                grid
                grid-cols-1
                items-stretch
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
              "
          >
            {filteredPlans.map((plan) => (
              <PlanCard
                key={plan._id}
                plan={plan}
                onView={() => setViewPlan(plan)}
                onEdit={() => {
                  setEditingPlan(plan);
                  setFormError("");
                  setShowForm(true);
                }}
                onDelete={() => setDeletePlan(plan)}
              />
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {viewPlan && (
        <PlanDetailsModal plan={viewPlan} onClose={() => setViewPlan(null)} />
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <ConfirmModal
        isOpen={Boolean(deletePlan)}
        title="Delete Subscription Plan"
        message={
          <>
            Are you sure you want to delete <strong>{deletePlan?.name}</strong>?
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
   PLAN CARD
========================================================= */

const PlanCard = ({ plan, onView, onEdit, onDelete }) => {
  const features = plan.features || [];

  return (
    <div
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-300

        hover:-translate-y-0.5
        hover:border-indigo-200
        hover:shadow-lg
        hover:shadow-indigo-500/5

        dark:border-white/8
        dark:bg-[#171b23]
        dark:shadow-none

        dark:hover:border-indigo-500/25
        dark:hover:bg-[#191e27]
      "
    >
      {/* TOP ACCENT */}

      <div
        className="
          absolute
          inset-x-0
          top-0
          h-px
          bg-linear-to-r
          from-transparent
          via-indigo-500
          to-transparent
          opacity-60
        "
      />

      {/* =====================================================
          CARD CONTENT
      ===================================================== */}

      <div className="flex h-full flex-col p-5">
        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <CreditCard size={17} />
              </div>

              <h3
                className="
                  truncate
                  text-base
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                {plan.name}
              </h3>
            </div>

            <p
              className="
                mt-3
                line-clamp-2
                min-h-10
                text-sm
                leading-5
                text-gray-500
                dark:text-gray-400
              "
            >
              {plan.description || "No description available."}
            </p>
          </div>

          <SubscriptionPlanStatus status={plan.status} />
        </div>

        {/* ===================================================
            PRICE
        =================================================== */}

        <div
          className="
            mt-6
            rounded-xl
            border
            border-gray-100
            bg-gray-50
            p-4

            dark:border-white/6
            dark:bg-[#11151c]
          "
        >
          <div
            className="
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-medium
                  text-gray-400
                  dark:text-gray-500
                "
              >
                Subscription price
              </p>

              <div
                className="
                  mt-1
                  flex
                  items-baseline
                  gap-1
                "
              >
                <span
                  className="
                    text-2xl
                    font-bold
                    tracking-tight
                    text-gray-900
                    dark:text-white
                  "
                >
                  {plan.currency?.toUpperCase()}{" "}
                  {(Number(plan.amount) / 100).toFixed(2)}
                </span>

                <span
                  className="
                    text-xs
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  / {plan.interval}
                </span>
              </div>
            </div>

            <div
              className="
                rounded-lg
                border
                border-gray-200
                bg-white
                px-2.5
                py-1.5
                text-xs
                font-medium
                text-gray-600

                dark:border-white/8
                dark:bg-white/4
                dark:text-gray-400
              "
            >
              #{plan.sortOrder}
            </div>
          </div>
        </div>

        {/* ===================================================
            FEATURES
            Fixed/minimum height keeps buttons aligned
        =================================================== */}

        <div className="mt-5">
          <div
            className="
              mb-3
              flex
              items-center
              justify-between
            "
          >
            <span
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wider
                text-gray-400
                dark:text-gray-500
              "
            >
              Features
            </span>

            <span
              className="
                rounded-full
                bg-indigo-50
                px-2.5
                py-1
                text-[11px]
                font-semibold
                text-indigo-600

                dark:bg-indigo-500/10
                dark:text-indigo-400
              "
            >
              {features.length} {features.length === 1 ? "feature" : "features"}
            </span>
          </div>

          {/* FIXED FEATURE AREA */}

          <div className="min-h-31">
            <div className="space-y-2">
              {features.length > 0 ? (
                <>
                  {features.slice(0, 4).map((feature, index) => (
                    <div
                      key={index}
                      className="
                          flex
                          items-start
                          gap-2.5
                        "
                    >
                      <span
                        className="
                            mt-1
                            flex
                            h-4
                            w-4
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-indigo-50
                            text-indigo-600

                            dark:bg-indigo-500/10
                            dark:text-indigo-400
                          "
                      >
                        <Check size={10} strokeWidth={3} />
                      </span>

                      <span
                        className="
                            line-clamp-1
                            text-sm
                            text-gray-600
                            dark:text-gray-400
                          "
                        title={feature}
                      >
                        {feature}
                      </span>
                    </div>
                  ))}

                  {features.length > 4 && (
                    <p
                      className="
                        pl-6
                        text-xs
                        font-medium
                        text-indigo-600
                        dark:text-indigo-400
                      "
                    >
                      +{features.length - 4} more
                    </p>
                  )}
                </>
              ) : (
                <p
                  className="
                    text-sm
                    text-gray-400
                    dark:text-gray-500
                  "
                >
                  No features configured.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ===================================================
            STRIPE
        =================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            border-t
            border-gray-100
            pt-4

            dark:border-white/6
          "
        >
          <CreditCard
            size={14}
            className="
              shrink-0
              text-gray-400
              dark:text-gray-500
            "
          />

          <span
            className="
              truncate
              text-xs
              text-gray-400
              dark:text-gray-500
            "
            title={plan.stripePriceId}
          >
            {plan.stripePriceId || "Stripe price not configured"}
          </span>
        </div>

        {/* ===================================================
            ACTIONS

            mt-auto = always push buttons to bottom
        =================================================== */}

        <div
          className="
            mt-auto
            grid
            grid-cols-[1fr_1fr_auto]
            gap-2
            pt-5
          "
        >
          <CardAction icon={Eye} label="View" onClick={onView} />

          <CardAction icon={Pencil} label="Edit" primary onClick={onEdit} />

          <button
            type="button"
            onClick={onDelete}
            title="Delete"
            className="
              inline-flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              border
              border-red-200
              text-red-500
              transition-all

              hover:bg-red-50
              hover:text-red-600

              focus:outline-none
              focus:ring-2
              focus:ring-red-500/20

              dark:border-red-500/20
              dark:text-red-400

              dark:hover:bg-red-500/10
              dark:hover:text-red-300
            "
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   CARD ACTION
========================================================= */

const CardAction = ({ icon: Icon, label, primary = false, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        inline-flex
        h-10
        items-center
        justify-center
        gap-2
        rounded-xl
        px-3
        text-sm
        font-semibold
        transition-all

        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500/20

        ${
          primary
            ? `
              bg-indigo-600
              text-white

              hover:bg-indigo-700
            `
            : `
              border
              border-gray-200
              bg-white
              text-gray-700

              hover:bg-gray-50

              dark:border-white/8
              dark:bg-[#171b23]
              dark:text-gray-300

              dark:hover:bg-white/4
            `
        }
      `}
    >
      <Icon size={15} />

      {label}
    </button>
  );
};

/* =========================================================
   STAT CARD
========================================================= */

const StatCard = ({ icon: Icon, label, value, className = "" }) => {
  return (
    <div
      className={`
        rounded-2xl
        border
        border-gray-200
        bg-white
        p-4
        shadow-sm

        dark:border-white/8
        dark:bg-[#171b23]
        dark:shadow-none

        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-xl
            bg-indigo-50
            text-indigo-600

            dark:bg-indigo-500/10
            dark:text-indigo-400
          "
        >
          <Icon size={17} />
        </div>

        <div>
          <p
            className="
              text-xs
              font-medium
              text-gray-400
              dark:text-gray-500
            "
          >
            {label}
          </p>

          <p
            className="
              mt-0.5
              text-lg
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   PLAN DETAILS MODAL
========================================================= */

const PlanDetailsModal = ({ plan, onClose }) => {
  return (
    <div
      className="
        fixed
        inset-0
        z-40
        flex
        items-center
        justify-center
        bg-black/50
        px-4
        py-6
        backdrop-blur-sm
      "
    >
      <div
        className="
          max-h-[90vh]
          w-full
          max-w-2xl
          overflow-y-auto
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-2xl

          dark:border-white/8
          dark:bg-[#171b23]
        "
      >
        {/* =================================================
            MODAL HEADER
        ================================================= */}

        <div
          className="
            sticky
            top-0
            z-10
            flex
            items-start
            justify-between
            gap-4
            border-b
            border-gray-100
            bg-white
            px-6
            py-5

            dark:border-white/6
            dark:bg-[#171b23]
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-indigo-50
                  text-indigo-600

                  dark:bg-indigo-500/10
                  dark:text-indigo-400
                "
              >
                <CreditCard size={18} />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2
                    className="
                      truncate
                      text-lg
                      font-bold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    {plan.name}
                  </h2>

                  <SubscriptionPlanStatus status={plan.status} />
                </div>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  {plan.description || "No description"}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-lg
              text-xl
              text-gray-400
              transition

              hover:bg-gray-100
              hover:text-gray-700

              dark:hover:bg-white/5
              dark:hover:text-white
            "
          >
            ×
          </button>
        </div>

        {/* =================================================
            MODAL CONTENT
        ================================================= */}

        <div className="space-y-6 p-6">
          {/* PRICE */}

          <div
            className="
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              p-5

              dark:border-white/6
              dark:bg-[#11151c]
            "
          >
            <p
              className="
                text-xs
                font-medium
                uppercase
                tracking-wider
                text-gray-400
                dark:text-gray-500
              "
            >
              Subscription Price
            </p>

            <div
              className="
                mt-2
                flex
                items-baseline
                gap-2
              "
            >
              <span
                className="
                  text-3xl
                  font-bold
                  text-gray-900
                  dark:text-white
                "
              >
                {plan.currency?.toUpperCase()}{" "}
                {(Number(plan.amount) / 100).toFixed(2)}
              </span>

              <span
                className="
                  text-sm
                  text-gray-400
                  dark:text-gray-500
                "
              >
                / {plan.interval}
              </span>
            </div>
          </div>

          {/* INFORMATION */}

          <div
            className="
              grid
              grid-cols-2
              gap-4
              sm:grid-cols-3
            "
          >
            <Info icon={CalendarDays} label="Interval" value={plan.interval} />

            <Info icon={Layers3} label="Sort Order" value={plan.sortOrder} />

            <Info
              icon={CreditCard}
              label="Currency"
              value={plan.currency?.toUpperCase()}
            />
          </div>

          {/* FEATURES */}

          <div>
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Plan Features
              </h3>

              <span
                className="
                  text-xs
                  text-gray-400
                  dark:text-gray-500
                "
              >
                {plan.features?.length || 0} total
              </span>
            </div>

            <div className="mt-3 space-y-2">
              {plan.features?.length > 0 ? (
                plan.features.map((feature, index) => (
                  <div
                    key={index}
                    className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-gray-100
                        bg-gray-50
                        px-4
                        py-3
                        text-sm
                        text-gray-700

                        dark:border-white/6
                        dark:bg-[#11151c]
                        dark:text-gray-300
                      "
                  >
                    <span
                      className="
                          flex
                          h-5
                          w-5
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-indigo-50
                          text-indigo-600

                          dark:bg-indigo-500/10
                          dark:text-indigo-400
                        "
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>

                    {feature}
                  </div>
                ))
              ) : (
                <p
                  className="
                    rounded-xl
                    border
                    border-dashed
                    border-gray-200
                    p-4
                    text-sm
                    text-gray-400

                    dark:border-white/8
                    dark:text-gray-500
                  "
                >
                  No features configured.
                </p>
              )}
            </div>
          </div>

          {/* STRIPE */}

          <div
            className="
              rounded-xl
              border
              border-gray-200
              p-4

              dark:border-white/8
            "
          >
            <div className="flex items-center gap-2">
              <CreditCard
                size={16}
                className="
                  text-indigo-600
                  dark:text-indigo-400
                "
              />

              <h3
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Stripe Configuration
              </h3>
            </div>

            <div className="mt-4 space-y-3">
              <Info label="Product ID" value={plan.stripeProductId} />

              <Info label="Price ID" value={plan.stripePriceId} />
            </div>
          </div>

          {/* CLOSE */}

          <button
            type="button"
            onClick={onClose}
            className="
              w-full
              rounded-xl
              border
              border-gray-200
              bg-white
              py-2.5
              text-sm
              font-semibold
              text-gray-700
              transition

              hover:bg-gray-50

              dark:border-white/8
              dark:bg-[#171b23]
              dark:text-gray-300

              dark:hover:bg-white/4
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   INFO
========================================================= */

const Info = ({ icon: Icon, label, value }) => {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        {Icon && (
          <Icon
            size={13}
            className="
              text-gray-400
              dark:text-gray-500
            "
          />
        )}

        <p
          className="
            text-xs
            font-medium
            text-gray-400
            dark:text-gray-500
          "
        >
          {label}
        </p>
      </div>

      <p
        className="
          mt-1
          truncate
          text-sm
          font-semibold
          text-gray-800
          dark:text-gray-200
        "
        title={value}
      >
        {value || "-"}
      </p>
    </div>
  );
};

export default SubscriptionPlans;
