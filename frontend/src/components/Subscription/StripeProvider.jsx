import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

const StripeProvider = ({ children }) => {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#4f46e5",
            borderRadius: "10px",
          },
        },
      }}
    >
      {children}
    </Elements>
  );
};

export default StripeProvider;