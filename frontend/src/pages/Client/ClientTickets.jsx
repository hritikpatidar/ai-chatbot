import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Edit3,
  Filter,
  Inbox,
  Loader2,
  MessageSquare,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  deleteClientTicket,
  getClientTickets,
  updateClientTicket,
  clearTicketError,
  clearTicketSuccess,
} from "../../redux/features/Ticket/ticketSlice";

import ConfirmModal from "../../components/ClientComponent/ConfirmModal";
import EmptyState from "../../components/ClientComponent/EmptyState";
import { ticketSchema } from "../../utils/validation";

export default function ClientTickets() {
  const dispatch = useDispatch();

  const {
    tickets = [],
    loading,
    updateLoading,
    deleteLoading,
    error,
    updateSuccess,
    deleteSuccess,
  } = useSelector((state) => state?.ClientReducer?.ticketSlice || {});

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [editingTicket, setEditingTicket] = useState(null);
  const [deleteTicket, setDeleteTicket] = useState(null);


  useEffect(() => {
    dispatch(getClientTickets());
  }, [dispatch]);


  useEffect(() => {
    if (updateSuccess || deleteSuccess) {
      const timer = setTimeout(() => {
        dispatch(clearTicketSuccess());
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [updateSuccess, deleteSuccess, dispatch]);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      dispatch(clearTicketError());
    }, 3000);

    return () => clearTimeout(timer);
  }, [error, dispatch]);


  const filteredTickets = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return tickets?.filter((ticket) => {
      const matchesSearch =
        !keyword ||
        ticket?.subject?.toLowerCase().includes(keyword) ||
        ticket?.description?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || ticket?.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || ticket?.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, search, statusFilter, priorityFilter]);


  const handleDelete = async () => {
    if (!deleteTicket?._id) return;

    const result = await dispatch(deleteClientTicket(deleteTicket._id));

    if (deleteClientTicket.fulfilled.match(result)) {
      setDeleteTicket(null);
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const handleEdit = (ticket) => {
    setEditingTicket(ticket);
  };

  return (
    <>
      <div className="min-h-full w-full bg-transparent text-gray-900 dark:text-white">
        <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8">
          {/* =================================================
              HEADER
          ================================================= */}

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex h-11 w-11 shrink-0
                    items-center justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  <Inbox size={22} />
                </div>

                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Tickets
                  </h1>

                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage customer support tickets and requests.
                  </p>
                </div>
              </div>
            </div>

            {/* Total */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                self-start
                rounded-xl
                border border-gray-200
                bg-white
                px-4 py-2.5
                text-sm
                font-medium
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <MessageSquare size={16} className="text-blue-500" />

              <span>
                {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
              </span>
            </div>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div
              className="
                mb-5 flex items-start gap-3
                rounded-xl
                border border-red-200
                bg-red-50
                px-4 py-3
                text-sm text-red-700
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />

              <span>{error}</span>
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {(updateSuccess || deleteSuccess) && (
            <div
              className="
                mb-5 flex items-start gap-3
                rounded-xl
                border border-green-200
                bg-green-50
                px-4 py-3
                text-sm text-green-700
                dark:border-green-500/20
                dark:bg-green-500/10
                dark:text-green-400
              "
            >
              <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

              <span>
                {updateSuccess
                  ? "Ticket updated successfully."
                  : "Ticket deleted successfully."}
              </span>
            </div>
          )}

          {/* =================================================
              FILTERS
          ================================================= */}

          <div
            className="
              mb-5
              rounded-2xl
              border border-gray-200
              bg-white
              p-4
              shadow-sm
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            <div className="flex flex-col gap-3 lg:flex-row">
              {/* Search */}

              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="
                    pointer-events-none
                    absolute left-3 top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tickets..."
                  className="
                    w-full rounded-xl
                    border border-gray-200
                    bg-gray-50
                    py-2.5 pl-10 pr-4
                    text-sm text-gray-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    dark:border-white/10
                    dark:bg-[#0f131b]
                    dark:text-white
                    dark:placeholder:text-gray-500
                  "
                />
              </div>

              {/* Status */}

              <div className="flex items-center gap-2">
                <Filter size={16} className="shrink-0 text-gray-400" />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="
                    w-full rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3 py-2.5
                    text-sm
                    outline-none
                    focus:border-blue-500
                    dark:border-white/10
                    dark:bg-[#0f131b]
                    dark:text-white
                    sm:w-44
                  "
                >
                  <option value="all">All Status</option>

                  <option value="open">Open</option>

                  <option value="in_progress">In Progress</option>

                  <option value="resolved">Resolved</option>

                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Priority */}

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-3 py-2.5
                  text-sm
                  outline-none
                  focus:border-blue-500
                  dark:border-white/10
                  dark:bg-[#0f131b]
                  dark:text-white
                  sm:w-44
                "
              >
                <option value="all">All Priority</option>

                <option value="low">Low</option>

                <option value="medium">Medium</option>

                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div
              className="
                flex min-h-70
                items-center justify-center
                rounded-2xl
                border border-gray-200
                bg-white
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-blue-500" />

                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Loading tickets...
                </span>
              </div>
            </div>
          ) : filteredTickets.length === 0 ? (
            /* =================================================
               EMPTY
            ================================================= */

            <EmptyState
              icon={Inbox}
              title={
                tickets.length === 0
                  ? "No tickets found"
                  : "No matching tickets"
              }
              description={
                tickets.length === 0
                  ? "There are no support tickets available for this client."
                  : "Try changing your search or filter."
              }
            />
          ) : (
            /* =================================================
               TICKETS
            ================================================= */

            <div
              className="
                overflow-hidden
                rounded-2xl
                border border-gray-200
                bg-white
                shadow-sm
                dark:border-white/10
                dark:bg-[#171b23]
              "
            >
              {/* Desktop Header */}

              <div
                className="
                  hidden
                  border-b border-gray-200
                  bg-gray-50
                  px-5 py-3
                  text-xs font-medium
                  text-gray-500
                  dark:border-white/10
                  dark:bg-[#0f131b]
                  dark:text-gray-400
                  md:grid
                  md:grid-cols-[minmax(220px,1fr)_130px_110px_130px_90px]
                  md:gap-4
                "
              >
                <span>Ticket</span>
                <span>Status</span>
                <span>Priority</span>
                <span>Created</span>
                <span className="text-right">Actions</span>
              </div>

              {/* Rows */}

              <div className="divide-y divide-gray-200 dark:divide-white/10">
                {filteredTickets.map((ticket) => (
                  <TicketRow
                    key={ticket._id}
                    ticket={ticket}
                    onEdit={handleEdit}
                    onDelete={setDeleteTicket}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}

      <TicketEditModal
        ticket={editingTicket}
        isOpen={Boolean(editingTicket)}
        onClose={() => setEditingTicket(null)}
        loading={updateLoading}
        dispatch={dispatch}
      />

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <ConfirmModal
        isOpen={Boolean(deleteTicket)}
        onClose={() => {
          if (!deleteLoading) {
            setDeleteTicket(null);
          }
        }}
        onConfirm={handleDelete}
        title="Delete Ticket"
        message={
          deleteTicket
            ? `Are you sure you want to delete "${deleteTicket.subject}"? This action cannot be undone.`
            : "Are you sure you want to delete this ticket?"
        }
        confirmText="Delete Ticket"
        cancelText="Cancel"
        loading={deleteLoading}
        danger
      />
    </>
  );
}

/* =========================================================
   TICKET ROW
========================================================= */

function TicketRow({ ticket, onEdit, onDelete }) {
  return (
    <div
      className="
        px-4 py-4
        transition
        hover:bg-gray-50
        dark:hover:bg-white/[0.02]
        md:px-5
      "
    >
      {/* Desktop */}

      <div
        className="
          hidden
          md:grid
          md:grid-cols-[minmax(220px,1fr)_130px_110px_130px_90px]
          md:items-center
          md:gap-4
        "
      >
        <TicketInfo ticket={ticket} />

        <StatusBadge status={ticket.status} />

        <PriorityBadge priority={ticket.priority} />

        <CreatedDate date={ticket.createdAt} />

        <TicketActions ticket={ticket} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {/* Mobile */}

      <div className="space-y-4 md:hidden">
        <div className="flex items-start justify-between gap-3">
          <TicketInfo ticket={ticket} />

          <TicketActions ticket={ticket} onEdit={onEdit} onDelete={onDelete} />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Created {formatDate(ticket.createdAt)}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   TICKET INFO
========================================================= */

function TicketInfo({ ticket }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2">
        <MessageSquare size={15} className="shrink-0 text-blue-500" />

        <h3
          className="
            truncate
            text-sm
            font-semibold
            text-gray-900
            dark:text-white
          "
          title={ticket?.subject}
        >
          {ticket?.subject || "Untitled Ticket"}
        </h3>
      </div>

      <p
        className="
          mt-1
          line-clamp-2
          text-xs
          leading-5
          text-gray-500
          dark:text-gray-400
        "
      >
        {ticket?.description || "No description"}
      </p>
    </div>
  );
}

/* =========================================================
   ACTIONS
========================================================= */

function TicketActions({ ticket, onEdit, onDelete }) {
  return (
    <div className="flex shrink-0 items-center justify-end gap-1">
      <button
        type="button"
        onClick={() => onEdit(ticket)}
        className="
          rounded-lg
          p-2
          text-gray-500
          transition
          hover:bg-blue-50
          hover:text-blue-600
          dark:text-gray-400
          dark:hover:bg-blue-500/10
          dark:hover:text-blue-400
        "
        title="Edit ticket"
      >
        <Edit3 size={16} />
      </button>

      <button
        type="button"
        onClick={() => onDelete(ticket)}
        className="
          rounded-lg
          p-2
          text-gray-500
          transition
          hover:bg-red-50
          hover:text-red-600
          dark:text-gray-400
          dark:hover:bg-red-500/10
          dark:hover:text-red-400
        "
        title="Delete ticket"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const config = {
    open: {
      label: "Open",
      className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      icon: Clock3,
    },

    in_progress: {
      label: "In Progress",
      className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
      icon: Loader2,
    },

    resolved: {
      label: "Resolved",
      className: "bg-green-500/10 text-green-600 dark:text-green-400",
      icon: CheckCircle2,
    },

    closed: {
      label: "Closed",
      className: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
      icon: X,
    },
  };

  const item = config[status] || config.open;

  const Icon = item.icon;

  return (
    <span
      className={`
        inline-flex
        w-fit
        items-center
        gap-1.5
        rounded-full
        px-2.5 py-1
        text-xs font-medium
        ${item.className}
      `}
    >
      <Icon size={13} />

      {item.label}
    </span>
  );
}

/* =========================================================
   PRIORITY BADGE
========================================================= */

function PriorityBadge({ priority }) {
  const config = {
    low: "bg-gray-500/10 text-gray-600 dark:text-gray-400",
    medium: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    high: "bg-red-500/10 text-red-600 dark:text-red-400",
  };

  return (
    <span
      className={`
        inline-flex
        w-fit
        rounded-full
        px-2.5 py-1
        text-xs font-medium capitalize
        ${config[priority] || config.medium}
      `}
    >
      {priority || "medium"}
    </span>
  );
}


function CreatedDate({ date }) {
  return (
    <span className="text-xs text-gray-500 dark:text-gray-400">
      {formatDate(date)}
    </span>
  );
}


function TicketEditModal({ ticket, isOpen, onClose, loading, dispatch }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ticketSchema),

    defaultValues: {
      subject: "",
      description: "",
      status: "open",
      priority: "medium",
    },
  });

  useEffect(() => {
    if (ticket) {
      reset({
        subject: ticket.subject || "",
        description: ticket.description || "",
        status: ticket.status || "open",
        priority: ticket.priority || "medium",
      });
    }
  }, [ticket, reset]);

  if (!isOpen || !ticket) {
    return null;
  }

  const onSubmit = async (data) => {
    const result = await dispatch(
      updateClientTicket({
        ticketId: ticket._id,
        data,
      }),
    );

    if (updateClientTicket.fulfilled.match(result)) {
      onClose();
    }
  };

  const inputClass = `
    w-full rounded-xl
    border border-gray-200
    bg-white
    px-4 py-3
    text-sm text-gray-900
    outline-none transition
    focus:border-blue-500
    focus:ring-2 focus:ring-blue-500/10
    dark:border-white/10
    dark:bg-[#0f131b]
    dark:text-white
    dark:placeholder:text-gray-500
  `;

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/50
        px-4 py-5
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <div
        className="
          max-h-[90vh]
          w-full max-w-2xl
          overflow-y-auto
          rounded-2xl
          border border-gray-200
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        {/* Header */}

        <div
          className="
            sticky top-0 z-10
            flex items-center
            justify-between
            border-b border-gray-200
            bg-white
            px-5 py-4
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div>
            <h2 className="text-base font-semibold">Edit Ticket</h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Update ticket information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-lg p-2
              text-gray-500
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-white/10
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-5">
          {/* Subject */}

          <div>
            <label className="mb-2 block text-sm font-medium">Subject</label>

            <input
              {...register("subject")}
              placeholder="Ticket subject"
              className={inputClass}
            />

            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Description */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              {...register("description")}
              rows={6}
              placeholder="Ticket description"
              className={inputClass}
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Status + Priority */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">Status</label>

              <select {...register("status")} className={inputClass}>
                <option value="open">Open</option>

                <option value="in_progress">In Progress</option>

                <option value="resolved">Resolved</option>

                <option value="closed">Closed</option>
              </select>

              {errors.status && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Priority</label>

              <select {...register("priority")} className={inputClass}>
                <option value="low">Low</option>

                <option value="medium">Medium</option>

                <option value="high">High</option>
              </select>

              {errors.priority && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.priority.message}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}

          <div
            className="
              flex flex-col-reverse gap-3
              border-t border-gray-200
              pt-5
              sm:flex-row
              sm:justify-end
              dark:border-white/10
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                rounded-xl
                border border-gray-200
                px-5 py-2.5
                text-sm font-medium
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
              type="submit"
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5 py-2.5
                text-sm font-medium
                text-white
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading && <Loader2 size={16} className="animate-spin" />}

              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function formatDate(date) {
  if (!date) return "-";

  try {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "-";
  }
}
