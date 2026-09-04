import {
  Check,
  ArrowRight,
} from "lucide-react";

const PlanCard = ({
  plan,
  currentPlanId,
  onSelect,
}) => {
  const isCurrent =
    currentPlanId === plan._id;

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
            {/* {plan.currency?.toUpperCase()} {plan.amount} */}
            {plan.currency?.toUpperCase()}{" "}
                  {(Number(plan.amount) / 100).toFixed(2)}
          </span>

          <span className="mb-1 text-sm text-gray-500">
            / {plan.interval}
          </span>
        </div>
      </div>

      <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

      <div className="flex-1 space-y-3">
        {plan.features?.map(
          (feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
            >
              <Check
                size={18}
                className="mt-0.5 shrink-0 text-indigo-600"
              />

              <span className="text-sm text-gray-600 dark:text-gray-300">
                {feature}
              </span>
            </div>
          )
        )}
      </div>

      <button
        type="button"
        disabled={isCurrent}
        onClick={() => onSelect(plan)}
        className="
          mt-8
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-indigo-600
          px-4
          py-3
          text-sm
          font-semibold
          text-white
          transition
          hover:bg-indigo-700
          disabled:cursor-not-allowed
          disabled:bg-gray-300
          dark:disabled:bg-gray-700
        "
      >
        {isCurrent
          ? "Current Plan"
          : "Choose Plan"}

        {!isCurrent && (
          <ArrowRight size={17} />
        )}
      </button>
    </div>
  );
};

export default PlanCard;