import Subscription from "../models/Subscription.js";
import { stripe } from "./stripe.service.js";

const CHARGES_PER_STRIPE_PAGE = 100;
const MAX_STRIPE_PAGES_PER_REQUEST = 5;
const TRANSACTION_STATS_CACHE_TTL_MS = 5 * 60 * 1000;
let cachedTransactionStats = null;
let transactionStatsRequest = null;
const VALID_STATUSES = new Set([
  "all",
  "succeeded",
  "failed",
  "pending",
  "refunded",
  "partially_refunded",
]);

const normalizeStatus = (charge) => {
  const refundedAmount = charge.amount_refunded || 0;
  if (refundedAmount >= charge.amount && refundedAmount > 0) {
    return "refunded";
  }
  if (refundedAmount > 0) {
    return "partially_refunded";
  }
  if (charge.status === "failed" || charge.failure_code) {
    return "failed";
  }
  if (charge.status === "succeeded" && charge.paid) {
    return "succeeded";
  }
  return "pending";
};

const normalizeCharge = (charge, clientByCustomerId) => {
  const customer =
    charge.customer && typeof charge.customer === "object"
      ? charge.customer
      : null;
  const billingDetails = charge.billing_details || {};
  const client = clientByCustomerId.get(
    customer?.id || charge.customer || "",
  );
  const paymentDetails = charge.payment_method_details || {};

  return {
    id: charge.id,
    amount: charge.amount,
    amountRefunded: charge.amount_refunded || 0,
    currency: charge.currency,
    status: normalizeStatus(charge),
    created: charge.created,
    description: charge.description || "",
    customer: {
      id: customer?.id || charge.customer || null,
      name:
        client?.businessName ||
        billingDetails.name ||
        customer?.name ||
        "Unknown customer",
      email: billingDetails.email || customer?.email || "",
      businessName: client?.businessName || "",
    },
    paymentMethod: {
      type: paymentDetails.type || "unknown",
      brand: paymentDetails.card?.brand || "",
      last4: paymentDetails.card?.last4 || "",
    },
    paymentIntentId:
      typeof charge.payment_intent === "string"
        ? charge.payment_intent
        : charge.payment_intent?.id || null,
    invoiceId:
      typeof charge.invoice === "string"
        ? charge.invoice
        : charge.invoice?.id || null,
    receiptUrl: charge.receipt_url || "",
    failureCode: charge.failure_code || "",
    failureMessage: charge.failure_message || "",
  };
};

export const getAdminTransactionStatsService = async () => {
  if (
    cachedTransactionStats &&
    Date.now() - cachedTransactionStats.cachedAt < TRANSACTION_STATS_CACHE_TTL_MS
  ) {
    return cachedTransactionStats.stats;
  }

  if (transactionStatsRequest) {
    return transactionStatsRequest;
  }

  transactionStatsRequest = (async () => {
    let total = 0;
    let succeeded = 0;
    let startingAfter;
    let hasMore = true;

    while (hasMore) {
      const chargePage = await stripe.charges.list({
        limit: CHARGES_PER_STRIPE_PAGE,
        ...(startingAfter ? { starting_after: startingAfter } : {}),
      });

      total += chargePage.data.length;
      succeeded += chargePage.data.filter(
        (charge) => normalizeStatus(charge) === "succeeded",
      ).length;

      hasMore = chargePage.has_more;
      if (hasMore) {
        const lastCharge = chargePage.data[chargePage.data.length - 1];
        if (!lastCharge) {
          throw new Error("Stripe returned an empty page with more charges");
        }
        startingAfter = lastCharge.id;
      }
    }

    const stats = { total, succeeded };
    cachedTransactionStats = { stats, cachedAt: Date.now() };
    return stats;
  })();

  try {
    return await transactionStatsRequest;
  } finally {
    transactionStatsRequest = null;
  }
};

const matchesSearch = (transaction, search) => {
  if (!search) {
    return true;
  }

  const searchableValues = [
    transaction.id,
    transaction.customer.name,
    transaction.customer.businessName,
    transaction.customer.email,
    transaction.customer.id,
    transaction.description,
    transaction.paymentIntentId,
    transaction.invoiceId,
  ];

  return searchableValues.some((value) =>
    String(value || "")
      .toLowerCase()
      .includes(search),
  );
};

export const getAdminTransactionsService = async ({
  search = "",
  status = "all",
  from = null,
  to = null,
  startingAfter = null,
  limit = 20,
} = {}) => {
  if (!VALID_STATUSES.has(status)) {
    const error = new Error("Invalid transaction status");
    error.statusCode = 400;
    throw error;
  }

  const created = {};
  if (from) {
    created.gte = from;
  }
  if (to) {
    created.lte = to;
  }

  let cursor = startingAfter;
  let hasMore = false;
  const transactions = [];
  let stripePagesScanned = 0;

  while (stripePagesScanned < MAX_STRIPE_PAGES_PER_REQUEST) {
    const params = {
      limit: CHARGES_PER_STRIPE_PAGE,
      expand: ["data.customer"],
    };
    if (cursor) {
      params.starting_after = cursor;
    }
    if (Object.keys(created).length > 0) {
      params.created = created;
    }

    const chargePage = await stripe.charges.list(params);
    stripePagesScanned += 1;

    const customerIds = [
      ...new Set(
        chargePage.data
          .map((charge) =>
            typeof charge.customer === "string"
              ? charge.customer
              : charge.customer?.id,
          )
          .filter(Boolean),
      ),
    ];
    const subscriptions = customerIds.length
      ? await Subscription.find({
          stripeCustomerId: { $in: customerIds },
        })
          .select("stripeCustomerId clientId")
          .populate("clientId", "businessName")
          .lean()
      : [];
    const clientByCustomerId = new Map();
    for (const subscription of subscriptions) {
      if (!clientByCustomerId.has(subscription.stripeCustomerId)) {
        clientByCustomerId.set(
          subscription.stripeCustomerId,
          subscription.clientId,
        );
      }
    }

    for (let index = 0; index < chargePage.data.length; index += 1) {
      const charge = chargePage.data[index];
      cursor = charge.id;
      const transaction = normalizeCharge(charge, clientByCustomerId);
      const statusMatches =
        status === "all" || transaction.status === status;

      if (statusMatches && matchesSearch(transaction, search)) {
        transactions.push(transaction);
      }

      if (transactions.length === limit) {
        hasMore =
          index < chargePage.data.length - 1 || chargePage.has_more;
        return {
          transactions,
          hasMore,
          nextCursor: hasMore ? transaction.id : null,
        };
      }
    }

    hasMore = chargePage.has_more;
    if (!hasMore) {
      break;
    }
  }

  return {
    transactions,
    hasMore,
    nextCursor: hasMore ? cursor : null,
  };
};
