import {
  Edit,
  Trash2,
  Ticket,
  Clock3,
  AlertCircle,
  Inbox,
  Edit2,
} from "lucide-react";

import ActionButton from "../../common/ActionButton";
import StatusBadge from "../../common/StatusBadge";

/* =========================================================
   DATE FORMAT
========================================================= */

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   PRIORITY BADGE
========================================================= */

/* =========================================================
   TICKET TABLE
========================================================= */

export default function TicketTable({
  tickets = [],
  loading = false,
  onEdit,
  onDelete,
}) {
  /* =======================================================
     LOADING
  ======================================================= */

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

  /* =======================================================
     EMPTY STATE
  ======================================================= */

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

  /* =======================================================
     DATA
  ======================================================= */

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
      {/* ===================================================
          DESKTOP TABLE
      =================================================== */}

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
                Priority
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

                {/* Priority */}

                <td className="px-5 py-4">
                  <StatusBadge priority={ticket.priority} />
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

                    <ActionButton
                      icon={<Trash2 size={15} />}
                      label="Delete"
                      danger
                      onClick={() => onDelete?.(ticket)}
                    />
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
              {ticket.description || "No description provided."}
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
              <StatusBadge priority={ticket.priority} />

              <span
                className="
                  text-xs
                  text-gray-400
                "
              >
                {formatDate(ticket.createdAt)}
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

              <ActionButton
                icon={<Trash2 size={15} />}
                label="Delete"
                danger
                onClick={() => onDelete?.(ticket)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
