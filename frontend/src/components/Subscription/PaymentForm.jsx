import { useState } from "react";

import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import { CreditCard, Loader2, Lock } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const PaymentForm = ({ loading, onSubmit, error }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { isDarkMode, toggleTheme } = useTheme();

  const [cardholderName, setCardholderName] = useState("");

  const [cardError, setCardError] = useState("");

  const elementOptions = {
    style: {
      base: {
        fontSize: "15px",
        color: !isDarkMode ? "#111827" : "#fff", //#111827
        fontFamily: "Inter, system-ui, sans-serif",
        "::placeholder": {
          color: "#9CA3AF",
        },
      },
      invalid: {
        color: "#DC2626",
      },
    },
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setCardError("");

    if (!stripe || !elements) {
      setCardError("Payment system is not ready. Please try again.");
      return;
    }

    if (!cardholderName.trim()) {
      setCardError("Cardholder name is required.");
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);

    if (!cardNumber) {
      setCardError("Card details are required.");
      return;
    }

    await onSubmit({
      stripe,
      elements,
      cardNumber,
      cardholderName: cardholderName.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* CARD HOLDER */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Cardholder Name
          <span className="ml-1 text-red-500">*</span>
        </label>

        <input
          type="text"
          value={cardholderName}
          onChange={(e) => {
            setCardholderName(e.target.value);
            setCardError("");
          }}
          placeholder="John Doe"
          disabled={loading}
          className="
            w-full
            rounded-xl
            border
            border-gray-200
            bg-white
            px-4
            py-3
            text-sm
            outline-none
            focus:border-indigo-500
            dark:border-gray-700
            dark:bg-gray-950
            dark:text-white
          "
        />
      </div>

      {/* CARD NUMBER */}

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Card Number
          <span className="ml-1 text-red-500">*</span>
        </label>

        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-950">
          <CardNumberElement
            options={elementOptions}
            onChange={(event) => {
              setCardError(event.error?.message || "");
            }}
          />
        </div>
      </div>

      {/* EXPIRY + CVC */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Expiry Date
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-950">
            <CardExpiryElement
              options={elementOptions}
              onChange={(event) => {
                setCardError(event.error?.message || "");
              }}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            CVC
            <span className="ml-1 text-red-500">*</span>
          </label>

          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-950">
            <CardCvcElement
              options={elementOptions}
              onChange={(event) => {
                setCardError(event.error?.message || "");
              }}
            />
          </div>
        </div>
      </div>

      {/* ERROR */}

      {(cardError || error) && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          {cardError || error}
        </div>
      )}

      {/* SECURITY */}

      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <Lock size={14} />
        Your payment information is securely processed by Stripe.
      </div>

      {/* SUBMIT */}

      <button
        type="submit"
        disabled={loading || !stripe || !elements}
        className="
          flex
          w-full
          items-center
          justify-center
          gap-2
          rounded-xl
          bg-indigo-600
          px-5
          py-3.5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-indigo-700
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard size={18} />
            Pay & Subscribe
          </>
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
