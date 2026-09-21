import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import {
  CreditCard,
  Plus,
  Trash2,
  Check,
  Star,
  Loader2,
  X,
  ShieldCheck,
} from "lucide-react";

import {
  useAddPaymentMethod,
  usePaymentMethods,
  useRemovePaymentMethod,
  useSetDefaultPaymentMethod,
} from "../../hooks/Subscription/usePaymentMethods";

import ConfirmModal from "./ConfirmModal";
import { useTheme } from "../../context/ThemeContext";

const getApiError = (error, fallback) => {
  return error?.response?.data?.message || error?.message || fallback;
};

const getCardBrand = (brand) => {
  if (!brand) return "Card";

  return brand.charAt(0).toUpperCase() + brand.slice(1);
};

export default function PaymentMethods({ subscriptionId }) {
  const stripe = useStripe();
  const elements = useElements();
  const { isDarkMode, toggleTheme } = useTheme();

  const {
    data: paymentMethodsResponse,
    isLoading,
    isFetching,
    refetch,
    error: paymentMethodsError,
  } = usePaymentMethods(subscriptionId);

  const addPaymentMethod = useAddPaymentMethod();
  const setDefaultPaymentMethod = useSetDefaultPaymentMethod();
  const removePaymentMethod = useRemovePaymentMethod();

  const [showAddCard, setShowAddCard] = useState(false);

  const [cardComplete, setCardComplete] = useState(false);

  const [cardError, setCardError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState(null);

  const [updatingCardId, setUpdatingCardId] = useState(null);

  const paymentMethods = paymentMethodsResponse?.paymentMethods || [];
  const defaultPaymentMethod =
    paymentMethodsResponse?.defaultPaymentMethod || null;

  useEffect(() => {
    if (!successMessage && !errorMessage) return;

    const timer = setTimeout(() => {
      setSuccessMessage("");
      setErrorMessage("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage, errorMessage]);

  const resetAddCardForm = () => {
    setShowAddCard(false);
    setCardComplete(false);
    setCardError("");

    const cardElement = elements?.getElement(CardElement);

    cardElement?.clear();
  };

  /**
   * Add new card
   */
  const handleAddCard = async () => {
    setSuccessMessage("");
    setErrorMessage("");
    setCardError("");

    if (!stripe || !elements) {
      setErrorMessage("Stripe is not ready. Please try again.");
      return;
    }

    if (!subscriptionId) {
      setErrorMessage(
        "Active subscription is required to add a payment method.",
      );
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setErrorMessage("Card input is not available.");
      return;
    }

    if (!cardComplete) {
      setCardError("Please enter complete card details.");
      return;
    }

    try {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",

        card: cardElement,
      });

      if (error) {
        setCardError(error.message || "Unable to validate card.");

        return;
      }

      if (!paymentMethod?.id) {
        setCardError("Unable to create payment method.");

        return;
      }
      await addPaymentMethod.mutateAsync({
        subscriptionId,
        paymentMethodId: paymentMethod.id,
      });

      setSuccessMessage("Payment method added successfully.");

      resetAddCardForm();
    } catch (error) {
      setErrorMessage(getApiError(error, "Unable to add payment method."));
    }
  };

  /**
   * Set default
   */
  const handleSetDefault = async (paymentMethodId) => {
    if (!subscriptionId || !paymentMethodId) {
      return;
    }

    setSuccessMessage("");
    setErrorMessage("");
    setUpdatingCardId(paymentMethodId);

    try {
      const response = await setDefaultPaymentMethod.mutateAsync({
        subscriptionId,
        paymentMethodId,
      });
      await refetch();
      if (response?.data?.success)
        setSuccessMessage(
          response?.data?.message || "Default payment method updated.",
        );
      else
        setSuccessMessage(
          response?.data?.message || "Something went wrong, Try again.",
        );
    } catch (error) {
      setErrorMessage(
        getApiError(error, "Unable to update default payment method."),
      );
    } finally {
      setUpdatingCardId(null);
    }
  };

  /**
   * Delete card
   */
  const handleDeleteCard = async () => {
    if (!subscriptionId || !selectedCard?.id) {
      return;
    }

    setUpdatingCardId(selectedCard.id);

    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await removePaymentMethod.mutateAsync({
        subscriptionId,
        paymentMethodId: selectedCard.id,
      });
      if (response?.data?.success) {
        setSuccessMessage(
          response?.data?.message || "Payment method removed successfully.",
        );
        setDeleteModalOpen(false);
        setSelectedCard(null);
      } else {
        setSuccessMessage(
          response?.data?.message || "Something went wrong, Try again.",
        );
      }
    } catch (error) {
      setErrorMessage(getApiError(error, "Unable to remove payment method."));
    } finally {
      setUpdatingCardId(null);
    }
  };

  const openDeleteModal = (card) => {
    setSelectedCard(card);
    setDeleteModalOpen(true);
  };

  if (!subscriptionId) {
    return (
      <section
        className="
          mt-5
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div
              className="
                flex
                h-11
                w-11
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
              "
            >
              <CreditCard size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Payment Methods
              </h2>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Payment methods will be available after you have an active
                subscription.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section
        className="
          mt-5
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-sm
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        {/* Header */}
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-gray-200
            px-5
            py-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            dark:border-white/10
          "
        >
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
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
              "
            >
              <CreditCard size={19} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                Payment Methods
              </h2>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Manage your saved cards and default payment method.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCard((value) => !value)}
            className="
              inline-flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition
              hover:bg-blue-700
              sm:w-auto
            "
          >
            {showAddCard ? (
              <>
                <X size={16} />
                Cancel
              </>
            ) : (
              <>
                <Plus size={16} />
                Add Card
              </>
            )}
          </button>
        </div>

        {/* Messages */}
        {(successMessage || errorMessage) && (
          <div className="px-5 pt-4">
            {successMessage && (
              <div
                className="
                  rounded-lg
                  border
                  border-green-200
                  bg-green-50
                  px-4
                  py-3
                  text-sm
                  text-green-700
                  dark:border-green-500/20
                  dark:bg-green-500/10
                  dark:text-green-400
                "
              >
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div
                className="
                  rounded-lg
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  text-red-700
                  dark:border-red-500/20
                  dark:bg-red-500/10
                  dark:text-red-400
                "
              >
                {errorMessage}
              </div>
            )}
          </div>
        )}

        {/* Add card */}
        {showAddCard && (
          <div
            className="
              border-b
              border-gray-200
              p-5
              dark:border-white/10
            "
          >
            <div
              className="
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-4
                dark:border-white/10
                dark:bg-white/[0.03]
              "
            >
              <div className="mb-4 flex items-start gap-3">
                <ShieldCheck
                  size={19}
                  className="mt-0.5 text-green-600 dark:text-green-400"
                />

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Add a new card
                  </h3>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Your card details are securely handled by Stripe.
                  </p>
                </div>
              </div>

              <div
                className={`
                  rounded-lg
                  border
                  bg-white
                  px-4
                  py-3
                  dark:bg-[#11151c]
                  ${
                    cardError
                      ? "border-red-400 dark:border-red-500/50"
                      : "border-gray-200 dark:border-white/10"
                  }
                `}
              >
                <CardElement
                  options={{
                    hidePostalCode: true,
                    style: {
                      base: {
                        fontSize: "15px",
                        color: !isDarkMode ? "#111827" : "#fff",
                        fontFamily:
                          '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

                        "::placeholder": {
                          color: "#9CA3AF",
                        },
                      },

                      invalid: {
                        color: "#DC2626",
                      },
                    },
                  }}
                  onChange={(event) => {
                    setCardComplete(event.complete);

                    setCardError(event.error?.message || "");
                  }}
                />
              </div>

              {cardError && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">
                  {cardError}
                </p>
              )}

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleAddCard}
                  disabled={
                    !stripe ||
                    !elements ||
                    !cardComplete ||
                    addPaymentMethod.isPending
                  }
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-blue-600
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-blue-700
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {addPaymentMethod.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus size={16} />
                      Add Card
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cards */}
        <div className="p-5">
          {isLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={24} className="animate-spin text-blue-600" />
            </div>
          ) : paymentMethodsError ? (
            <div
              className="
                rounded-xl
                border
                border-red-200
                bg-red-50
                p-4
                text-sm
                text-red-600
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              {getApiError(
                paymentMethodsError,
                "Unable to load payment methods.",
              )}
            </div>
          ) : paymentMethods.length === 0 ? (
            <div
              className="
                rounded-xl
                border
                border-dashed
                border-gray-300
                p-8
                text-center
                dark:border-white/15
              "
            >
              <CreditCard size={32} className="mx-auto text-gray-400" />

              <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                No saved cards
              </h3>

              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Add a payment method to make future subscription payments
                easier.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((card) => {
                const isDefault = defaultPaymentMethod?.id === card.id;

                const isUpdating = updatingCardId === card.id;

                return (
                  <div
                    key={card.id}
                    className="
                      flex
                      flex-col
                      gap-4
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      p-4
                      transition
                      dark:border-white/10
                      dark:bg-white/[0.03]
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                    "
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className="
                          flex
                          h-11
                          w-14
                          shrink-0
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-gray-200
                          bg-white
                          text-gray-700
                          dark:border-white/10
                          dark:bg-[#11151c]
                          dark:text-gray-300
                        "
                      >
                        <CreditCard size={21} />
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getCardBrand(card?.card?.brand)} ••••{" "}
                            {card?.card?.last4 ||
                              card?.card?.lastFour ||
                              "----"}
                          </p>

                          {isDefault && (
                            <span
                              className="
                                inline-flex
                                items-center
                                gap-1
                                rounded-full
                                bg-blue-500/10
                                px-2
                                py-1
                                text-[11px]
                                font-medium
                                text-blue-600
                                dark:text-blue-400
                              "
                            >
                              <Star size={11} />
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {card.exp_month && card.exp_year
                            ? `Expires ${String(card.exp_month).padStart(
                                2,
                                "0",
                              )}/${String(card.exp_year).slice(-2)}`
                            : "Saved payment method"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!isDefault && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleSetDefault(card.id)}
                          className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-lg
                            border
                            border-gray-200
                            bg-white
                            px-3
                            py-2
                            text-xs
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-100
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            dark:border-white/10
                            dark:bg-white/5
                            dark:text-gray-300
                            dark:hover:bg-white/10
                          "
                        >
                          {isUpdating ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} />
                          )}
                          Make Default
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isUpdating || paymentMethods.length === 1}
                        onClick={() => openDeleteModal(card)}
                        title={
                          paymentMethods.length === 1
                            ? "At least one payment method is required"
                            : "Remove card"
                        }
                        className="
                          inline-flex
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-red-200
                          bg-red-50
                          p-2
                          text-red-600
                          transition
                          hover:bg-red-100
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                          dark:border-red-500/20
                          dark:bg-red-500/10
                          dark:text-red-400
                          dark:hover:bg-red-500/20
                        "
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {isFetching && !isLoading && (
            <div className="mt-3 text-right text-[11px] text-gray-400">
              Updating payment methods...
            </div>
          )}
        </div>
      </section>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onCancel={() => {
          if (!removePaymentMethod.isPending) {
            setDeleteModalOpen(false);
            setSelectedCard(null);
          }
        }}
        onConfirm={handleDeleteCard}
        loading={removePaymentMethod.isPending}
        title="Remove Payment Method?"
        message={
          selectedCard
            ? `Are you sure you want to remove ${getCardBrand(
                selectedCard.card.brand,
              )} ending in ${selectedCard.card.last4 || "----"}?`
            : "Are you sure you want to remove this payment method?"
        }
        confirmText={
          removePaymentMethod.isPending ? "Removing..." : "Remove Card"
        }
        cancelText="Cancel"
        danger
      />
    </>
  );
}
