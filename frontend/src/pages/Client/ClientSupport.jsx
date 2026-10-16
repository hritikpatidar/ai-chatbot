import React, { useState } from "react";
import {
  MessageCircleQuestion,
  Mail,
  Send,
  User,
  FileText,
  MessageSquareText,
  CheckCircle2,
  AlertCircle,
  LoaderCircle,
  RotateCcw,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const initialForm = {
  email: "",
  subject: "",
  description: "",
};

const ClientSupport = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({
    type: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (status.message) {
      setStatus({ type: "", message: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Recipient email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.subject.trim()) {
      newErrors.subject = "Please enter an email subject.";
    } else if (form.subject.trim().length < 3) {
      newErrors.subject = "Subject must contain at least 3 characters.";
    } else if (form.subject.trim().length > 150) {
      newErrors.subject = "Subject cannot exceed 150 characters.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Please enter your message.";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Message must contain at least 10 characters.";
    } else if (form.description.trim().length > 5000) {
      newErrors.description = "Message cannot exceed 5000 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setStatus({ type: "", message: "" });

    if (!validateForm()) return;

    setIsSending(true);

    try {
      // Replace this endpoint with your actual backend API.
      const response = await fetch("/api/support/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          to: form.email.trim(),
          subject: form.subject.trim(),
          description: form.description.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to send your email. Please try again.",
        );
      }

      setStatus({
        type: "success",
        message:
          result.message || `Email sent successfully to ${form.email.trim()}.`,
      });

      setForm(initialForm);
      setErrors({});
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error.message ||
          "Something went wrong. Please check your connection and try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setStatus({ type: "", message: "" });
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900
    outline-none transition placeholder:text-gray-400
    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
    dark:bg-[#11151d] dark:text-white dark:placeholder:text-gray-500
    ${
      errors[field]
        ? "border-red-400 dark:border-red-400"
        : "border-gray-200 dark:border-white/10"
    }`;

  return (
    <div className="min-h-full space-y-6 text-gray-900 dark:text-white">
      {/* Page heading */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-500
                "
            >
              <MessageCircleQuestion size={21} />
            </div>

            <div>
              <h1
                className="
                    text-xl font-semibold
                    text-gray-900
                    dark:text-white
                "
              >
                Email Support
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Contact your support team directly
              </p>
            </div>
          </div>
        </div>

       <div className="flex w-fit items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Support Center
        </div>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#171b23]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <Headphones size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">We're here to help</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Describe your question or issue and send it to the appropriate
              recipient.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-[#171b23]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h3 className="text-sm font-semibold">Secure communication</h3>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              Double-check the recipient address before sending your message.
            </p>
          </div>
        </div>
      </div>

      {/* Email form */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#171b23]">
        <div className="border-b border-gray-200 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Mail size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold">Compose Email</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Fill in the details below to send your message.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 p-5 sm:p-7">
            {/* Recipient */}
            <div>
              <label
                htmlFor="support-email"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <User size={16} className="text-gray-400" />
                Recipient Email
                <span className="text-red-500">*</span>
              </label>

              <input
                id="support-email"
                type="email"
                name="email"
                autoComplete="email"
                placeholder="recipient@example.com"
                value={form.email}
                onChange={handleChange}
                disabled={isSending}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "support-email-error" : undefined
                }
                className={inputClass("email")}
              />

              {errors.email && (
                <p
                  id="support-email-error"
                  className="mt-2 flex items-center gap-1.5 text-xs text-red-500"
                >
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter the email address where this message should be delivered.
              </p>
            </div>

            {/* Subject */}
            <div>
              <label
                htmlFor="support-subject"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <FileText size={16} className="text-gray-400" />
                Subject
                <span className="text-red-500">*</span>
              </label>

              <input
                id="support-subject"
                type="text"
                name="subject"
                placeholder="e.g. Need help with my subscription"
                value={form.subject}
                onChange={handleChange}
                disabled={isSending}
                maxLength={150}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "support-subject-error" : undefined
                }
                className={inputClass("subject")}
              />

              <div className="mt-2 flex items-center justify-between gap-3">
                {errors.subject ? (
                  <p
                    id="support-subject-error"
                    className="text-xs text-red-500"
                  >
                    {errors.subject}
                  </p>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Keep your subject short and clear.
                  </span>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {form.subject.length}/150
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="support-description"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <MessageSquareText size={16} className="text-gray-400" />
                Message / Description
                <span className="text-red-500">*</span>
              </label>

              <textarea
                id="support-description"
                name="description"
                rows={6}
                placeholder="Describe your question or issue in detail..."
                value={form.description}
                onChange={handleChange}
                disabled={isSending}
                maxLength={5000}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "support-description-error" : undefined
                }
                className={`${inputClass("description")} min-h-36 resize-y`}
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                {errors.description ? (
                  <p
                    id="support-description-error"
                    className="text-xs text-red-500"
                  >
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Include relevant details so your recipient can help you.
                  </p>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {form.description.length}/5000
                </span>
              </div>
            </div>

            {/* Success / Error message */}
            {status.message && (
              <div
                role={status.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  status.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                )}

                <div>
                  <p className="text-sm font-semibold">
                    {status.type === "success"
                      ? "Email Sent Successfully"
                      : "Unable to Send Email"}
                  </p>
                  <p className="mt-1 break-words text-xs leading-5">
                    {status.message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50/70 p-5 dark:border-white/10 dark:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#11151d] dark:text-gray-300 dark:hover:bg-white/5"
            >
              <RotateCcw size={16} />
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isSending}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Sending Email...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Send Email
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="px-2 text-center text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-left">
        Please verify the recipient email and message details before sending.
      </p>
    </div>
  );
};

export default ClientSupport;
