export const extractSubscriptionPaymentData = (stripeSubscription) => {
  const invoice = stripeSubscription?.latest_invoice;

  if (!invoice || typeof invoice === "string") {
    return {
      invoiceId: typeof invoice === "string" ? invoice : null,
      paymentIntentId: null,
      paymentIntentStatus: null,
      clientSecret: null,
    };
  }

  const confirmationSecret = invoice.confirmation_secret;

  return {
    invoiceId: invoice.id || null,

    paymentIntentId: null,

    paymentIntentStatus: null,

    clientSecret:
      confirmationSecret?.client_secret || null,
  };
};