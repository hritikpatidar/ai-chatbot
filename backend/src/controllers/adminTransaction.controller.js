import {
  getAdminTransactionStatsService,
  getAdminTransactionsService,
} from "../services/adminTransaction.service.js";

export const getAdminTransactionStatsController = async (_req, res) => {
  try {
    const data = await getAdminTransactionStatsService();
    return res.status(200).json({
      success: true,
      message: "Stripe transaction stats fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get admin transaction stats error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch Stripe transaction stats",
    });
  }
};

const parseDateBound = (value, endOfDay = false) => {
  if (!value) {
    return null;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return NaN;
  }

  const date = new Date(
    `${value}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}Z`,
  );
  return Number.isNaN(date.getTime()) ? NaN : Math.floor(date.getTime() / 1000);
};

export const getAdminTransactionsController = async (req, res) => {
  const {
    search = "",
    status = "all",
    from: fromQuery,
    to: toQuery,
    startingAfter,
  } = req.query;
  const limit = Number(req.query.limit || 10);
  const from = parseDateBound(fromQuery);
  const to = parseDateBound(toQuery, true);

  if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
    return res.status(400).json({
      success: false,
      message: "Limit must be a whole number between 1 and 50",
    });
  }

  if (Number.isNaN(from) || Number.isNaN(to)) {
    return res.status(400).json({
      success: false,
      message: "Dates must use YYYY-MM-DD format",
    });
  }

  if (from && to && from > to) {
    return res.status(400).json({
      success: false,
      message: "The start date must be before the end date",
    });
  }

  if (
    startingAfter &&
    (typeof startingAfter !== "string" ||
      !/^ch_[A-Za-z0-9]+$/.test(startingAfter))
  ) {
    return res.status(400).json({
      success: false,
      message: "Invalid transaction cursor",
    });
  }

  try {
    const data = await getAdminTransactionsService({
      search: String(search).trim().slice(0, 120).toLowerCase(),
      status,
      from,
      to,
      startingAfter,
      limit,
    });

    return res.status(200).json({
      success: true,
      message: "Stripe transactions fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get admin transactions error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to fetch Stripe transactions",
    });
  }
};
