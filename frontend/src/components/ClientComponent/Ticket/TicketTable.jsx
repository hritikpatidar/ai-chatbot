import {
  Edit,
  Trash2,
  Ticket,
  Clock3,
  AlertCircle,
  Inbox,
  Edit2,
  Eye,
  Lock,
  ArrowUpRight,
} from "lucide-react";

import ActionButton from "../../common/ActionButton";
import StatusBadge from "../../common/StatusBadge";
import { useSelector } from "react-redux";

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TicketTable({
  tickets = [],
  loading = false,
  onEdit,
  onDelete,
  onUpdatePlan,
}) {
  const { client } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const hasActivePlan = Boolean(client?.active_plan);
  
  if (loading) {
    return (
      <div
        className="
          overflow-hidden
          rounded-2xl
          border border-gray-200
          bg-white
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        <div className="space-y-4 p-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="
                h-14
                animate-pulse
                rounded-xl
                bg-gray-100
                dark:bg-white/5
              "
            />
          ))}
        </div>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div
        className="
          flex
          min-h-75
          flex-col
          items-center
          justify-center
          rounded-2xl
          border
          border-gray-200
          bg-white
          px-6
          py-10
          text-center
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        <div
          className="
            mb-4
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-blue-500/10
            text-blue-500
            dark:text-blue-400
          "
        >
          <Inbox size={28} />
        </div>

        <h3
          className="
            text-base
            font-semibold
            text-gray-900
            dark:text-white
          "
        >
          No tickets found
        </h3>

        <p
          className="
            mt-1
            max-w-sm
            text-xs
            text-gray-500
            dark:text-gray-400
          "
        >
          No tickets match your search or filters.
        </p>
      </div>
    );
  }

  return (
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
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-225">
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
                Customer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Contact
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Status
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
            {tickets.map((ticket) => (
              <tr
                key={ticket._id}
                className="
                  border-b
                  border-gray-100
                  transition-colors
                  last:border-0
                  hover:bg-gray-50
                  dark:border-white/5
                  dark:hover:bg-white/3
                "
              >
                {/* Ticket */}

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-500/10
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      <Ticket size={18} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          max-w-70
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                          dark:text-white
                        "
                        title={ticket.subject}
                      >
                        {ticket.subject || "Untitled Ticket"}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-gray-500
                          dark:text-gray-400
                        "
                      >
                        #{ticket._id?.slice(-8) || "--------"}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Customer */}
                <td className="px-5 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {ticket.guestKeyId?.fullName || "-"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">
                      {hasActivePlan
                        ? ticket.guestKeyId?.email || "-"
                        : "Contact details locked"}
                    </p>
                  </div>
                </td>

                {/* Contact */}
                <td className="px-5 py-4">
                  {hasActivePlan ? (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {ticket.guestKeyId?.email || "-"}
                      </p>

                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {ticket.guestKeyId?.phone || "-"}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Lock size={14} className="shrink-0 text-gray-400" />

                      <div>
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                          Contact details hidden
                        </p>

                        <button
                          type="button"
                          onClick={() => onUpdatePlan?.(client)}
                          className="
                            mt-1 inline-flex items-center gap-1
                            text-xs font-medium
                            text-blue-600 hover:text-blue-700
                            dark:text-blue-400 dark:hover:text-blue-300
                          "
                        >
                          Upgrade plan
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                {/* Status */}

                <td className="px-5 py-4">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Created */}

                <td className="px-5 py-4">
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    <Clock3 size={14} />

                    {formatDate(ticket.createdAt)}
                  </div>
                </td>

                {/* Actions */}

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      icon={<Edit2 size={15} />}
                      label="Edit"
                      onClick={() => onEdit?.(ticket)}
                    />
                    {(ticket.status === "resolved" ||
                      ticket.status === "closed") && (
                      <ActionButton
                        icon={<Trash2 size={15} />}
                        label="Delete"
                        danger
                        onClick={() => onDelete?.(ticket)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ===================================================
          MOBILE / TABLET CARDS
      =================================================== */}

      <div className="space-y-3 p-3 md:hidden">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="
              rounded-xl
              border
              border-gray-200
              bg-gray-50
              p-4
              dark:border-white/10
              dark:bg-[#11151d]
            "
          >
            {/* Header */}

            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                "
              >
                <Ticket size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-3
                  "
                >
                  <div className="min-w-0">
                    <h3
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-900
                        dark:text-white
                      "
                    >
                      {ticket.subject || "Untitled Ticket"}
                    </h3>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      #{ticket._id?.slice(-8) || "--------"}
                    </p>
                  </div>

                  <StatusBadge status={ticket.status} />
                </div>
              </div>
            </div>
            <p
              className=" mt-3
                line-clamp-2
                text-sm
                leading-5
                text-gray-500
                dark:text-gray-400"
            >
              Name - {ticket.guestKeyId?.fullName || "-"}
            </p>

            {/* Contact Information */}
            <div className="mt-3 rounded-xl border border-gray-200 bg-white p-3 dark:border-white/10 dark:bg-[#171b23]">
              <div className="flex items-start gap-3">
                {hasActivePlan ? (
                  <div className="min-w-0 flex-1 space-y-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Email
                      </p>

                      <p className="mt-0.5 break-all text-sm text-gray-700 dark:text-gray-200">
                        {ticket.guestKeyId?.email || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Phone
                      </p>

                      <p className="mt-0.5 text-sm text-gray-700 dark:text-gray-200">
                        {ticket.guestKeyId?.phone || "-"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className="
                        flex h-9 w-9 shrink-0 items-center justify-center
                        rounded-lg bg-gray-100 text-gray-500
                        dark:bg-white/5 dark:text-gray-400
                      "
                    >
                      <Lock size={16} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        Contact details are hidden
                      </p>

                      <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                        Upgrade your subscription to view customer email and
                        phone number.
                      </p>

                      <button
                        type="button"
                        onClick={() => onUpdatePlan?.(client)}
                        className="
                          mt-2 inline-flex items-center gap-1.5
                          rounded-lg bg-blue-600 px-3 py-2
                          text-xs font-medium text-white
                          transition hover:bg-blue-700
                        "
                      >
                        Upgrade Plan
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            {/* Description */}

            <p
              className="
                mt-3
                line-clamp-2
                text-sm
                leading-5
                text-gray-500
                dark:text-gray-400
              "
            >
              Description - {ticket.description || "No description provided."}
            </p>

            {/* Meta */}

            <div
              className="
                mt-4
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                Created: {formatDate(ticket.createdAt)}
              </span>
            </div>

            {/* Actions */}

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                border-t
                border-gray-200
                pt-3
                dark:border-white/10
              "
            >
              <ActionButton
                icon={<Edit2 size={15} />}
                label="Edit"
                onClick={() => onEdit?.(ticket)}
              />
              {(ticket.status === "resolved" || ticket.status === "closed") && (
                <ActionButton
                  icon={<Trash2 size={15} />}
                  label="Delete"
                  danger
                  onClick={() => onDelete?.(ticket)}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
