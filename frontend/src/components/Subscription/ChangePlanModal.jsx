// components/Subscription/ChangePlanModal.jsx

import { useEffect, useMemo, useState } from "react";
import {
  X,
  Check,
  ArrowUp,
  ArrowDown,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";

import {
  usePreviewSubscription,
  useChangeSubscriptionPlan,
  usePaymentMethods,
} from "../../hooks/Subscription/useSubscription";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";

const ChangePlanModal = ({
  isOpen,
  onClose,
  currentPlan,
  selectedPlan,
  subscriptionId,
  onSuccess,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showNewCard, setShowNewCard] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [loading, setLoading] = useState(false);
  const previewMutation = usePreviewSubscription();
  const changeMutation = useChangeSubscriptionPlan();
  const {
    data: cardsData,
    isLoading: cardsLoading,
    isFetching: cardsFetching,
    isError: cardsError,
  } = usePaymentMethods(subscriptionId);
  const paymentMethods = cardsData?.data?.data?.paymentMethods || [];
  const defaultPaymentMethod =
    cardsData?.data?.data?.defaultPaymentMethod || null;

  const isUpgrade = useMemo(() => {
    if (!currentPlan || !selectedPlan) return false;

    return Number(selectedPlan.sortOrder) > Number(currentPlan.sortOrder);
  }, [currentPlan, selectedPlan]);

  useEffect(() => {
    if (!isOpen || !subscriptionId || !selectedPlan?._id) {
      return;
    }

    previewMutation.mutate({
      subscriptionId,
      planId: selectedPlan._id,
    });
  }, [isOpen, subscriptionId, selectedPlan?._id]);

  useEffect(() => {
    if (!isOpen || !defaultPaymentMethod) return;

    setSelectedPaymentMethod(defaultPaymentMethod);
    setShowNewCard(false);
    setPaymentError("");
  }, [isOpen, defaultPaymentMethod]);

  if (!isOpen) return null;
  const preview = previewMutation.data?.data?.data || previewMutation.data?.data || null;
  const amountDue = Number(preview?.amountDue || 0);
  const currentAmount = Number(currentPlan?.amount || 0);
  const newAmount = Number(selectedPlan?.amount || 0);
  const priceDifference = newAmount - currentAmount;

  const handlePaymentConfirmation = async (
    clientSecret,
    responseData,
    subscription,
  ) => {
    if (!stripe) {
      setPaymentError("Stripe is not loaded.");
      return;
    }
    try {
      setLoading(true);
      const { error, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret);
      if (error) {
        setPaymentError(error.message);
        return;
      }
      if (paymentIntent?.status === "succeeded") {
        navigate("/client/subscription/success", {
          replace: true,
          state: {
            selectedPlan,
            subscription,
            responseData,
          },
        });
        onSuccess?.({ paymentIntent });
        onClose();
      }
    } catch (error) {
      setPaymentError(error.message || "Payment confirmation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!subscriptionId || !selectedPlan?._id) return;
    setPaymentError("");
    let paymentMethodId = selectedPaymentMethod?.id;
    try {
      setLoading(true);
      // New card selected
      if (showNewCard) {
        if (!stripe || !elements) {
          setPaymentError("Stripe is not loaded.");
          return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setPaymentError("Card information is required.");
          return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });
        if (error) {
          setPaymentError(error.message);
          return;
        }
        paymentMethodId = paymentMethod.id;
      }
      changeMutation.mutate(
        {
          subscriptionId,
          planId: selectedPlan._id,
          paymentMethodId,
        },
        {
          onSuccess: async (response) => {
            const responseData = response?.data?.data || response?.data || {};
            const subscription = responseData?.subscription || null;

            if (responseData?.requiresAction && responseData?.clientSecret) {
              await handlePaymentConfirmation(
                responseData.clientSecret,
                responseData,
                subscription,
              );
              return;
            }
            if (
              responseData?.paymentStatus === "succeeded" ||
              responseData?.invoice?.status === "paid"
            ) {
              navigate("/client/subscription/success", {
                replace: true,
                state: {
                  selectedPlan,
                  subscription,
                  responseData,
                },
              });
              onSuccess?.(responseData);
              onClose();
              return;
            }
          },
          onError: (error) => {
            setPaymentError(
              error?.response?.data?.message ||
                "Unable to change subscription.",
            );
          },
        },
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-4">
      {/* MODAL */}
      <div
        className="
        flex
        max-h-[90vh]
        w-full
        max-w-lg
        flex-col
        overflow-hidden
        rounded-2xl
        border border-gray-200
        bg-white
        shadow-2xl
        dark:border-gray-800
        dark:bg-[#171b23]
      "
      >
        {/* HEADER - FIXED */}
        <div
          className="
          flex shrink-0
          items-center justify-between
          border-b border-gray-200
          px-4 py-4
          sm:px-6 sm:py-5
          dark:border-gray-800
        "
        >
          <div>
            <div className="flex items-center gap-2">
              {isUpgrade ? (
                <ArrowUp
                  size={20}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              ) : (
                <ArrowDown
                  size={20}
                  className="text-orange-600 dark:text-orange-400"
                />
              )}

              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {isUpgrade ? "Upgrade Plan" : "Downgrade Plan"}
              </h2>
            </div>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Review your plan change before confirming.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={changeMutation.isPending}
            className="
              rounded-lg p-2
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900

              dark:hover:bg-white/5
              dark:hover:text-white
            "
          >
            <X size={20} />
          </button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* BODY */}
          <div className="p-4 sm:p-6">
            {/* PLAN COMPARISON */}

            <div className="grid grid-cols-2 gap-3">
              {/* CURRENT */}

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-[#1d222c]">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Current Plan
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  {currentPlan?.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {currentPlan?.currency?.toUpperCase()}{" "}
                  {currentAmount.toFixed(2)}
                  {" / "}
                  {currentPlan?.interval}
                </p>
              </div>

              {/* NEW */}

              <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                  New Plan
                </p>

                <h3 className="mt-2 text-lg font-bold text-gray-900 dark:text-white">
                  {selectedPlan?.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {selectedPlan?.currency?.toUpperCase()} {newAmount.toFixed(2)}
                  {" / "}
                  {selectedPlan?.interval}
                </p>
              </div>
            </div>

            {/* LOADING */}

            {previewMutation.isPending && (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border border-gray-200 p-8 dark:border-gray-800">
                <Loader2 size={28} className="animate-spin text-indigo-600" />

                <p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Calculating your plan change...
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Please wait while we calculate the prorated amount.
                </p>
              </div>
            )}

            {/* PREVIEW ERROR */}

            {previewMutation.isError && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <div className="flex gap-3">
                  <AlertCircle size={20} className="shrink-0 text-red-500" />

                  <div>
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                      Unable to calculate plan change
                    </p>

                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {previewMutation.error?.response?.data?.message ||
                        "Please try again."}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* PREVIEW */}

            {preview && !previewMutation.isPending && (
              <>
                <div className="my-6 h-px bg-gray-200 dark:bg-gray-800" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Current plan
                    </span>

                    <span className="font-medium text-gray-900 dark:text-white">
                      {currentPlan?.currency?.toUpperCase()}{" "}
                      {currentAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      New plan
                    </span>

                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPlan?.currency?.toUpperCase()}{" "}
                      {newAmount.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Plan difference
                    </span>

                    <span
                      className={
                        priceDifference >= 0
                          ? "font-medium text-gray-900 dark:text-white"
                          : "font-medium text-emerald-600 dark:text-emerald-400"
                      }
                    >
                      {priceDifference >= 0 ? "+" : ""}
                      {selectedPlan?.currency?.toUpperCase()}{" "}
                      {priceDifference.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">
                      Billing period
                    </span>

                    <span className="font-medium text-gray-900 dark:text-white">
                      {selectedPlan?.interval}
                    </span>
                  </div>
                </div>

                {/* AMOUNT DUE */}

                <div className="mt-5 rounded-xl bg-gray-100 p-4 dark:bg-[#1d222c]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {isUpgrade ? "Amount due now" : "Amount due"}
                      </p>

                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Calculated by Stripe
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {preview.currency?.toUpperCase()} {amountDue.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* INFO */}

                <div className="mt-4 flex gap-2 rounded-xl border border-indigo-100 bg-indigo-50 p-3 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                  <CreditCard
                    size={17}
                    className="mt-0.5 shrink-0 text-indigo-600 dark:text-indigo-400"
                  />

                  <p className="text-xs leading-5 text-indigo-700 dark:text-indigo-300">
                    The amount shown above is calculated based on the remaining
                    time in your current billing period.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* PAYMENT METHODS */}
          <div
            className="
            border-t
            border-gray-100
            px-4 pb-5
            sm:px-6 sm:pb-6
            dark:border-gray-800
          "
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Payment Method
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Choose how you want to pay for this plan change.
                </p>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-500/10">
                <CreditCard
                  size={18}
                  className="text-indigo-600 dark:text-indigo-400"
                />
              </div>
            </div>

            {/* SAVED CARDS */}
            {cardsLoading ? (
              <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-800 dark:bg-[#1d222c]">
                <div className="flex items-center gap-2">
                  <Loader2 size={19} className="animate-spin text-indigo-600" />

                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Loading payment methods...
                  </span>
                </div>
              </div>
            ) : cardsError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
                <div className="flex items-start gap-3">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      Unable to load payment methods
                    </p>

                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Please try again or use a different card.
                    </p>
                  </div>
                </div>
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="space-y-3">
                {paymentMethods.map((method) => {
                  const isSelected = selectedPaymentMethod?.id === method.id;

                  const brand =
                    method.card?.display_brand || method.card?.brand || "Card";

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setSelectedPaymentMethod(method);
                        setShowNewCard(false);
                        setPaymentError("");
                      }}
                      className={`group w-full rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4 ${
                        isSelected
                          ? `
                  border-indigo-500
                  bg-indigo-50/70
                  shadow-sm
                  ring-1 ring-indigo-500/20
                  dark:border-indigo-400
                  dark:bg-indigo-500/10
                  dark:ring-indigo-400/20
                `
                          : `
                  border-gray-200
                  bg-white
                  hover:border-indigo-300
                  hover:bg-gray-50
                  dark:border-gray-800
                  dark:bg-[#1d222c]
                  dark:hover:border-indigo-500/40
                  dark:hover:bg-[#202631]
                `
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* CARD ICON */}
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition ${
                            isSelected
                              ? "bg-indigo-100 dark:bg-indigo-500/20"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <CreditCard
                            size={19}
                            className={
                              isSelected
                                ? "text-indigo-600 dark:text-indigo-400"
                                : "text-gray-500 dark:text-gray-400"
                            }
                          />
                        </div>

                        {/* CARD INFO */}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <p className="truncate text-sm font-semibold capitalize text-gray-900 dark:text-white">
                              {brand} •••• {method.card?.last4}
                            </p>

                            {defaultPaymentMethod?.id === method.id && (
                              <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300">
                                Default
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            Expires{" "}
                            {String(method.card?.exp_month).padStart(2, "0")}/
                            {method.card?.exp_year}
                          </p>
                        </div>

                        {/* RADIO */}
                        <div
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                            isSelected
                              ? "border-indigo-600 dark:border-indigo-400"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          {isSelected && (
                            <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-[#1d222c]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                    <CreditCard
                      size={18}
                      className="text-gray-500 dark:text-gray-400"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      No saved card
                    </p>

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Add a card to continue with the payment.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* USE DIFFERENT CARD */}
            <button
              type="button"
              onClick={() => {
                setShowNewCard(true);
                setSelectedPaymentMethod(null);
                setPaymentError("");
              }}
              className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-3 text-sm font-semibold transition-all ${
                showNewCard
                  ? `
          border-indigo-500
          bg-indigo-50
          text-indigo-700
          dark:border-indigo-400
          dark:bg-indigo-500/10
          dark:text-indigo-300
        `
                  : `
          border-gray-300
          text-indigo-600
          hover:border-indigo-400
          hover:bg-indigo-50
          dark:border-gray-700
          dark:text-indigo-400
          dark:hover:border-indigo-500/50
          dark:hover:bg-indigo-500/10
        `
              }`}
            >
              <CreditCard size={17} />

              {showNewCard ? "Using a different card" : "Use a different card"}
            </button>

            {/* NEW CARD */}
            {showNewCard && (
              <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
                <div className="mb-3">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    Enter new card details
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Your card will be securely processed by Stripe.
                  </p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-[#11151c] sm:p-4">
                  <CardElement
                    options={{
                      hidePostalCode: true,
                      style: {
                        base: {
                          fontSize: "15px",
                          color: !isDarkMode ? "#111827" : "#fff",
                          fontFamily: "Inter, system-ui, sans-serif",
                          "::placeholder": {
                            color: "#9CA3AF",
                          },
                        },
                        invalid: {
                          color: "#DC2626",
                        },
                      },
                    }}
                  />
                </div>
              </div>
            )}

            {/* PAYMENT ERROR */}
            {paymentError && (
              <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-500/20 dark:bg-red-500/10">
                <div className="flex items-start gap-2">
                  <AlertCircle
                    size={16}
                    className="mt-0.5 shrink-0 text-red-500"
                  />

                  <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                    {paymentError}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER - FIXED */}
        <div
          className="
          flex shrink-0
          flex-col-reverse
          gap-2
          border-t border-gray-200
          bg-white
          px-4 py-3
          sm:flex-row
          sm:justify-end
          sm:gap-3
          sm:px-6 sm:py-4
          dark:border-gray-800
          dark:bg-[#171b23]
        "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={changeMutation.isPending}
            className="
              rounded-xl
              border border-gray-200
              px-5 py-3
              text-sm font-semibold
              text-gray-700
              transition
              hover:bg-gray-50

              dark:border-gray-700
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              !preview || previewMutation.isPending || changeMutation.isPending
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-indigo-600
              px-5
              py-3
              text-sm font-semibold
              text-white
              transition
              hover:bg-indigo-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {changeMutation.isPending ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>{isUpgrade ? "Confirm Upgrade" : "Confirm Downgrade"}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;
