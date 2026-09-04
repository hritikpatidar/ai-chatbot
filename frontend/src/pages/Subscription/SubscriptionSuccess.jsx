import {
  CheckCircle2,
  ArrowRight,
  Receipt,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();

  const location = useLocation();

  const {
    plan,
    subscription,
    paymentIntent,
  } = location.state || {};

  return (
    <div className="flex min-h-[70vh] items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-gray-200 bg-white p-7 text-center shadow-xl dark:border-gray-800 dark:bg-[#171b23] sm:p-10">

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-500/10">
          <CheckCircle2
            size={42}
            className="text-emerald-600 dark:text-emerald-400"
          />
        </div>

        <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
          Subscription Activated!
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your subscription has been successfully activated.
        </p>

        {plan && (
          <div className="mt-7 rounded-2xl bg-gray-50 p-5 text-left dark:bg-gray-950">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">
                Plan
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {plan.name}
              </span>
            </div>

            <div className="mt-3 flex justify-between">
              <span className="text-sm text-gray-500">
                Amount
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {plan.currency?.toUpperCase()}{" "}
                {plan.amount}
              </span>
            </div>

            {paymentIntent?.id && (
              <div className="mt-3 flex justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Payment ID
                </span>

                <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">
                  {paymentIntent.id}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              navigate("/client/subscription/details")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Receipt size={17} />
            View Subscription
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/client")
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Continue
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;