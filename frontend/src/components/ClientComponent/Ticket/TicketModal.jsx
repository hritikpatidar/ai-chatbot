import { useEffect, useState } from "react";
import { Save, Ticket, X } from "lucide-react";
import CustomSelect from "../../common/CustomSelect";

const INITIAL_FORM = {
  subject: "",
  description: "",
  // category: "general",
  priority: "medium",
  status: "open",
};

export default function TicketModal({
  isOpen,
  onClose,
  onSubmit,
  ticket = null,
  loading = false,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM);

  const isEdit = Boolean(ticket?._id);

  useEffect(() => {
    if (!isOpen) return;

    if (ticket) {
      setFormData({
        subject: ticket.subject || "",
        description: ticket.description || "",
        priority: ticket.priority || "medium",
        status: ticket.status || "open",
      });
    } else {
      setFormData(INITIAL_FORM);
    }
  }, [isOpen, ticket]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;
    if (!formData.description.trim()) return;
    await onSubmit?.(formData);
  };

  if (!isOpen) return null;

  const inputClass = `
    w-full
    rounded-xl
    border
    border-gray-200
    bg-white
    px-4
    py-3
    text-sm
    text-gray-900
    outline-none
    transition
    placeholder:text-gray-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-500/10
    dark:border-white/10
    dark:bg-[#0f131b]
    dark:text-white
    dark:placeholder:text-gray-500
  `;

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
        px-4
        py-5
        backdrop-blur-sm
      "
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose?.();
        }
      }}
    >
      <div
        className="
          flex
          max-h-[calc(100vh-40px)]
          w-full
          max-w-2xl
          flex-col
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
        <div
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-gray-200
            px-5
            py-4
            dark:border-white/10
          "
        >
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
              <Ticket size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-semibold text-gray-900 dark:text-white">
                {isEdit ? "Edit Ticket" : "Create Ticket"}
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {isEdit
                  ? "Update ticket information."
                  : "Create a new support ticket."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="
              shrink-0
              rounded-lg
              p-2
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

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="min-h-0 flex-1 overflow-y-auto"
        >
          <div className="space-y-5 p-5 sm:p-6">
            {/* Subject */}
            <div>
              <label
                htmlFor="ticket-subject"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Subject
              </label>

              <input
                id="ticket-subject"
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter ticket subject"
                maxLength={150}
                className={inputClass}
                disabled={loading}
              />

              <p className="mt-1.5 text-xs text-gray-400">
                {formData.subject.length}/150
              </p>
            </div>
            {/* Priority + Status*/}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Priority */}
              <div>
                <label
                  htmlFor="ticket-priority"
                  className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  Priority
                </label>
                <CustomSelect
                  size="md"
                  // label="Response Tone"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  options={[
                    {
                      value: "low",
                      label: "Low",
                    },
                    {
                      value: "medium",
                      label: "Medium",
                    },
                    {
                      value: "high",
                      label: "High",
                    },
                  ]}
                  rounded="rounded-lg"
                  // className={inputClass}
                  disabled={loading}
                />
              </div>
              {isEdit && (
                <div>
                  <label
                    htmlFor="ticket-status"
                    className="
                    mb-2
                    block
                    text-sm
                    font-medium
                    text-gray-700
                    dark:text-gray-300
                  "
                  >
                    Status
                  </label>

                  <CustomSelect
                    size="md"
                    // label="Response Tone"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    options={[
                      {
                        value: "open",
                        label: "Open",
                      },
                      {
                        value: "in_progress",
                        label: "In Progress",
                      },
                      {
                        value: "resolved",
                        label: "Resolved",
                      },
                      {
                        value: "closed",
                        label: "Closed",
                      },
                    ]}
                    rounded="rounded-lg"
                    // className={inputClass}
                    disabled={loading}
                  />
                </div>
              )}
            </div>
            {/* Description */}
            <div>
              <label
                htmlFor="ticket-description"
                className="
                  mb-2
                  block
                  text-sm
                  font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Description
              </label>

              <textarea
                id="ticket-description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue or request..."
                rows={6}
                maxLength={2000}
                className={`${inputClass} resize-none`}
                disabled={loading}
              />

              <p className="mt-1.5 text-xs text-gray-400">
                {formData.description.length}/2000
              </p>
            </div>

            {/* Status only while editing */}
          </div>

          {/* Footer */}
          <div
            className="
              flex
              shrink-0
              flex-col-reverse
              gap-3
              border-t
              border-gray-200
              bg-gray-50
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              dark:border-white/10
              dark:bg-white/2
            "
          >
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                bg-white
                px-5
                py-2.5
                text-sm
                font-medium
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
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                loading ||
                !formData.subject.trim() ||
                !formData.description.trim()
              }
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-blue-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save size={16} />

              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Ticket"
                  : "Create Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
