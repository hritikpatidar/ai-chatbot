import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Download,
  ExternalLink,
  Receipt,
  RefreshCw,
  RotateCcw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import {
  useAdminTransactions,
  useAdminTransactionStats,
} from "../../hooks/Admin/useAdminTransactions";
import Pagination from "../../components/common/Pagination";
import CustomSelect from "../../components/common/CustomSelect";
import { useLanguage } from "../../context/LanguageContext";

const EMPTY_TRANSACTIONS = [];

const formatCurrency = (amount = 0, currency = "usd") => {
  const normalizedCurrency = String(currency || "usd").toUpperCase();
  const fractionDigits = new Intl.NumberFormat("en", {
    style: "currency",
    currency: normalizedCurrency,
  }).resolvedOptions().maximumFractionDigits;

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: normalizedCurrency,
  }).format(Number(amount || 0) / 10 ** fractionDigits);
};

const formatDate = (timestamp) => {
  if (!timestamp) {
    return "—";
  }

  return new Date(timestamp * 1000).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const statusDetails = {
  succeeded: {
    label: "Succeeded",
    className:
      "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
  pending: {
    label: "Pending",
    className:
      "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  },
  refunded: {
    label: "Refunded",
    className:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  },
  partially_refunded: {
    label: "Partially refunded",
    className:
      "bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400",
  },
};

const TransactionStatus = ({ status }) => {
  const { t } = useLanguage();
  const details = statusDetails[status] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-600 dark:bg-white/5 dark:text-gray-300",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${details.className}`}
    >
      {t(details.label)}
    </span>
  );
};

const StatCard = ({ title, value, description, icon: Icon, tone }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#11161f] sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
          {title}
        </p>
        <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
      <span className={`rounded-xl p-2.5 ${tone}`}>
        <Icon size={19} />
      </span>
    </div>
  </div>
);

const PaymentMethod = ({ method }) => {
  if (!method) {
    return "—";
  }

  if (method.last4) {
    return `${method.brand || method.type} •••• ${method.last4}`;
  }

  return method.type || "—";
};

const exportTransactions = (transactions, t) => {
  const columns = [
    t("Transaction ID"),
    t("Date"),
    t("Customer"),
    t("Email"),
    t("Amount"),
    t("Currency"),
    t("Status"),
    t("Payment method"),
    t("Invoice ID"),
    t("Payment intent ID"),
  ];
  const rows = transactions.map((transaction) => [
    transaction.id,
    formatDate(transaction.created),
    transaction.customer?.businessName || transaction.customer?.name,
    transaction.customer?.email,
    transaction.amount,
    transaction.currency,
    transaction.status,
    PaymentMethod({ method: transaction.paymentMethod }),
    transaction.invoiceId,
    transaction.paymentIntentId,
  ]);
  const csvValue = (value) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;
  const csv = [columns, ...rows]
    .map((row) => row.map(csvValue).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = `stripe-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

const TransactionDetails = ({ transaction, onClose }) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const method = transaction.paymentMethod;

  return (
    <div
      className="fixed inset-0 z-70 flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="transaction-details-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#11161f] sm:max-w-xl sm:rounded-2xl"
      >
        <header className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#11161f] sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <span className="rounded-xl bg-blue-50 p-2.5 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <Receipt size={19} />
            </span>
            <div className="min-w-0">
              <h2
                id="transaction-details-title"
                className="text-base font-semibold text-gray-900 dark:text-white"
              >
                {t("Transaction details")}
              </h2>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {transaction.id}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("Close transaction details")}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-5 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gray-50 p-4 dark:bg-white/5">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {t("Amount")}
              </p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(transaction.amount, transaction.currency)}
              </p>
            </div>
            <TransactionStatus status={transaction.status} />
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Detail label={t("Customer")}>
              {transaction.customer?.businessName ||
                transaction.customer?.name ||
                t("Unknown customer")}
            </Detail>
            <Detail label={t("Email")}>
              {transaction.customer?.email || "—"}
            </Detail>
            <Detail label={t("Payment method")}>
              <PaymentMethod method={method} />
            </Detail>
            <Detail label={t("Date")}>{formatDate(transaction.created)}</Detail>
            <Detail label={t("Invoice ID")}>{transaction.invoiceId || "—"}</Detail>
            <Detail label={t("Payment intent")}>
              {transaction.paymentIntentId || "—"}
            </Detail>
            <Detail label={t("Refunded amount")}>
              {formatCurrency(
                transaction.amountRefunded,
                transaction.currency,
              )}
            </Detail>
            <Detail label={t("Customer ID")}>
              {transaction.customer?.id || "—"}
            </Detail>
          </dl>

          {transaction.description && (
            <Detail label={t("Description")}>{transaction.description}</Detail>
          )}
          {transaction.failureMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
              {transaction.failureCode
                ? `${transaction.failureCode}: `
                : ""}
              {transaction.failureMessage}
            </div>
          )}
          {transaction.receiptUrl && (
            <a
              href={transaction.receiptUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              {t("Open Stripe receipt")} <ExternalLink size={16} />
            </a>
          )}
        </div>
      </section>
    </div>
  );
};

const Detail = ({ label, children }) => (
  <div className="min-w-0">
    <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
    <dd className="mt-1 wrap-break-word text-sm font-medium text-gray-800 dark:text-gray-200">
      {children}
    </dd>
  </div>
);

export default function AdminTransactions() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [cursorStack, setCursorStack] = useState([null]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const page = cursorStack.length;
  const startingAfter = cursorStack[page - 1];

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminTransactions({
    search,
    status,
    from,
    to,
    startingAfter,
  });
  const {
    data: transactionStatsData,
    isLoading: isStatsLoading,
    isFetching: isStatsFetching,
    isError: isStatsError,
    error: statsError,
    refetch: refetchStats,
  } = useAdminTransactionStats();
  const result = data?.data?.data;
  const allTimeStats = transactionStatsData?.data?.data;
  const transactions = result?.transactions || EMPTY_TRANSACTIONS;
  const stats = useMemo(
    () => ({
      total: transactions.length,
      succeeded: transactions.filter((item) => item.status === "succeeded")
        .length,
      failed: transactions.filter((item) => item.status === "failed").length,
      refunded: transactions.filter((item) =>
        ["refunded", "partially_refunded"].includes(item.status),
      ).length,
    }),
    [transactions],
  );
  const pagination = {
    page,
    totalPages: result?.hasMore ? page + 1 : page,
    total: null,
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setFrom("");
    setTo("");
    setCursorStack([null]);
  };

  return (
    <div className="min-h-full">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
            <CreditCard size={15} />
            Stripe
          </div>
          <h1 className="mt-1 text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">
            {t("Transactions")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("Review Stripe payments, failures, refunds, and receipts.")}
          </p>
        </div>
        <div className="flex flex-row gap-2">
          <button
            type="button"
            onClick={() => exportTransactions(transactions, t)}
            disabled={!transactions.length}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#171b23] dark:text-gray-300 dark:hover:bg-white/5"
          >
            <Download size={16} />
            {t("Export page")}
          </button>
          <button
            type="button"
            onClick={() => {
              refetch();
              refetchStats();
            }}
            disabled={isFetching || isStatsFetching}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={16}
              className={isFetching || isStatsFetching ? "animate-spin" : ""}
            />
            {t("Refresh")}
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title={t("Total transactions")}
          value={isStatsLoading || isStatsError ? "—" : allTimeStats?.total ?? "—"}
          description={t("All-time Stripe charges")}
          icon={Receipt}
          tone="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        />
        <StatCard
          title={t("Successful transactions")}
          value={isStatsLoading || isStatsError ? "—" : allTimeStats?.succeeded ?? "—"}
          description={t("All-time successful payments")}
          icon={CheckCircle2}
          tone="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        />
        <StatCard
          title={t("Failed")}
          value={isLoading ? "—" : stats.failed}
          description={t("Failed payments on this page")}
          icon={XCircle}
          tone="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        />
        <StatCard
          title={t("Refunded")}
          value={isLoading ? "—" : stats.refunded}
          description={t("Full or partial refunds on this page")}
          icon={RotateCcw}
          tone="bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"
        />
      </div>

      {isStatsError && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
          <AlertCircle size={15} />
          {statsError?.response?.data?.message ||
            statsError?.message ||
            "Could not load all-time transaction totals."}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#11161f]">
        <div className="border-b border-gray-200 p-4 dark:border-white/10 sm:p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(230px,1fr)_180px_170px_170px_auto]">
            <label className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-white/10 dark:bg-white/5">
              <Search size={16} className="shrink-0 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCursorStack([null]);
                }}
                placeholder={t("Search customer, email, charge ID...")}
                className="min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400 dark:text-white"
              />
            </label>

            <CustomSelect
              size="sm"
              rounded="rounded-lg"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                setCursorStack([null]);
              }}
              placeholder={t("All statuses")}
              options={[
                { value: "all", label: t("All statuses") },
                { value: "succeeded", label: t("Succeeded") },
                { value: "failed", label: t("Failed") },
                { value: "pending", label: t("Pending") },
                { value: "refunded", label: t("Refunded") },
                {
                  value: "partially_refunded",
                  label: t("Partially refunded"),
                },
              ]}
              className="w-full dark:border-white/10 dark:bg-[#171b23] sm:w-auto"
            />

            <label className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-white/10 dark:bg-[#171b23]">
              <CalendarDays size={15} className="shrink-0 text-gray-400" />
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(event) => {
                  setFrom(event.target.value);
                  setCursorStack([null]);
                }}
                aria-label={t("From date")}
                className="min-w-0 w-full bg-transparent text-sm text-gray-700 outline-none dark:text-gray-200"
              />
            </label>

            <label className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 dark:border-white/10 dark:bg-[#171b23]">
              <CalendarDays size={15} className="shrink-0 text-gray-400" />
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(event) => {
                  setTo(event.target.value);
                  setCursorStack([null]);
                }}
                aria-label={t("To date")}
                className="min-w-0 w-full bg-transparent text-sm text-gray-700 outline-none dark:text-gray-200"
              />
            </label>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!search && status === "all" && !from && !to}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:text-gray-300 dark:hover:bg-white/5"
            >
              <X size={15} />
              {t("Clear")}
            </button>
          </div>
        </div>

        {isError && !data && (
          <div className="m-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-500/20 dark:bg-red-500/10">
            <AlertCircle size={19} className="mt-0.5 shrink-0 text-red-500" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                {t("Could not load Stripe transactions")}
              </p>
              <p className="mt-1 wrap-break-word text-xs text-red-600 dark:text-red-300">
                {error?.response?.data?.message ||
                  error?.message ||
                  t("Please try again.")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="text-sm font-semibold text-red-700 dark:text-red-400"
            >
              Retry
            </button>
          </div>
        )}

        {isError && data && (
          <div className="mx-4 mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertCircle size={15} />
            Could not refresh the list. Showing the last loaded results.
          </div>
        )}

        <div className="relative min-h-56" aria-busy={isFetching}>
          {isFetching && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-20 flex min-h-56 items-center justify-center bg-white/75 backdrop-blur-[1px] dark:bg-[#11161f]/75"
            >
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-lg dark:border-white/10 dark:bg-[#171b23] dark:text-gray-200">
                <RefreshCw size={17} className="animate-spin text-blue-600" />
                {t("Loading transactions...")}
              </div>
            </div>
          )}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-245 text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:border-white/10 dark:bg-white/3 dark:text-gray-400">
                  <th className="px-5 py-3.5">{t("Transaction")}</th>
                  <th className="px-5 py-3.5">{t("Customer")}</th>
                  <th className="px-5 py-3.5">{t("Payment method")}</th>
                  <th className="px-5 py-3.5">{t("Date")}</th>
                  <th className="px-5 py-3.5">{t("Status")}</th>
                  <th className="px-5 py-3.5 text-right">{t("Amount")}</th>
                  <th className="px-5 py-3.5 text-right">{t("Details")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <tr key={index}>
                        {Array.from({ length: 7 }).map((__, cell) => (
                          <td key={cell} className="px-5 py-5">
                            <div className="h-4 animate-pulse rounded bg-gray-100 dark:bg-white/5" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : transactions.map((transaction) => (
                      <tr
                        key={transaction.id}
                        className="transition hover:bg-gray-50/80 dark:hover:bg-white/3"
                      >
                        <td className="px-5 py-4">
                          <p className="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">
                            {transaction.id}
                          </p>
                          <p className="mt-1 max-w-48 truncate text-xs text-gray-500 dark:text-gray-400">
                            {transaction.description || t("Stripe payment")}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="max-w-48 truncate text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.customer?.businessName ||
                              transaction.customer?.name ||
                              t("Unknown customer")}
                          </p>
                          <p className="mt-1 max-w-48 truncate text-xs text-gray-500 dark:text-gray-400">
                            {transaction.customer?.email || t("No email")}
                          </p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          <PaymentMethod method={transaction.paymentMethod} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-600 dark:text-gray-300">
                          {formatDate(transaction.created)}
                        </td>
                        <td className="px-5 py-4">
                          <TransactionStatus status={transaction.status} />
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-right text-sm font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(transaction.amount, transaction.currency)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedTransaction(transaction)}
                            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-white/10 dark:text-gray-300 dark:hover:text-blue-400"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3 p-3 lg:hidden">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-32 animate-pulse rounded-xl bg-gray-100 dark:bg-white/5"
                  />
                ))
              : transactions.map((transaction) => (
                  <article
                    key={transaction.id}
                    className="rounded-xl border border-gray-200 p-4 dark:border-white/10"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {transaction.customer?.businessName ||
                            transaction.customer?.name ||
                            t("Unknown customer")}
                        </p>
                        <p className="mt-1 truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
                          {transaction.id}
                        </p>
                      </div>
                      <TransactionStatus status={transaction.status} />
                    </div>
                    <div className="mt-4 flex items-end justify-between gap-2">
                      <div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatCurrency(
                            transaction.amount,
                            transaction.currency,
                          )}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.created)}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <PaymentMethod method={transaction.paymentMethod} />
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTransaction(transaction)}
                        className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 dark:border-white/10 dark:text-gray-300"
                      >
                        Details
                      </button>
                    </div>
                  </article>
                ))}
          </div>

          {!isLoading && !isError && transactions.length === 0 && (
            <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
              <span className="rounded-2xl bg-gray-100 p-3 text-gray-500 dark:bg-white/5 dark:text-gray-400">
                <Receipt size={22} />
              </span>
              <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                No transactions found
              </p>
              <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
                Try changing the status, date range, or search terms.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

      </section>

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        currentCount={transactions.length}
        isFetching={isFetching}
        hasMore={result?.hasMore || false}
        onPrevious={() =>
          setCursorStack((current) =>
            current.length > 1 ? current.slice(0, -1) : current,
          )
        }
        onNext={() => {
          if (result?.hasMore && result?.nextCursor) {
            setCursorStack((current) => [...current, result.nextCursor]);
          }
        }}
      />

      {selectedTransaction && (
        <TransactionDetails
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}
