import React from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";

export default function AdminConfirmModal({
  isOpen = false,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = true,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        flex
        items-center
        justify-center
        bg-black/50
        p-4
        backdrop-blur-sm
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <h3
            className="
              text-base
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            {title}
          </h3>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-gray-500
              hover:bg-gray-100
              dark:text-gray-400
              dark:hover:bg-white/5
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pb-5">
          <div className="flex items-start gap-3">
            <div
              className={`
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                ${
                  danger
                    ? `
                      bg-red-50
                      text-red-500
                      dark:bg-red-500/10
                      dark:text-red-400
                    `
                    : `
                      bg-blue-50
                      text-blue-500
                      dark:bg-blue-500/10
                      dark:text-blue-400
                    `
                }
              `}
            >
              <AlertTriangle size={19} />
            </div>

            <p
              className="
                pt-1
                text-sm
                leading-6
                text-gray-600
                dark:text-gray-400
              "
            >
              {message}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          className="
            flex
            justify-end
            gap-2
            border-t
            border-gray-100
            bg-gray-50/70
            px-5
            py-3
            dark:border-white/10
            dark:bg-white/2
          "
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              rounded-lg
              border
              border-gray-200
              px-4
              py-2
              text-xs
              font-medium
              text-gray-600
              transition
              hover:bg-white
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-white/10
              dark:text-gray-300
              dark:hover:bg-white/5
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`
              flex
              items-center
              gap-2
              rounded-lg
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              transition
              disabled:cursor-not-allowed
              disabled:opacity-50
              ${
                danger
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }
            `}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}

            {loading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
