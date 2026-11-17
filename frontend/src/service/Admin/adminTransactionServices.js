import httpServices from "../httpServices";

export const getAdminTransactionsService = ({
  search = "",
  status = "all",
  from = "",
  to = "",
  startingAfter = null,
  limit = 10,
} = {}) => {
  return httpServices.get("/admin/transactions", {
    params: {
      search,
      status,
      from: from || undefined,
      to: to || undefined,
      startingAfter: startingAfter || undefined,
      limit,
    },
  });
};

export const getAdminTransactionStatsService = () => {
  return httpServices.get("/admin/transactions/stats");
};
