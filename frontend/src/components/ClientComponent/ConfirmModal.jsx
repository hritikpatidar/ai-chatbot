import { AlertTriangle, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = true,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onCancel();
        }
      }}
    >
      <div
        className="
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border border-gray-200
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        <div
          className="
            flex items-center
            justify-between
            border-b
            border-gray-200
            px-5 py-4
            dark:border-white/10
          "
        >
          <div className="flex items-center gap-3">
            <div
              className={`
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                ${
                  danger
                    ? "bg-red-500/10 text-red-600 dark:text-red-400"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                }
              `}
            >
              <AlertTriangle size={20} />
            </div>

            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              rounded-lg
              p-1.5
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:text-gray-400
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-5">
          <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>

        <div
          className="
            flex flex-col-reverse
            gap-2
            border-t
            border-gray-200
            bg-gray-50
            px-5 py-4
            sm:flex-row
            sm:justify-end
            dark:border-white/10
            dark:bg-white/2
          "
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="
              rounded-lg
              border border-gray-200
              bg-white
              px-4 py-2.5
              text-sm font-medium
              text-gray-700
              transition
              hover:bg-gray-100
              disabled:cursor-not-allowed
              disabled:opacity-50
              dark:border-white/10
              dark:bg-[#171b23]
              dark:text-gray-300
              dark:hover:bg-white/10
            "
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`
              rounded-lg
              px-4 py-2.5
              text-sm font-medium
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
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
