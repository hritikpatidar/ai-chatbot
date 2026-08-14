import {
  Edit,
  Eye,
  Trash2,
  Ticket,
  Clock3,
  AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
  open: {
    label: "Open",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  in_progress: {
    label: "In Progress",
    className:
      "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400",
  },
  resolved: {
    label: "Resolved",
    className:
      "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  },
  closed: {
    label: "Closed",
    className:
      "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400",
  },
};

const PRIORITY_CONFIG = {
  low: {
    label: "Low",
    className:
      "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-400",
  },
  medium: {
    label: "Medium",
    className:
      "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
  },
  high: {
    label: "High",
    className:
      "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400",
  },
  urgent: {
    label: "Urgent",
    className:
      "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  },
};

function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.open;

  return (
    <span
      className={`
        inline-flex
        items-center
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-2.5
        py-1
        text-xs
        font-medium
        ${config.className}
      `}
    >
      {priority === "urgent" || priority === "high" ? (
        <AlertCircle size={12} />
      ) : null}

      {config.label}
    </span>
  );
}

export default function TicketTable({
  tickets = [],
  loading = false,
  onView,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
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
    return null;
  }

  return (
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
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr
              className="
                border-b
                border-gray-200
                bg-gray-50
                dark:border-white/10
                dark:bg-[#0f131b]
              "
            >
              <th
                className="
                  px-5 py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Ticket
              </th>

              <th
                className="
                  px-5 py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Category
              </th>

              <th
                className="
                  px-5 py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Priority
              </th>

              <th
                className="
                  px-5 py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Status
              </th>

              <th
                className="
                  px-5 py-4
                  text-left
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Created
              </th>

              <th
                className="
                  px-5 py-4
                  text-right
                  text-xs
                  font-semibold
                  uppercase
                  tracking-wide
                  text-gray-500
                  dark:text-gray-400
                "
              >
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
                  transition
                  hover:bg-gray-50
                  last:border-b-0
                  dark:border-white/5
                  dark:hover:bg-white/[0.02]
                "
              >
                {/* Ticket */}
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
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
                          max-w-[280px]
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
                          max-w-[280px]
                          truncate
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

                {/* Category */}
                <td className="px-5 py-4">
                  <span className="text-sm capitalize text-gray-700 dark:text-gray-300">
                    {ticket.category?.replaceAll("_", " ") || "General"}
                  </span>
                </td>

                {/* Priority */}
                <td className="px-5 py-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>

                {/* Status */}
                <td className="px-5 py-4">
                  <StatusBadge status={ticket.status} />
                </td>

                {/* Created */}
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                    <Clock3 size={14} />
                    {formatDate(ticket.createdAt)}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <ActionButton
                      icon={Eye}
                      label="View"
                      onClick={() => onView?.(ticket)}
                    />

                    <ActionButton
                      icon={Edit}
                      label="Edit"
                      onClick={() => onEdit?.(ticket)}
                    />

                    <ActionButton
                      icon={Trash2}
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

      {/* Mobile / Tablet Cards */}
      <div className="divide-y divide-gray-100 dark:divide-white/5 lg:hidden">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="p-4 sm:p-5">
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
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
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

                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      #{ticket._id?.slice(-8) || "--------"}
                    </p>
                  </div>

                  <StatusBadge status={ticket.status} />
                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                  {ticket.description || "No description provided."}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={ticket.priority} />

                  <span
                    className="
                      rounded-full
                      bg-gray-100
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      capitalize
                      text-gray-600
                      dark:bg-white/5
                      dark:text-gray-400
                    "
                  >
                    {ticket.category?.replaceAll("_", " ") || "General"}
                  </span>

                  <span className="text-xs text-gray-400">
                    {formatDate(ticket.createdAt)}
                  </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onView?.(ticket)}
                    className="
                      inline-flex
                      flex-1
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-gray-200
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      dark:border-white/10
                      dark:text-gray-300
                      dark:hover:bg-white/5
                    "
                  >
                    <Eye size={14} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onEdit?.(ticket)}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      border
                      border-gray-200
                      px-3
                      py-2
                      text-xs
                      font-medium
                      text-gray-700
                      transition
                      hover:bg-gray-50
                      dark:border-white/10
                      dark:text-gray-300
                      dark:hover:bg-white/5
                    "
                  >
                    <Edit size={14} />
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete?.(ticket)}
                    className="
                      inline-flex
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-red-200
                      px-3
                      py-2
                      text-red-600
                      transition
                      hover:bg-red-50
                      dark:border-red-500/20
                      dark:text-red-400
                      dark:hover:bg-red-500/10
                    "
                    aria-label="Delete ticket"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`
        flex
        h-8
        w-8
        items-center
        justify-center
        rounded-lg
        transition
        ${
          danger
            ? `
              text-red-500
              hover:bg-red-50
              dark:text-red-400
              dark:hover:bg-red-500/10
            `
            : `
              text-gray-500
              hover:bg-gray-100
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:bg-white/10
              dark:hover:text-white
            `
        }
      `}
    >
      <Icon size={16} />
    </button>
  );
}