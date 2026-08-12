import { useEffect, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

const initialForm = {
  question: "",
  answer: "",
  category: "",
  keywords: "",
  status: "active",
};

export default function FAQModal({
  open,
  onClose,
  onSubmit,
  faq = null,
  loading = false,
}) {
  const [form, setForm] = useState(initialForm);

  const isEdit = Boolean(faq);

  useEffect(() => {
    if (faq) {
      setForm({
        question: faq.question || "",
        answer: faq.answer || "",
        category: faq.category || "",
        keywords: Array.isArray(faq.keywords) ? faq.keywords.join(", ") : "",
        status: faq.status || "active",
      });
    } else {
      setForm(initialForm);
    }
  }, [faq, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.question.trim() || !form.answer.trim()) {
      return;
    }

    const payload = {
      question: form.question.trim(),
      answer: form.answer.trim(),
      category: form.category.trim(),
      keywords: form.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      status: form.status,
    };

    await onSubmit(payload);
  };

  if (!open) {
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
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) {
          onClose();
        }
      }}
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
        <form onSubmit={handleSubmit} className="overflow-y-auto px-5 py-5">
          <div className="space-y-5">
            {/* Question */}
            <div>
              <label
                htmlFor="question"
                className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Question <span className="text-red-500">*</span>
              </label>

              <input
                id="question"
                name="question"
                value={form.question}
                onChange={handleChange}
                placeholder="e.g. What are your delivery timings?"
                disabled={loading}
                required
                className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-3.5 py-3
                  text-sm text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/10
                  dark:bg-[#11151d]
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>

            {/* Answer */}
            <div>
              <label
                htmlFor="answer"
                className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Answer <span className="text-red-500">*</span>
              </label>

              <textarea
                id="answer"
                name="answer"
                value={form.answer}
                onChange={handleChange}
                placeholder="Write the answer..."
                rows={5}
                disabled={loading}
                required
                className="
                  w-full resize-none rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-3.5 py-3
                  text-sm leading-6
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/10
                  dark:bg-[#11151d]
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />
            </div>

            {/* Category + Status */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Category
                </label>

                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Delivery"
                  disabled={loading}
                  className="
                    w-full rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    text-sm text-gray-900
                    outline-none
                    transition
                    placeholder:text-gray-400
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:border-white/10
                    dark:bg-[#11151d]
                    dark:text-white
                    dark:placeholder:text-gray-500
                  "
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={loading}
                  className="
                    w-full rounded-xl
                    border border-gray-200
                    bg-gray-50
                    px-3.5 py-3
                    text-sm text-gray-900
                    outline-none
                    transition
                    focus:border-blue-500
                    focus:ring-2
                    focus:ring-blue-500/10
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    dark:border-white/10
                    dark:bg-[#11151d]
                    dark:text-white
                  "
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label
                htmlFor="keywords"
                className="mb-2 block text-xs font-medium text-gray-700 dark:text-gray-300"
              >
                Keywords
              </label>

              <input
                id="keywords"
                name="keywords"
                value={form.keywords}
                onChange={handleChange}
                placeholder="delivery, shipping, order"
                disabled={loading}
                className="
                  w-full rounded-xl
                  border border-gray-200
                  bg-gray-50
                  px-3.5 py-3
                  text-sm text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/10
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  dark:border-white/10
                  dark:bg-[#11151d]
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />

              <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                Separate multiple keywords using commas.
              </p>
            </div>
          </div>

          {/* Footer */}
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
              disabled={loading || !form.question.trim() || !form.answer.trim()}
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
                  <Loader2 size={15} className="animate-spin" />
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
