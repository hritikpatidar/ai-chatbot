import { Check, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PlanCard = ({ plan, currentPlanId, currentPlan, onSelect }) => {
  const navigate = useNavigate();
  const isCurrent = currentPlanId === plan.name || currentPlanId === plan._id;
  const isUpgrade =
    currentPlan && Number(plan.sortOrder) > Number(currentPlan.sortOrder);

  const actionText = !currentPlan
    ? "Choose Plan"
    : isCurrent
      ? "Current Plan"
      : isUpgrade
        ? "Upgrade"
        : "Downgrade";
  return (
    <div
      className={`
        relative
        flex
        h-full
        flex-col
        rounded-2xl
        border
        bg-white
        p-6
        shadow-sm
        transition
        hover:-translate-y-1
        hover:shadow-xl
        courser-pointer

        dark:border-gray-800
        dark:bg-[#171b23]
      `}
    >
      {isCurrent && (
        <div className="absolute right-5 top-5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          Current Plan
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {plan.name}
        </h2>

        <p className="mt-2 min-h-10 text-sm text-gray-500 dark:text-gray-400">
          {plan.description}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {plan.currency?.toUpperCase()} {plan.amount}
            {/* {plan.currency?.toUpperCase()}{" "}
                  {(Number(plan.amount) / 100).toFixed(2)} */}
          </span>

          <span className="mb-1 text-sm text-gray-500">/ {plan.interval}</span>
        </div>
      </div>

      <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

      <div className="flex-1 space-y-3">
        {plan.features?.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Check size={18} className="mt-0.5 shrink-0 text-indigo-600" />

            <span className="text-sm text-gray-600 dark:text-gray-300">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        {/* Main Action Button */}
        <button
          type="button"
          disabled={isCurrent}
          onClick={() => onSelect(plan)}
          className="
            flex flex-1
            items-center justify-center gap-2
            rounded-xl
            bg-indigo-600
            px-4 py-3
            text-sm font-semibold text-white
            transition
            hover:bg-indigo-700
            disabled:cursor-not-allowed
            disabled:bg-gray-300
            dark:disabled:bg-gray-700
          "
        >
          {actionText}

          {!isCurrent && <ArrowRight size={17} />}
        </button>

        {/* View Details Button */}
        {isCurrent && (
          <button
            type="button"
            onClick={() => {
              if (isCurrent) {
                navigate("/client/subscription/details");
              }
            }}
            className="
              flex flex-1
              items-center justify-center gap-2
              rounded-xl
              bg-indigo-600
              px-4 py-3
              text-sm font-semibold text-white
              transition
              hover:bg-indigo-700
            "
          >
            View Details
            {isCurrent && <ArrowRight size={17} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default PlanCard;
