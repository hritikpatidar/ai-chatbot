import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { useSelector } from "react-redux";

import {
  useSubscriptionPlans,
  useCreateSubscription,
} from "../../hooks/Subscription/useSubscription";

import StripeProvider from "../../components/Subscription/StripeProvider";
import PaymentForm from "../../components/Subscription/PaymentForm";

import { billingAddressSchema, checkoutSchema } from "../../utils/validation";
import { COUNTRIES } from "../../constants/countries";
import CustomSelect from "../../components/common/CustomSelect";

//  INITIAL ADDRESS
const getInitialAddress = (client) => ({
  line1: client?.address?.addressLine1 || "",
  line2: client?.address?.addressLine2 || "",
  city: client?.address?.city || "",
  state: client?.address?.state || "",
  postal_code: client?.address?.postalCode || "",
  country: "IN",
});

const SubscriptionCheckout = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    watch,
    handleSubmit,
    reset,
    control,
    formState: { errors: formErrors },
  } = useForm({
    resolver: zodResolver(billingAddressSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: getInitialAddress(null),
  });

  const billingAddress = watch();
  const { client } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const { data, isLoading } = useSubscriptionPlans();
  const { mutateAsync: createSubscription } = useCreateSubscription();
  const plans = data?.data?.data || data?.data || [];
  const plan = useMemo(
    () => plans.find((item) => item._id === planId),
    [plans, planId],
  );

  //  PREFILL ADDRESS FROM CLIENT

  useEffect(() => {
    if (!client) return;
    reset(getInitialAddress(client));
  }, [client, reset]);

  //  PAYMENT
  const handlePayment = async ({ stripe, cardNumber, cardholderName }) => {
    setPaymentError("");
    const checkoutResult = checkoutSchema.safeParse({
      cardholderName,
      address: billingAddress,
    });

    if (!checkoutResult.success) {
      const firstError =
        checkoutResult.error.issues[0]?.message ||
        "Please correct the highlighted fields.";

      setPaymentError(firstError);
      return;
    }
    const { cardholderName: validatedName, address: validatedAddress } =
      checkoutResult.data;
    setLoading(true);
    try {
      if (!stripe) {
        throw new Error("Stripe is not initialized.");
      }

      if (!cardNumber) {
        throw new Error("Card details are required.");
      }

      //  3. CREATE PAYMENT METHOD
      const { paymentMethod, error: paymentMethodError } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumber,
          billing_details: {
            name: validatedName,
            address: {
              line1: validatedAddress.line1,
              line2: validatedAddress.line2 || "",
              city: validatedAddress.city,
              state: validatedAddress.state,
              postal_code: validatedAddress.postal_code,
              country: validatedAddress.country,
            },
          },
        });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      if (!paymentMethod?.id) {
        throw new Error("Payment method could not be created.");
      }

      //  4. CREATE SUBSCRIPTION
      const response = await createSubscription({
        planId: plan._id,
        paymentMethodId: paymentMethod.id,
        billingDetails: {
          name: validatedName,
          address: {
            line1: validatedAddress.line1,
            line2: validatedAddress.line2 || "",
            city: validatedAddress.city,
            state: validatedAddress.state,
            postal_code: validatedAddress.postal_code,
            country: validatedAddress.country,
          },
        },
      });
      const responseData = response?.data?.data || response?.data || {};
      const subscription = responseData?.subscription || null;
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
      //  5. CLIENT SECRET

      const clientSecret = responseData?.clientSecret || null;
      if (!clientSecret) {
        console.error("Subscription API response:", responseData);
        throw new Error("Payment client secret was not generated.");
      }

      //  6. CONFIRM PAYMENT
      const { paymentIntent, error: confirmError } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      //  7. SUCCESS
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
  //  LOADING
  if (isLoading) {
    return (
      <div className="flex min-h-125 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  //  PLAN NOT FOUND
  if (!plan) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center px-4 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Subscription plan not found.
        </h2>

        <button
          type="button"
          onClick={() => navigate("/client/subscription")}
          className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Back to Plans
        </button>
      </div>
    );
  }

  //  FIELD CLASS

  const inputClass = (hasError) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:ring-2 dark:bg-[#11151c] dark:text-white 
      border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-gray-700
    `;

  return (
    <div className="min-h-full px-0 pb-8">
      <button
        type="button"
        onClick={() => navigate("/client/subscription")}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
      >
        <ArrowLeft size={17} />
        Back to Plans
      </button>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          Complete Your Subscription
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Enter your billing information and card details to activate your plan.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#171b23] sm:p-7">
            <div className="mb-6 flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400">
                <MapPin size={19} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Billing Address
                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter the address associated with your payment.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Address */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address Line 1<span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("line1")}
                  placeholder="Street address"
                  autoComplete="address-line1"
                  required
                  className={inputClass(!!formErrors.line1)}
                />

                {formErrors.line1 && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.line1.message}
                  </p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Address Line 2
                  <span className="ml-1 text-xs font-normal text-gray-400">
                    (Optional)
                  </span>
                </label>

                <input
                  type="text"
                  {...register("line2")}
                  placeholder="Apartment, suite, landmark, etc."
                  autoComplete="address-line2"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-700 dark:bg-[#11151c] dark:text-white"
                />
              </div>

              {/* City */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  City
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("city")}
                  placeholder="Indore"
                  autoComplete="address-level2"
                  required
                  className={inputClass(!!formErrors.city)}
                />

                {formErrors.city && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.city.message}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  State / Province
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("state")}
                  placeholder="Madhya Pradesh"
                  autoComplete="address-level1"
                  required
                  className={inputClass(!!formErrors.state)}
                />

                {formErrors.state && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.state.message}
                  </p>
                )}
              </div>

              {/* Postal */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Postal Code
                  <span className="ml-1 text-red-500">*</span>
                </label>

                <input
                  type="text"
                  {...register("postal_code")}
                  placeholder="452001"
                  autoComplete="postal-code"
                  required
                  className={inputClass(!!formErrors.postal_code)}
                />

                {formErrors.postal_code && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.postal_code.message}
                  </p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Country
                  <span className="ml-1 text-red-500">*</span>
                </label>
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      size="md"
                      name={field.name}
                      value={field.value || ""}
                      onChange={(event) => {
                        field.onChange(
                          event?.target?.value?.toUpperCase() || "",
                        );
                      }}
                      onBlur={field.onBlur}
                      options={COUNTRIES.map((country) => ({
                        value: country.code,
                        label: `${country.name} (${country.code})`,
                      }))}
                      placeholder="Select country"
                      error={formErrors?.country?.message}
                      required
                    />
                  )}
                />

                {formErrors.country && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.country.message}
                  </p>
                )}
              </div>
            </div>

            {/* Address Preview */}
            <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800 dark:bg-[#11151c]">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                Billing Address
              </p>

              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                {billingAddress.line1 || "Address not entered"}
                {billingAddress.line2 && `, ${billingAddress.line2}`}
                {billingAddress.city && `, ${billingAddress.city}`}
                {billingAddress.state && `, ${billingAddress.state}`}
                {billingAddress.postal_code &&
                  ` - ${billingAddress.postal_code}`}
                {billingAddress.country &&
                  `, ${
                    COUNTRIES.find(
                      (item) => item.code === billingAddress.country,
                    )?.name || billingAddress.country
                  }`}
              </p>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#171b23] sm:p-7">
            <div className="mb-7">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Payment Details
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Enter your card details to complete your subscription.
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
              <ShieldCheck size={16} className="shrink-0 text-emerald-500" />

              <span>
                Your payment information is securely processed by Stripe.
              </span>
            </div>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="h-fit rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-[#171b23] sm:p-6 xl:sticky xl:top-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Order Summary
          </h2>

          <div className="mt-5">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selected Plan
            </p>

            <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              {plan.name}
            </h3>

            <p className="mt-1 text-sm leading-6 text-gray-500 dark:text-gray-400">
              {plan.description}
            </p>
          </div>

          <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

          <div className="flex items-end justify-between gap-4">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {plan.interval === "year" ? "Yearly" : "Monthly"}
            </span>

            <div className="text-right">
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {plan.currency?.toUpperCase()} {plan.amount}
              </span>

              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                /{plan.interval}
              </span>
            </div>
          </div>

          <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

          <div className="space-y-3">
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
            <p className="text-xs leading-5 text-indigo-600 dark:text-indigo-400">
              You will be charged according to the selected billing interval.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
