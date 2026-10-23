import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  Mail,
  Ticket,
  Clock3,
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  useSupportTickets,
  useSupportTicketDetails,
  useReplyToSupportTicket,
  useUpdateSupportTicketStatus,
} from "../../hooks/Admin/useSupportTickets";
import Pagination from "../../components/common/Pagination";
import CustomSelect from "../../components/common/CustomSelect";

const statusStyles = {
  Open: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
  "In Progress":
    "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  Resolved:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  Closed: "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300",
};

const priorityStyles = {
  High: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  Low: "bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-gray-300",
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Something went wrong";

export default function SupportTickets() {
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [page, setPage] = useState(1);

  const [reply, setReply] = useState("");
  const [replyStatus, setReplyStatus] = useState("In Progress");

  const params = {
    page,
    limit: 10,
    ...(search.trim() && { search: search.trim() }),
    ...(statusFilter && { status: statusFilter }),
    ...(priorityFilter && { priority: priorityFilter }),
  };

  const {
    data: listResponse,
    isLoading,
    isFetching,
    refetch,
  } = useSupportTickets(params);

  const {
    data: detailResponse,
    isLoading: detailLoading,
    isFetching: detailFetching,
  } = useSupportTicketDetails(selectedTicketId, Boolean(selectedTicketId));

  const replyMutation = useReplyToSupportTicket();
  const statusMutation = useUpdateSupportTicketStatus();
  const tickets = listResponse?.data?.tickets || [];
  const pagination = listResponse?.data?.pagination || {
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 10,
  };

  const selectedTicket = detailResponse?.data?.ticket || null;

  const totalPages = Math.max(1, pagination.totalPages || 1);
  const busy = replyMutation.isPending || statusMutation.isPending;

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (!selectedTicket) return;

    setReplyStatus(
      selectedTicket.status === "Closed" || selectedTicket.status === "Resolved"
        ? "In Progress"
        : selectedTicket.status,
    );
  }, [selectedTicket?._id, selectedTicket?.status]);

  const openTicket = (ticket) => {
    setReply("");
    setSelectedTicketId(ticket._id);
  };

  const closeTicket = () => {
    if (busy) return;
    setSelectedTicketId(null);
    setReply("");
  };

  const sendReply = (event) => {
    event.preventDefault();

    if (!selectedTicketId || !reply.trim() || replyMutation.isPending) return;

    replyMutation.mutate(
      {
        ticketId: selectedTicketId,
        payload: {
          message: reply.trim(),
          status: replyStatus,
        },
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Reply emailed to client");
          setReply("");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  const updateStatus = (status) => {
    if (!selectedTicketId || statusMutation.isPending) return;

    statusMutation.mutate(
      {
        ticketId: selectedTicketId,
        payload: { status },
      },
      {
        onSuccess: (data) => {
          toast.success(data?.message || "Ticket status updated");
        },
        onError: (error) => {
          toast.error(getErrorMessage(error));
        },
      },
    );
  };

  const handleSearchChange = (value) => {
    setPage(1);
    setSearch(value);
  };

  const handleStatusFilterChange = (value) => {
    setPage(1);
    setStatusFilter(value);
  };

  const handlePriorityFilterChange = (value) => {
    setPage(1);
    setPriorityFilter(value);
  };

  const handlePreviousPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => Math.min(pagination.totalPages, prev + 1));
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage client requests and respond by email.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            refetch().catch((error) => toast.error(getErrorMessage(error)))
          }
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-gray-50 disabled:opacity-60 dark:border-white/10 dark:bg-[#171b23] dark:hover:bg-white/5"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          icon={<Ticket size={19} />}
          label="Total matching tickets"
          value={pagination.total}
        />

        <SummaryCard
          icon={<Clock3 size={19} />}
          label="High priority on this page"
          value={tickets.filter((ticket) => ticket.priority === "High").length}
        />

        <SummaryCard
          icon={<Mail size={19} />}
          label="Open on this page"
          value={tickets.filter((ticket) => ticket.status === "Open").length}
        />
      </div>

      {/* Filters */}
      <div className="mb-5 grid grid-cols-1 gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#171b23] md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder="Search ticket, email, subject..."
            className="w-full rounded-xl border border-gray-200 bg-transparent py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500 dark:border-white/10"
          />
        </div>

        <CustomSelect
          size="sm"
          rounded="rounded-lg"
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          placeholder="All Status"
          options={[
            {
              value: "",
              label: "All Status",
            },
            {
              value: "Open",
              label: "Open",
            },
            {
              value: "In Progress",
              label: "In Progress",
            },
            {
              value: "Resolved",
              label: "Resolved",
            },
            {
              value: "Closed",
              label: "Closed",
            },
          ]}
          className="w-full sm:w-auto dark:border-white/10 dark:bg-[#0f131a] dark:text-gray-300"
        />

        <CustomSelect
          size="sm"
          rounded="rounded-lg"
          value={priorityFilter}
          onChange={(e) => handlePriorityFilterChange(e.target.value)}
          placeholder="All Status"
          options={[
            {
              value: "",
              label: "All priorities",
            },
            {
              value: "Low",
              label: "Low",
            },
            {
              value: "High",
              label: "High",
            },
          ]}
          className="w-full sm:w-auto dark:border-white/10 dark:bg-[#0f131a] dark:text-gray-300"
        />
        {/* <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          {pagination.total} ticket(s) found
        </p> */}
      </div>

      {/* Ticket list */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#171b23]">
        {isLoading ? (
          <LoadingState />
        ) : tickets.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-212.5 text-left text-sm">
                <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:border-white/10 dark:bg-white/3">
                  <tr>
                    <th className="px-5 py-4">Ticket</th>
                    <th className="px-5 py-4">Client</th>
                    <th className="px-5 py-4">Plan / Priority</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Created</th>
                    <th className="px-5 py-4">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {tickets.map((ticket) => (
                    <tr
                      key={ticket._id}
                      className={`transition hover:bg-gray-50 dark:hover:bg-white/3 ${
                        selectedTicketId === ticket._id
                          ? "bg-blue-50/70 dark:bg-blue-500/6"
                          : ""
                      }`}
                    >
                      <td className="px-5 py-4">
                        <p className="font-semibold">{ticket.ticketNumber}</p>
                        <p className="mt-1 max-w-56 truncate text-gray-500">
                          {ticket.subject}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium">
                          {ticket.clientName || "Client"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {ticket.clientEmail}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 whitespace-nowrap">
                          <p>{ticket.planName}</p>

                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                              priorityStyles[ticket.priority] ||
                              priorityStyles.Low
                            }`}
                          >
                            {ticket.priority}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            statusStyles[ticket.status] || statusStyles.Open
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => openTicket(ticket)}
                          className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold hover:border-blue-500 hover:text-blue-600 dark:border-white/10 dark:hover:text-blue-400"
                        >
                          View ticket
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      {/* Pagination */}

      <Pagination
        page={pagination.page || page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        currentCount={tickets.length}
        isFetching={isFetching}
        onPrevious={handlePreviousPage}
        onNext={handleNextPage}
      />
      {/* Ticket details modal */}
      {selectedTicketId && (
        <div
          className="fixed inset-0 z-48 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeTicket();
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#171b23]">
            <div className="flex items-start justify-between gap-4 border-b border-gray-200 p-5 dark:border-white/10">
              <div className="min-w-0">
                {selectedTicket ? (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                      {selectedTicket.ticketNumber}
                    </p>
                    <h2 className="mt-1 wrap-break-word text-lg font-bold">
                      {selectedTicket.subject}
                    </h2>
                    <p className="mt-1 break-all text-sm text-gray-500">
                      {selectedTicket.clientName} · {selectedTicket.clientEmail}
                    </p>
                  </>
                ) : (
                  <h2 className="text-lg font-bold">Ticket details</h2>
                )}
              </div>

              <button
                type="button"
                onClick={closeTicket}
                aria-label="Close ticket"
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {detailLoading || !selectedTicket ? (
                <LoadingState />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        priorityStyles[selectedTicket.priority] ||
                        priorityStyles.Low
                      }`}
                    >
                      {selectedTicket.priority} priority
                    </span>

                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs dark:bg-white/10">
                      {selectedTicket.planName} plan
                    </span>

                    <span className="text-xs text-gray-500">
                      Created {formatDate(selectedTicket.createdAt)}
                    </span>
                  </div>

                  {detailFetching && (
                    <p className="mt-2 text-xs text-gray-500">
                      Refreshing ticket details…
                    </p>
                  )}

                  <div className="mt-5 rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <h3 className="text-sm font-semibold">
                      Client description
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {selectedTicket.description}
                    </p>
                  </div>

                  <div className="mt-6">
                    <h3 className="mb-3 font-semibold">Reply history</h3>

                    {(selectedTicket.replies || []).length === 0 ? (
                      <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500 dark:bg-white/3">
                        No replies yet.
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {selectedTicket.replies.map((item) => (
                          <div
                            key={item._id || item.sentAt}
                            className={`rounded-xl border p-4 ${
                              item.sender === "admin"
                                ? "border-blue-200 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-500/6"
                                : "border-gray-200 dark:border-white/10"
                            }`}
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold">
                                {item.sender === "admin" ? "Admin" : "Client"}
                              </span>
                              <span className="text-xs text-gray-500">
                                {formatDate(item.sentAt)}
                              </span>
                            </div>
                            <p className="mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-6">
                              {item.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <label className="mb-2 block text-sm font-semibold">
                      Ticket status
                    </label>
                    <CustomSelect
                      size="sm"
                      rounded="rounded-lg"
                      disabled={busy}
                      value={selectedTicket.status}
                      onChange={(e) => updateStatus(e.target.value)}
                      placeholder="All Status"
                      options={[
                        {
                          value: "Open",
                          label: "Open",
                        },
                        {
                          value: "In Progress",
                          label: "In Progress",
                        },
                        {
                          value: "Resolved",
                          label: "Resolved",
                        },
                        {
                          value: "Closed",
                          label: "Closed",
                        },
                      ]}
                      className="w-full sm:w-auto dark:border-white/10 dark:bg-[#0f131a] dark:text-gray-300"
                    />
                  </div>

                  <form onSubmit={sendReply} className="mt-6">
                    <label className="mb-2 block text-sm font-semibold">
                      Reply to client by email
                    </label>

                    <textarea
                      value={reply}
                      onChange={(event) => setReply(event.target.value)}
                      placeholder="Write your reply here..."
                      rows={5}
                      maxLength={10000}
                      required
                      className="w-full resize-y rounded-xl border border-gray-200 bg-white p-3 text-sm outline-none placeholder:text-gray-400 focus:border-blue-500 dark:border-white/10 dark:bg-[#11151d]"
                    />

                    <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <CustomSelect
                        size="sm"
                        rounded="rounded-lg"
                        value={replyStatus}
                        onChange={(e) => setReplyStatus(e.target.value)}
                        placeholder="All Status"
                        options={[
                          {
                            value: "Open",
                            label: "Open",
                          },
                          {
                            value: "In Progress",
                            label: "In Progress",
                          },
                          {
                            value: "Resolved",
                            label: "Resolved",
                          },
                          {
                            value: "Closed",
                            label: "Closed",
                          },
                        ]}
                        className="w-full sm:w-auto dark:border-white/10 dark:bg-[#0f131a] dark:text-gray-300"
                      />
                      <button
                        type="submit"
                        disabled={replyMutation.isPending || !reply.trim()}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {replyMutation.isPending ? (
                          <LoaderCircle size={16} className="animate-spin" />
                        ) : (
                          <Send size={16} />
                        )}
                        {replyMutation.isPending ? "Sending..." : "Send Reply"}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-white/10 dark:bg-[#171b23]">
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
        {icon}
        {label}
      </div>
      <p className="mt-3 text-2xl font-bold">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-56 items-center justify-center">
      <LoaderCircle className="animate-spin text-blue-500" size={28} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center px-5 text-center">
      <Ticket size={32} className="text-gray-400" />
      <h3 className="mt-3 font-semibold">No tickets found</h3>
      <p className="mt-1 text-sm text-gray-500">
        Try changing the search or filters.
      </p>
    </div>
  );
}
