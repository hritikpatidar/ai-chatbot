import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Ticket, X } from "lucide-react";

import CustomSelect from "../../common/CustomSelect";
import { ticketSchema } from "../../../utils/validation";

const INITIAL_FORM = {
  subject: "",
  description: "",
  priority: "medium",
  status: "open",
};

const PRIORITY_OPTIONS = [
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
];

const STATUS_OPTIONS = [
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
];

export default function TicketModal({
  isOpen,
  onClose,
  onSubmit,
  ticket = null,
  loading = false,
}) {
  const isEdit = Boolean(ticket?._id);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ticketSchema),

    defaultValues: INITIAL_FORM,

    mode: "onChange",

    reValidateMode: "onChange",
  });

  const subject = watch("subject") || "";
  const description = watch("description") || "";

  /*
   * Reset form whenever modal opens
   * or ticket changes.
   */
  useEffect(() => {
    if (!isOpen) return;

    if (ticket) {
      reset({
        subject: ticket.subject || "",
        description: ticket.description || "",
        priority: ticket.priority || "medium",
        status: ticket.status || "open",
      });
    } else {
      reset(INITIAL_FORM);
    }
  }, [isOpen, ticket, reset]);

  /*
   * Existing submit functionality remains same.
   * Only difference is that validated data comes here.
   */
  const handleFormSubmit = async (data) => {
    await onSubmit?.(data);
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

  const isSaving = loading || isSubmitting;

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
        if (e.target === e.currentTarget && !isSaving) {
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
            disabled={isSaving}
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
          onSubmit={handleSubmit(handleFormSubmit)}
          className="min-h-0 flex-1 overflow-y-auto"
          noValidate
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
                Subject <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="ticket-subject"
                type="text"
                placeholder="Enter ticket subject"
                maxLength={150}
                disabled={isSaving}
                className={`
                  ${inputClass}
                  ${
                    errors.subject
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : ""
                  }
                `}
                {...register("subject")}
              />

              {errors.subject && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  {errors.subject.message}
                </p>
              )}

              <p className="mt-1.5 text-xs text-gray-400">
                {subject.length}/150
              </p>
            </div>

            {/* Priority + Status */}
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

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <CustomSelect
                      size="md"
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      options={PRIORITY_OPTIONS}
                      rounded="rounded-lg"
                      disabled={isSaving}
                      error={errors.priority?.message}
                    />
                  )}
                />
              </div>

              {/* Status */}
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

                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <CustomSelect
                        size="md"
                        name={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        options={STATUS_OPTIONS}
                        rounded="rounded-lg"
                        disabled={isSaving}
                        error={errors.status?.message}
                      />
                    )}
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
                Description <span className="ml-1 text-red-500">*</span>
              </label>

              <textarea
                id="ticket-description"
                placeholder="Describe your issue or request..."
                rows={6}
                maxLength={2000}
                disabled={isSaving}
                className={`
                  ${inputClass}
                  resize-none
                  ${
                    errors.description
                      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
                      : ""
                  }
                `}
                {...register("description")}
              />

              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}

              <p className="mt-1.5 text-xs text-gray-400">
                {description.length}/2000
              </p>
            </div>
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
              disabled={isSaving}
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
              disabled={isSaving}
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

              {isSaving
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
