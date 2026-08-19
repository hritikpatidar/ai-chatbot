import { AlertCircle } from "lucide-react";

export default function StatusBadge({ status = "", priority = "" }) {
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

    active: {
      label: "Active",
      className:
        "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    },

    inactive: {
      label: "Inactive",
      className:
        "bg-gray-50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400",
    },
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
  };
  const config = STATUS_CONFIG[status || priority] || STATUS_CONFIG.open;
  const showAlert = priority === "high";
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
      {showAlert && <AlertCircle size={12} className="mr-1"/>}
      {config.label}
    </span>
  );
}
