import { useState } from "react";
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Search,
  Edit2,
  Trash2,
  X,
  Loader2,
  Inbox,
  AlertCircle,
} from "lucide-react";

import { useQueryClient } from "@tanstack/react-query";

import useClientTickets from "../../hooks/Client/useClientTickets";

import {
  updateClientTicketService,
  deleteClientTicketService,
} from "../../service/Client/ticketServices";
import ConfirmModal from "../../components/ClientComponent/ConfirmModal";
import Pagination from "../../components/common/Pagination";

export default function ClientTickets() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const limit = 10;

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const [editingTicket, setEditingTicket] = useState(null);

  const [editStatus, setEditStatus] = useState("");
  const [editPriority, setEditPriority] = useState("");

  const [deleteTicket, setDeleteTicket] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  /* =========================================================
     REACT QUERY
  ========================================================= */

  const { data, isLoading, isFetching, isError, error, refetch } =
    useClientTickets({
      page,
      limit,
      status,
      priority,
    });

  const tickets = data?.data?.tickets || [];
  const pagination = {
    page: data?.data?.page || page,
    limit: data?.data?.limit || limit,
    total: data?.data?.total || 0,
    totalPages: data?.data?.totalPages || 1,
  };

  const filteredTickets = tickets.filter((ticket) => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    return (
      ticket?.subject?.toLowerCase().includes(searchText) ||
      ticket?.title?.toLowerCase().includes(searchText) ||
      ticket?.description?.toLowerCase().includes(searchText) ||
      ticket?.status?.toLowerCase().includes(searchText) ||
      ticket?.priority?.toLowerCase().includes(searchText)
    );
  });

  /* =========================================================
     STATUS FILTER
  ========================================================= */

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  /* =========================================================
     PRIORITY FILTER
  ========================================================= */

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
    setPage(1);
  };

  /* =========================================================
     PAGINATION
  ========================================================= */

  const handlePreviousPage = () => {
    if (isFetching || page <= 1) {
      return;
    }

    setPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (isFetching || page >= pagination.totalPages) {
      return;
    }

    setPage((prev) => prev + 1);
  };

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh = () => {
    refetch();
  };

  /* =========================================================
     EDIT OPEN
  ========================================================= */

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);

    setEditStatus(ticket?.status || "open");

    setEditPriority(ticket?.priority || "medium");
  };

  /* =========================================================
     CLOSE EDIT MODAL
  ========================================================= */

  const closeEditModal = () => {
    if (actionLoading) {
      return;
    }

    setEditingTicket(null);
    setEditStatus("");
    setEditPriority("");
  };

  /* =========================================================
     UPDATE TICKET
  ========================================================= */

  const handleUpdate = async () => {
    if (!editingTicket?._id) {
      return;
    }

    try {
      setActionLoading(true);

      await updateClientTicketService(editingTicket._id, {
        status: editStatus,
        priority: editPriority,
      });

      setEditingTicket(null);

      setEditStatus("");
      setEditPriority("");

      /*
       * Current query + all clientTickets queries invalidate honge.
       */
      await queryClient.invalidateQueries({
        queryKey: ["clientTickets"],
      });
    } catch (error) {
      console.error("Ticket update failed:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update ticket",
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     DELETE MODAL OPEN
  ========================================================= */

  const handleDelete = (ticket) => {
    if (!ticket?._id) {
      return;
    }

    setDeleteTicket(ticket);
  };

  /* =========================================================
     CLOSE DELETE MODAL
  ========================================================= */

  const closeDeleteModal = () => {
    if (actionLoading) {
      return;
    }

    setDeleteTicket(null);
  };

  /* =========================================================
     DELETE TICKET
  ========================================================= */

  const confirmDelete = async () => {
    if (!deleteTicket?._id) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteClientTicketService(deleteTicket._id);

      setDeleteTicket(null);

      /*
       * Agar current page par sirf ek ticket tha
       * aur page > 1 hai to previous page par chale jayenge.
       */
      if (tickets.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }

      await queryClient.invalidateQueries({
        queryKey: ["clientTickets"],
      });
    } catch (error) {
      console.error("Ticket delete failed:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete ticket",
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 size={22} className="animate-spin text-blue-600" />

          <span className="text-sm text-gray-500 dark:text-gray-400">
            Loading tickets...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-6 max-w-7xl px-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />

            <p className="text-sm">
              {error?.message || "Failed to fetch tickets."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full w-full bg-transparent text-gray-900 dark:text-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Tickets</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage customer support tickets and requests.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isFetching}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                hover:border-blue-500
                hover:text-blue-600
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-gray-200
              "
            >
              <RefreshCw
                size={16}
                className={isFetching ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>

          <div
            className="
              mb-5
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* SEARCH */}

              <div className="relative flex-1">
                <Search
                  size={17}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tickets..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-50
                    py-2.5
                    pl-10
                    pr-4
                    text-sm
                    outline-none
                    focus:border-blue-500
                    dark:border-white/10
                    dark:bg-[#0f131b]
                    dark:text-white
                  "
                />
              </div>

              {/* STATUS */}

              <select
                value={status}
                onChange={handleStatusChange}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                  dark:border-white/10
                  dark:bg-[#0f131b]
                  dark:text-white
                  sm:w-44
                "
              >
                <option value="">All Status</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              {/* PRIORITY */}

              <select
                value={priority}
                onChange={handlePriorityChange}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                  dark:border-white/10
                  dark:bg-[#0f131b]
                  dark:text-white
                  sm:w-44
                "
              >
                <option value="">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-gray-200
              bg-white
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            {filteredTickets.length === 0 ? (
              <div className="flex min-h-75 flex-col items-center justify-center px-5 text-center">
                <Inbox size={40} className="text-gray-400" />

                <h3 className="mt-4 text-base font-semibold">
                  No tickets found
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  No tickets match your search or filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-200">
                  <thead>
                    <tr
                      className="
                        border-b
                        border-gray-200
                        bg-gray-50
                        dark:border-white/10
                        dark:bg-white/3
                      "
                    >
                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Ticket
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Status
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Priority
                      </th>

                      <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Created
                      </th>

                      <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredTickets.map((ticket) => (
                      <tr
                        key={ticket._id}
                        className="
                          border-b
                          border-gray-100
                          last:border-0
                          hover:bg-gray-50
                          dark:border-white/5
                          dark:hover:bg-white/3
                        "
                      >
                        {/* TICKET */}

                        <td className="px-5 py-4">
                          <div className="max-w-87.5">
                            <p className="truncate text-sm font-medium">
                              {ticket?.subject ||
                                ticket?.title ||
                                "Untitled Ticket"}
                            </p>

                            <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                              {ticket?.description || "No description"}
                            </p>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-4">
                          <StatusBadge status={ticket?.status} />
                        </td>

                        {/* PRIORITY */}

                        <td className="px-5 py-4">
                          <PriorityBadge priority={ticket?.priority} />
                        </td>

                        {/* CREATED */}

                        <td className="px-5 py-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {ticket?.createdAt
                              ? new Date(ticket.createdAt).toLocaleDateString()
                              : "—"}
                          </span>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {/* EDIT */}

                            <button
                              type="button"
                              onClick={() => handleEdit(ticket)}
                              disabled={actionLoading}
                              title="Edit Ticket"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-gray-200
                                text-gray-600
                                hover:bg-gray-100
                                hover:text-blue-600
                                disabled:opacity-50
                                dark:border-white/10
                                dark:text-gray-300
                                dark:hover:bg-white/10
                              "
                            >
                              <Edit2 size={15} />
                            </button>

                            {/* DELETE */}

                            <button
                              type="button"
                              onClick={() => handleDelete(ticket)}
                              disabled={actionLoading}
                              title="Delete Ticket"
                              className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-red-200
                                text-red-500
                                hover:bg-red-50
                                disabled:opacity-50
                                dark:border-red-500/20
                                dark:hover:bg-red-500/10
                              "
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            currentItems={tickets.length}
            isFetching={isFetching}
            itemName="tickets"
            onPrevious={() => {
              setPage((prev) => Math.max(prev - 1, 1));
            }}
            onNext={() => {
              setPage((prev) => Math.min(prev + 1, pagination.totalPages));
            }}
          />
        </div>
      </div>

      {editingTicket && (
        <div
          className="
            fixed
            inset-0
            z-100
            flex
            items-center
            justify-center
            bg-black/50
            px-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !actionLoading) {
              closeEditModal();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-6
              shadow-2xl
              dark:border-white/10
              dark:bg-[#171b23]
            "
            onMouseDown={(event) => event.stopPropagation()}
          >
            {/* HEADER */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Edit Ticket</h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Update ticket status and priority.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEditModal}
                disabled={actionLoading}
                className="
                  rounded-lg
                  p-2
                  text-gray-500
                  hover:bg-gray-100
                  dark:text-gray-400
                  dark:hover:bg-white/10
                "
              >
                <X size={18} />
              </button>
            </div>

            {/* STATUS */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Status</label>

              <select
                value={editStatus}
                onChange={(event) => setEditStatus(event.target.value)}
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
                  focus:border-blue-500
                  dark:border-white/10
                  dark:bg-[#0f131b]
                  dark:text-white
                "
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {/* PRIORITY */}

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">Priority</label>

              <select
                value={editPriority}
                onChange={(event) => setEditPriority(event.target.value)}
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
                  focus:border-blue-500
                  dark:border-white/10
                  dark:bg-[#0f131b]
                  dark:text-white
                "
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* BUTTONS */}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeEditModal}
                disabled={actionLoading}
                className="
                  rounded-xl
                  border
                  border-gray-200
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-700
                  hover:bg-gray-50
                  disabled:opacity-50
                  dark:border-white/10
                  dark:text-gray-300
                  dark:hover:bg-white/5
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                disabled={actionLoading}
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-blue-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {actionLoading && (
                  <Loader2 size={16} className="animate-spin" />
                )}

                {actionLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTicket)}
        title="Delete Ticket"
        message={
          <>
            Are you sure you want to delete{" "}
            <strong>
              {deleteTicket?.subject || deleteTicket?.title || "this ticket"}
            </strong>
            ?
            <br />
            <span className="text-xs">This action cannot be undone.</span>
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={actionLoading}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  if (normalizedStatus === "open") {
    classes = "bg-blue-500/10 text-blue-600 dark:text-blue-400";
  }
  if (normalizedStatus === "in_progress" || normalizedStatus === "pending") {
    classes = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
  }
  if (normalizedStatus === "resolved") {
    classes = "bg-green-500/10 text-green-600 dark:text-green-400";
  }
  if (normalizedStatus === "closed") {
    classes = "bg-red-500/10 text-red-600 dark:text-red-400";
  }
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-medium
        ${classes}
      `}
    >
      {status || "Unknown"}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const normalizedPriority = priority?.toLowerCase();
  let classes = "bg-gray-500/10 text-gray-600 dark:text-gray-400";
  if (normalizedPriority === "low") {
    classes = "bg-green-500/10 text-green-600 dark:text-green-400";
  }
  if (normalizedPriority === "medium") {
    classes = "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
  }
  if (normalizedPriority === "high") {
    classes = "bg-red-500/10 text-red-600 dark:text-red-400";
  }
  return (
    <span
      className={`
        inline-flex
        rounded-full
        px-2.5
        py-1
        text-[11px]
        font-medium
        ${classes}
      `}
    >
      {priority || "Unknown"}
    </span>
  );
}
