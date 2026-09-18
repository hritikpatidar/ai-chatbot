import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

import {
  useSubscriptionPlans,
  useCreateSubscription,
  useCurrentSubscription,
} from "../../hooks/Subscription/useSubscription";

import StripeProvider from "../../components/Subscription/StripeProvider";
import PaymentForm from "../../components/Subscription/PaymentForm";
import { useSelector } from "react-redux";

const SubscriptionCheckout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);
  const { client } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const address = {
    line1: client.address.addressLine1,
    line2: client.address.addressLine2,
    city: client.address.city,
    state: client.address.state,
    postal_code: client.address.postalCode,
    country: "IN",
  };
  
  const { data, isLoading } = useSubscriptionPlans();
  const { data: currentData } = useCurrentSubscription();
  const { mutateAsync: createSubscription } = useCreateSubscription();
  const plans = data?.data?.data || data?.data || [];
  const plan = useMemo(
    () => plans.find((item) => item._id === planId),
    [plans, planId],
  );
  const currentSubscription =
    currentData?.data?.data || currentData?.data || null;

  const handlePayment = async ({ stripe, cardNumber, cardholderName }) => {
    setPaymentError("");
    setLoading(true);
    try {
      if (!stripe) {
        throw new Error("Stripe is not initialized.");
      }
      if (!cardNumber) {
        throw new Error("Card details are required.");
      }
      /* =====================================================
       1. CREATE PAYMENT METHOD
    ===================================================== */

      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumber,
          billing_details: {
            name: cardholderName,
            address: address,
          },
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      if (!paymentMethod?.id) {
        throw new Error("Payment method could not be created.");
      }

      /* =====================================================
       2. CREATE SUBSCRIPTION
    ===================================================== */

      const response = await createSubscription({
        planId: plan._id,
        paymentMethodId: paymentMethod.id,
        billingDetails: {
          name: cardholderName,
          address: address,
        },
      });

      const responseData = response?.data?.data || response?.data || {};
      const subscription = responseData?.subscription || null;
      /* =====================================================
       3. ALREADY PAID
    ===================================================== */

      if (responseData?.alreadyPaid || responseData?.already_paid) {
        navigate("/client/subscription/success", {
          replace: true,
          state: {
            plan,
            subscription,
            responseData,
          },
        });

        return;
      }
      if (responseData?.subscription.clientId.active_plan === "Free") {
        let paymentIntent = null;
        navigate("/client/subscription/success", {
          replace: true,
          state: {
            plan,
            subscription,
            paymentIntent,
            responseData,
          },
        });

        return;
      }

      /* =====================================================
       4. GET CLIENT SECRET
    ===================================================== */

      const clientSecret = responseData?.clientSecret || null;
      if (!clientSecret) {
        console.error(
          "Subscription API response does not contain client secret:",
          responseData,
        );

        throw new Error("Payment client secret was not generated.");
      }

      /* =====================================================
       5. CONFIRM PAYMENT
    ===================================================== */

      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      /* =====================================================
       6. PAYMENT RESULT
    ===================================================== */

      if (
        paymentIntent?.status === "succeeded" ||
        paymentIntent?.status === "processing"
      ) {
        navigate("/client/subscription/success", {
          replace: true,
          state: {
            plan,
            subscription,
            paymentIntent,
            responseData,
          },
        });

        return;
      }

      if (paymentIntent?.status === "requires_action") {
        throw new Error(
          "Additional authentication is required to complete payment.",
        );
      }

      throw new Error(
        `Payment could not be completed. Status: ${
          paymentIntent?.status || "unknown"
        }`,
      );
    } catch (error) {
      console.error("Subscription payment error:", error);

      setPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!plan) {
    return (
      <div className=" text-center">
        <h2 className="text-xl font-semibold">Subscription plan not found.</h2>

        <button
          onClick={() => navigate("/client/subscription")}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full ">
      {/* BACK */}
      <button
        type="button"
        onClick={() => navigate("/client/subscription")}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 dark:text-gray-400"
      >
        <ArrowLeft size={17} />
        Back to Plans
      </button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
        {/* PAYMENT */}

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#171b23] sm:p-7">
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Complete Your Subscription
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Enter your card details to activate your plan.
            </p>
          </div>

          <StripeProvider>
            <PaymentForm
              loading={loading}
              error={paymentError}
              onSubmit={handlePayment}
            />
          </StripeProvider>

          <div className="mt-6 flex items-center gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500 dark:bg-gray-950 dark:text-gray-400">
            <ShieldCheck size={16} className="text-emerald-500" />
            Secure payment powered by Stripe.
          </div>
        </div>

        {/* SUMMARY */}

        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-[#171b23]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Summary
          </h2>

          <div className="mt-5">
            <p className="text-sm text-gray-500">Selected Plan</p>

            <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {plan.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {plan.description}
            </p>
          </div>

          <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

          <div className="flex items-end justify-between">
            <span className="text-sm text-gray-500">
              {plan.interval === "year" ? "Yearly" : "Monthly"}
            </span>

            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.currency?.toUpperCase()} {plan.amount}
                {/* {plan.currency?.toUpperCase()}{" "}
                  {(Number(plan.amount) / 100).toFixed(2)} */}
              </span>

              <span className="ml-1 text-sm text-gray-500">
                /{plan.interval}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {plan.features?.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-500"
                />

                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-7 rounded-xl bg-indigo-50 p-4 dark:bg-indigo-500/10">
            <p className="text-xs text-indigo-600 dark:text-indigo-400">
              You will be charged according to the selected billing interval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
