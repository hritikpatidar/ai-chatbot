import {
  Edit2,
  Trash2,
  MessageCircleQuestion,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import ActionButton from "../../common/ActionButton";

export default function FAQTable({
  faqs = [],
  onEdit,
  onDelete,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="flex min-h-75 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500 dark:border-white/20 dark:border-t-blue-400" />
      </div>
    );
  }

  if (!faqs.length) {
    return (
      <div
        className="
          flex min-h-75
          flex-col items-center justify-center
          rounded-2xl border
          border-gray-200
          bg-white
          px-6 py-10
          text-center
          dark:border-white/10
          dark:bg-[#171b23]
        "
      >
        <div
          className="
            mb-4 flex h-14 w-14
            items-center justify-center
            rounded-full
            bg-blue-500/10
            text-blue-500
            dark:text-blue-400
          "
        >
          <MessageCircleQuestion size={28} />
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          No FAQs found
        </h3>

        <p className="mt-1 max-w-sm text-xs text-gray-500 dark:text-gray-400">
          Add your first frequently asked question to help your customers.
        </p>
      </div>
    );
  }

  return (
    <div
      className="
        overflow-hidden rounded-2xl
        border border-gray-200
        bg-white
        dark:border-white/10
        dark:bg-[#171b23]
      "
    >
      {/* Desktop Table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-200">
          <thead>
            <tr
              className="
                border-b border-gray-200
                bg-gray-50
                dark:border-white/10
                dark:bg-white/3
              "
            >
              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Question
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Answer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                Status
              </th>

              <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {faqs.map((faq) => (
              <tr
                key={faq._id}
                className="
                  border-b border-gray-100
                  transition-colors
                  last:border-0
                  hover:bg-gray-50
                  dark:border-white/5
                  dark:hover:bg-white/3
                "
              >
                <td className="max-w-65 px-5 py-4">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {faq.question}
                  </p>
                </td>

                <td className="max-w-[320px] px-5 py-4">
                  <p className="line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    {faq.answer}
                  </p>
                </td>

                <td className="px-5 py-4">
                  {faq.category ? (
                    <span
                      className="
                        inline-flex rounded-full
                        bg-blue-500/10
                        px-2.5 py-1
                        text-[11px]
                        font-medium
                        text-blue-600
                        dark:text-blue-400
                      "
                    >
                      {faq.category}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={faq.status} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <ActionButton
                      icon={<Edit2 size={15} />}
                      title="Edit FAQ"
                      onClick={() => onEdit(faq)}
                    />

                    <ActionButton
                      danger
                      icon={<Trash2 size={15} />}
                      title="Delete FAQ"
                      onClick={() => onDelete(faq)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 p-3 md:hidden">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="
              rounded-xl
              border border-gray-200
              bg-gray-50
              p-4
              dark:border-white/10
              dark:bg-[#11151d]
            "
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </h3>

                <p className="mt-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  {faq.answer}
                </p>
              </div>

              <StatusBadge status={faq.status} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-white/10">
              <div>
                {faq.category ? (
                  <span
                    className="
                      rounded-full
                      bg-blue-500/10
                      px-2.5 py-1
                      text-[10px]
                      font-medium
                      text-blue-600
                      dark:text-blue-400
                    "
                  >
                    {faq.category}
                  </span>
                ) : (
                  <span className="text-[11px] text-gray-400">No category</span>
                )}
              </div>

              <div className="flex gap-2">
                <ActionButton
                  icon={<Edit2 size={14} />}
                  title="Edit"
                  onClick={() => onEdit(faq)}
                />

                <ActionButton
                  danger
                  icon={<Trash2 size={14} />}
                  title="Delete"
                  onClick={() => onDelete(faq)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const active = status === "active";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full
        px-2.5 py-1
        text-[10px]
        font-medium
        ${
          active
            ? "bg-green-500/10 text-green-600 dark:text-green-400"
            : "bg-red-500/10 text-red-600 dark:text-red-400"
        }
      `}
    >
      {active ? <CheckCircle2 size={12} /> : <XCircle size={12} />}

      {active ? "Active" : "Inactive"}
    </span>
  );
}

