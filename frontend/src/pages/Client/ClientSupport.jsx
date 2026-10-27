import React, { useState } from "react";
import { useForm } from "react-hook-form";
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
import toast from "react-hot-toast";
import { createSupportTicketService } from "../../service/Client/supportTicketService";
import { useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { clientSupportSchema } from "../../utils/validation";

const ClientSupport = () => {
  const [apiStatus, setApiStatus] = useState({
    type: "",
    message: "",
  });
  const { client } = useSelector(
    (state) => state?.ClientReducer?.clientSlice || {},
  );
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(clientSupportSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      subject: "",
      description: "",
    },
  });

  const subjectValue = watch("subject", "");
  const descriptionValue = watch("description", "");

  const normalizedPlan = ["Basic", "Pro"].includes(client?.active_plan)
    ? client?.active_plan
    : "Basic";

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-gray-900
    outline-none transition placeholder:text-gray-400
    focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10
    dark:bg-[#11151d] dark:text-white dark:placeholder:text-gray-500
    border-gray-200 dark:border-white/10`;

  const onSubmit = async (values) => {
    setApiStatus({ type: "", message: "" });
    clearErrors("root.server");

    const payload = {
      email: values.email.trim().toLowerCase(),
      subject: values.subject.trim(),
      description: values.description.trim(),
      planName: normalizedPlan,
    };

    try {
      const response = await createSupportTicketService(payload);
      const result = response?.data;

      const successMessage =
        result?.message || "Support ticket created successfully.";

      setApiStatus({
        type: "success",
        message: successMessage,
      });

      toast.success(successMessage);
      reset();
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to submit your support ticket. Please try again.";

      setApiStatus({
        type: "error",
        message,
      });

      setError("root.server", {
        type: "server",
        message,
      });

      toast.error(message);
    }
  };

  const handleReset = () => {
    reset();
    clearErrors();
    setApiStatus({ type: "", message: "" });
  };

  return (
    <div className="min-h-full space-y-6 text-gray-900 dark:text-white">
      {/* Page heading */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
            <MessageCircleQuestion size={21} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              Email Support
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Contact your support team directly
            </p>
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
              Describe your question or issue and send it to our support team.
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
              Your request will be submitted to the support ticket system.
            </p>
          </div>
        </div>
      </div>

      {/* Support form */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-white/10 dark:bg-[#171b23]">
        <div className="border-b border-gray-200 px-5 py-5 dark:border-white/10 sm:px-7">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-base font-semibold">Create Support Ticket</h2>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Fill in the details below and our team will assist you.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="space-y-5 p-5 sm:p-7">
            {/* Plan */}
            <div>
              <label className="mb-2 flex items-center gap-2 text-sm font-medium">
                <ShieldCheck size={16} className="text-gray-400" />
                Current Plan
              </label>

              <div className="flex items-center gap-2">
                <span className="inline-flex rounded-full bg-blue-500/10 px-3 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {normalizedPlan}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Ticket priority is determined by your plan.
                </span>
              </div>
            </div>

            {/* Recipient email */}
            <div>
              <label
                htmlFor="support-email"
                className="mb-2 flex items-center gap-2 text-sm font-medium"
              >
                <User size={16} className="text-gray-400" />
                Support Email
                <span className="text-red-500">*</span>
              </label>

              <input
                id="support-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "support-email-error" : undefined
                }
                className={inputClass("email")}
                {...register("email")}
              />

              {errors.email && (
                <p
                  id="support-email-error"
                  className="mt-2 flex items-center gap-1.5 text-xs text-red-500"
                >
                  <AlertCircle size={14} />
                  {errors.email.message}
                </p>
              )}

              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Enter the email address associated with your support request.
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
                placeholder="e.g. Chatbot is not responding"
                disabled={isSubmitting}
                maxLength={150}
                aria-invalid={Boolean(errors.subject)}
                aria-describedby={
                  errors.subject ? "support-subject-error" : undefined
                }
                className={inputClass("subject")}
                {...register("subject")}
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                {errors.subject ? (
                  <p
                    id="support-subject-error"
                    className="text-xs text-red-500"
                  >
                    {errors.subject.message}
                  </p>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Keep your subject short and clear.
                  </span>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {subjectValue.length}/150
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
                rows={6}
                placeholder="Describe your question or issue in detail..."
                disabled={isSubmitting}
                maxLength={10000}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={
                  errors.description ? "support-description-error" : undefined
                }
                className={`${inputClass("description")} min-h-36 resize-y`}
                {...register("description")}
              />

              <div className="mt-2 flex items-start justify-between gap-3">
                {errors.description ? (
                  <p
                    id="support-description-error"
                    className="text-xs text-red-500"
                  >
                    {errors.description.message}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Include relevant details so the team can help you.
                  </p>
                )}

                <span className="shrink-0 text-xs text-gray-400">
                  {descriptionValue.length}/10000
                </span>
              </div>
            </div>

            {/* API success/error feedback */}
            {apiStatus.message && (
              <div
                role={apiStatus.type === "error" ? "alert" : "status"}
                aria-live="polite"
                className={`flex items-start gap-3 rounded-xl border p-4 ${
                  apiStatus.type === "success"
                    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                    : "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {apiStatus.type === "success" ? (
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                )}

                <div>
                  <p className="text-sm font-semibold">
                    {apiStatus.type === "success"
                      ? "Ticket Created Successfully"
                      : "Unable to Create Ticket"}
                  </p>
                  <p className="mt-1 wrap-break-word text-xs leading-5">
                    {apiStatus.message}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 bg-gray-50/70 p-5 dark:border-white/10 dark:bg-white/2 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-[#11151d] dark:text-gray-300 dark:hover:bg-white/5"
            >
              <RotateCcw size={16} />
              Reset Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  Creating Ticket...
                </>
              ) : (
                <>
                  <Send size={17} />
                  Submit Ticket
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="px-2 text-center text-xs leading-5 text-gray-500 dark:text-gray-400 sm:text-left">
        Please verify your email address and message before submitting.
      </p>
    </div>
  );
};

export default ClientSupport;
