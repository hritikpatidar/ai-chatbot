import { useEffect } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import CustomSelect from "../../common/CustomSelect";
import { faqSchema } from "../../../utils/validation";
/* =========================================================
   DEFAULT VALUES
========================================================= */

const initialForm = {
  question: "",
  answer: "",
  category: "",
  keywords: "",
  status: "active",
};

export default function FAQModal({
  isOpen,
  onClose,
  onSubmit,
  faq = null,
  loading = false,
}) {
  const isEdit = Boolean(faq);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(faqSchema),
    defaultValues: initialForm,
    mode: "onChange",
  });

  /* =========================================================
     EDIT / CREATE FORM DATA
  ========================================================= */

  useEffect(() => {
    if (!isOpen) return;

    if (faq) {
      reset({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "",
        keywords: Array.isArray(faq.keywords)
          ? faq.keywords.join(", ")
          : "",
        status: faq.status || "active",
      });
    } else {
      reset(initialForm);
    }
  }, [faq, isOpen, reset]);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleFormSubmit = async (data) => {
    const payload = {
      question: data.question.trim(),

      answer: data.answer.trim(),

      category: data.category?.trim() || "",

      keywords: data.keywords
        ? data.keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean)
        : [],

      status: data.status,
    };

    await onSubmit(payload);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 z-100
        flex items-center justify-center
        bg-black/50
        px-4 py-6
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex max-h-[90vh]
          w-full max-w-2xl
          flex-col
          overflow-hidden
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
            flex items-center justify-between
            border-b border-gray-200
            px-5 py-4
            dark:border-white/10
          "
        >
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              {isEdit ? "Edit FAQ" : "Add FAQ"}
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {isEdit
                ? "Update your frequently asked question."
                : "Create a new frequently asked question."}
            </p>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="
              flex h-8 w-8
              items-center justify-center
              rounded-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
              disabled:cursor-not-allowed
              dark:text-gray-400
              dark:hover:bg-white/10
              dark:hover:text-white
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="overflow-y-auto px-5 py-5"
          noValidate
        >
          <div className="space-y-5">
            {/* =================================================
                QUESTION
            ================================================= */}

            <div>
              <label
                htmlFor="question"
                className="
                  mb-2 block
                  text-xs font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Question <span className="text-red-500">*</span>
              </label>

              <input
                id="question"
                {...register("question")}
                placeholder="e.g. What are your delivery timings?"
                disabled={loading}
                className={`
                  w-full rounded-xl
                  border
                  bg-gray-50
                  px-3.5 py-3
                  text-sm text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:ring-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:bg-[#11151d]
                  dark:text-white
                  dark:placeholder:text-gray-500

                  ${
                    errors.question
                      ? `
                        border-red-400
                        focus:border-red-500
                        focus:ring-red-500/10
                      `
                      : `
                        border-gray-200
                        focus:border-blue-500
                        focus:ring-blue-500/10
                        dark:border-white/10
                      `
                  }
                `}
              />

              {errors.question && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  {errors.question.message}
                </p>
              )}
            </div>

            {/* =================================================
                ANSWER
            ================================================= */}

            <div>
              <label
                htmlFor="answer"
                className="
                  mb-2 block
                  text-xs font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Answer <span className="text-red-500">*</span>
              </label>

              <textarea
                id="answer"
                {...register("answer")}
                placeholder="Write the answer..."
                rows={5}
                disabled={loading}
                className={`
                  w-full resize-none rounded-xl
                  border
                  bg-gray-50
                  px-3.5 py-3
                  text-sm leading-6
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:ring-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:bg-[#11151d]
                  dark:text-white
                  dark:placeholder:text-gray-500

                  ${
                    errors.answer
                      ? `
                        border-red-400
                        focus:border-red-500
                        focus:ring-red-500/10
                      `
                      : `
                        border-gray-200
                        focus:border-blue-500
                        focus:ring-blue-500/10
                        dark:border-white/10
                      `
                  }
                `}
              />

              {errors.answer && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  {errors.answer.message}
                </p>
              )}
            </div>

            {/* =================================================
                CATEGORY + STATUS
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Category */}

              <div>
                <label
                  htmlFor="category"
                  className="
                    mb-2 block
                    text-xs font-medium
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  Category
                </label>

                <input
                  id="category"
                  {...register("category")}
                  placeholder="e.g. Delivery"
                  disabled={loading}
                  className={`
                    w-full rounded-xl
                    border
                    bg-gray-50
                    px-3.5 py-3
                    text-sm text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:ring-2
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:bg-[#11151d]
                    dark:text-white
                    dark:placeholder:text-gray-500

                    ${
                      errors.category
                        ? `
                          border-red-400
                          focus:border-red-500
                          focus:ring-red-500/10
                        `
                        : `
                          border-gray-200
                          focus:border-blue-500
                          focus:ring-blue-500/10
                          dark:border-white/10
                        `
                    }
                  `}
                />

                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Status */}

              <div>
                <label
                  htmlFor="status"
                  className="
                    mb-2 block
                    text-xs font-medium
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
                      disabled={loading}
                      options={[
                        {
                          value: "active",
                          label: "Active",
                        },
                        {
                          value: "inactive",
                          label: "Inactive",
                        },
                      ]}
                    />
                  )}
                />

                {errors.status && (
                  <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                    {errors.status.message}
                  </p>
                )}
              </div>
            </div>

            {/* =================================================
                KEYWORDS
            ================================================= */}

            <div>
              <label
                htmlFor="keywords"
                className="
                  mb-2 block
                  text-xs font-medium
                  text-gray-700
                  dark:text-gray-300
                "
              >
                Keywords
              </label>

              <input
                id="keywords"
                {...register("keywords")}
                placeholder="delivery, shipping, order"
                disabled={loading}
                className={`
                  w-full rounded-xl
                  border
                  bg-gray-50
                  px-3.5 py-3
                  text-sm text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:ring-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:bg-[#11151d]
                  dark:text-white
                  dark:placeholder:text-gray-500

                  ${
                    errors.keywords
                      ? `
                        border-red-400
                        focus:border-red-500
                        focus:ring-red-500/10
                      `
                      : `
                        border-gray-200
                        focus:border-blue-500
                        focus:ring-blue-500/10
                        dark:border-white/10
                      `
                  }
                `}
              />

              <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                Separate multiple keywords using commas.
              </p>

              {errors.keywords && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  {errors.keywords.message}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              FOOTER
          ================================================= */}

          <div
            className="
              mt-6 flex flex-col-reverse
              gap-2
              border-t border-gray-200
              pt-4
              sm:flex-row sm:justify-end
              dark:border-white/10
            "
          >
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="
                rounded-xl
                border border-gray-200
                px-4 py-2.5
                text-xs font-medium
                text-gray-700
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                dark:border-white/10
                dark:text-gray-300
                dark:hover:bg-white/10
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="
                inline-flex items-center
                justify-center gap-2
                rounded-xl
                bg-blue-600
                px-4 py-2.5
                text-xs font-semibold
                text-white
                transition
                hover:bg-blue-700
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-blue-500
                dark:hover:bg-blue-600
              "
            >
              {loading ? (
                <>
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={15} />
                  {isEdit ? "Update FAQ" : "Create FAQ"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}