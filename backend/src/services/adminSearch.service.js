import mongoose from "mongoose";
import Client from "../models/Client.js";
import SupportTicket from "../models/SupportTicket.js";
import Subscription from "../models/Subscription.js";
import SubscriptionPlan from "../models/SubscriptionPlan.js";
import User from "../models/User.js";
import { getAdminTransactionsService } from "./adminTransaction.service.js";

const RESULT_LIMIT = 4;

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildRoute = (pathname, query = "") =>
  query ? `${pathname}?search=${encodeURIComponent(query)}` : pathname;

export const searchAdminRecordsService = async (rawQuery) => {
  const query = String(rawQuery || "").trim().slice(0, 100);
  if (query.length < 2) {
    const error = new Error("Search query must be at least 2 characters");
    error.statusCode = 400;
    throw error;
  }

  const regex = new RegExp(escapeRegex(query), "i");
  const clientFilters = [
    { businessName: regex },
    { businessType: regex },
    { "contact.email": regex },
    { clientKey: regex },
    { slug: regex },
    { status: regex },
  ];
  const userFilters = [{ fullName: regex }, { email: regex }];
  const ticketFilters = [
    { ticketNumber: regex },
    { clientName: regex },
    { clientEmail: regex },
    { subject: regex },
    { status: regex },
  ];
  const planFilters = [
    { name: regex },
    { description: regex },
    { stripePriceId: regex },
    { stripeProductId: regex },
    { status: regex },
  ];

  if (mongoose.Types.ObjectId.isValid(query)) {
    clientFilters.push({ _id: query });
    planFilters.push({ _id: query });
  }

  const [matchingClients, matchingUsers, tickets, plans, transactions] =
    await Promise.all([
      Client.find({ $or: clientFilters })
        .select("_id businessName businessType contact.email clientKey slug")
        .sort({ businessName: 1 })
        .limit(RESULT_LIMIT)
        .lean(),
      User.find({ role: "client", $or: userFilters })
        .select("_id fullName email clientId")
        .limit(RESULT_LIMIT)
        .lean(),
      SupportTicket.find({ $or: ticketFilters })
        .select("_id ticketNumber clientName clientEmail subject status updatedAt")
        .sort({ updatedAt: -1 })
        .limit(RESULT_LIMIT)
        .lean(),
      SubscriptionPlan.find({ $or: planFilters })
        .select("_id name description status interval")
        .sort({ sortOrder: 1, name: 1 })
        .limit(RESULT_LIMIT)
        .lean(),
      getAdminTransactionsService({ search: query.toLowerCase(), limit: RESULT_LIMIT }),
    ]);

  const clientIds = new Set([
    ...matchingClients.map((client) => String(client._id)),
    ...matchingUsers.map((user) => String(user.clientId || "")).filter(Boolean),
  ]);
  const clientIdList = [...clientIds];
  const clientsForUsers = clientIdList.length
    ? await Client.find({ _id: { $in: clientIdList } })
        .select("_id businessName businessType clientKey slug")
        .lean()
    : [];
  const clientById = new Map(
    [...matchingClients, ...clientsForUsers].map((client) => [
      String(client._id),
      client,
    ]),
  );
  const relatedUsers = clientIdList.length
    ? await User.find({ role: "client", clientId: { $in: clientIdList } })
        .select("fullName email clientId")
        .lean()
    : [];
  const userByClientId = new Map(
    relatedUsers.map((user) => [String(user.clientId), user]),
  );

  const ticketResults = tickets.map((ticket) => ({
    id: String(ticket._id),
    type: "ticket",
    title: ticket.subject,
    subtitle: `${ticket.ticketNumber} · ${ticket.clientName || ticket.clientEmail}`,
    route: buildRoute("/admin/support-tickets", ticket.ticketNumber),
    searchTerm: ticket.ticketNumber,
  }));
  const clientResults = [...clientById.values()]
    .slice(0, RESULT_LIMIT)
    .map((client) => {
      const owner = userByClientId.get(String(client._id));
      const matchedUser = matchingUsers.find(
        (user) => String(user.clientId) === String(client._id),
      );
      return {
        id: String(client._id),
        type: "client",
        title: client.businessName || matchedUser?.fullName || "Client",
        subtitle:
          [
            client.businessType,
            client.contact?.email || owner?.email || matchedUser?.email,
          ]
            .filter(Boolean)
            .join(" · ") || client.clientKey,
        route: `/admin/clients/${client._id}`,
      };
    });
  const planResults = plans.map((plan) => ({
    id: String(plan._id),
    type: "plan",
    title: plan.name,
    subtitle: `${plan.interval} · ${plan.status}`,
    route: `/admin/subscription-plans/${plan._id}`,
  }));

  const planIds = plans.map((plan) => plan._id);
  const subscriptionFilters = [
    { stripeSubscriptionId: regex },
    { stripeCustomerId: regex },
    { status: regex },
  ];
  if (clientIdList.length) {
    subscriptionFilters.push({ clientId: { $in: clientIdList } });
  }
  if (planIds.length) {
    subscriptionFilters.push({ planId: { $in: planIds } });
  }

  const subscriptions = await Subscription.find({ $or: subscriptionFilters })
    .sort({ createdAt: -1 })
    .limit(RESULT_LIMIT)
    .populate("clientId", "businessName")
    .populate("userId", "fullName email")
    .populate("planId", "name")
    .lean();

  const subscriptionResults = subscriptions.map((subscription) => {
    const matchingClient = clientById.get(String(subscription.clientId?._id));
    const matchingPlan = plans.find(
      (plan) => String(plan._id) === String(subscription.planId?._id),
    );
    const title =
      matchingClient?.businessName ||
      subscription.clientId?.businessName ||
      subscription.userId?.fullName ||
      subscription.stripeSubscriptionId;
    const searchTerm =
      subscription.stripeSubscriptionId ||
      matchingClient?.businessName ||
      subscription.clientId?.businessName ||
      subscription.userId?.email ||
      query;
    return {
      id: String(subscription._id),
      type: "subscription",
      title,
      subtitle: `${matchingPlan?.name || subscription.planId?.name || "Subscription"} · ${subscription.status}`,
      route: buildRoute("/admin/subscriptions", searchTerm),
      searchTerm,
    };
  });

  const transactionResults = (transactions.transactions || []).map(
    (transaction) => ({
      id: transaction.id,
      type: "transaction",
      title: transaction.customer?.businessName || transaction.customer?.name || transaction.id,
      subtitle: transaction.customer?.email || transaction.id,
      route: buildRoute("/admin/transactions", transaction.id),
      searchTerm: transaction.id,
    }),
  );

  return {
    results: [
      ...clientResults,
      ...ticketResults,
      ...subscriptionResults,
      ...planResults,
      ...transactionResults,
    ],
  };
};
