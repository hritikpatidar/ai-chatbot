import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  User,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  MessageCircle,
} from "lucide-react";
import { identifyWidgetUserService } from "../service/Widget/WidgetServices";
import { welcomeUserSchema } from "../utils/validation";
import PhoneInputField from "./common/PhoneInputField";

const WelcomeUserModal = ({
  isOpen,
  onClose,
  clientKey,
  guestId,
  onSuccess,
}) => {
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
  } = useForm({
    resolver: zodResolver(welcomeUserSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      setApiError("");
      reset({
        name: "",
        email: "",
        phone: "",
      });
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data) => {
    try {
      setApiError("");

      const payload = {
        clientKey,
        guestId,
        fullName: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
      };
      const response = await identifyWidgetUserService(payload);

      if (response?.data?.success) {
        onSuccess?.(response?.data?.data);
        onClose?.();
        return;
      }

      setApiError(response?.message || "Unable to continue. Please try again.");
    } catch (error) {
      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-9999
        flex items-center justify-center
        bg-black/50
        px-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          relative
          w-full max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-2xl
          dark:border-white/10
          dark:bg-[#11151d]
        "
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="
            absolute right-4 top-4
            flex h-8 w-8 items-center justify-center
            rounded-lg
            text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-700
            disabled:cursor-not-allowed
            dark:text-gray-400
            dark:hover:bg-white/10
            dark:hover:text-white
          "
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="px-6 pb-5 pt-7 sm:px-7">
          <div
            className="
              mb-5
              flex h-12 w-12
              items-center justify-center
              rounded-xl
              bg-blue-100
              text-blue-600
              dark:bg-blue-500/10
              dark:text-blue-400
            "
          >
            <MessageCircle size={24} />
          </div>

          <h2
            className="
              text-xl
              font-semibold
              text-gray-900
              dark:text-white
            "
          >
            Welcome! 👋
          </h2>

          <p
            className="
              mt-1.5
              max-w-sm
              text-sm
              leading-6
              text-gray-500
              dark:text-gray-400
            "
          >
            Before we get started, please share your details so we can provide
            you with better support.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-7 sm:px-7">
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Full name{" "}
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>

            <div className="relative">
              <User
                size={17}
                className="
                  pointer-events-none
                  absolute left-3.5 top-1/2
                  -translate-y-1/2
                  text-gray-400
                  dark:text-gray-500
                "
              />

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                autoComplete="name"
                {...register("name")}
                className={`
                  h-11 w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  pl-10 pr-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:ring-2
                  dark:bg-[#0d1117]
                  dark:text-white
                  dark:placeholder:text-gray-500
                  focus:ring-blue-500/10
                  focus:border-blue-500
                `}
              />
            </div>

            {errors.name && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Email address{" "}
              <span className="text-red-500 dark:text-red-400">*</span>
            </label>

            <div className="relative">
              <Mail
                size={17}
                className="
                  pointer-events-none
                  absolute left-3.5 top-1/2
                  -translate-y-1/2
                  text-gray-400
                  dark:text-gray-500
                "
              />

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                {...register("email")}
                className={`
                  h-11 w-full
                  rounded-xl
                  border
                  border-gray-300
                  bg-white
                  pl-10 pr-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:ring-2
                  dark:bg-[#0d1117]
                  dark:text-white
                  dark:placeholder:text-gray-500
                  focus:ring-blue-500/10
                  focus:border-blue-500
                `}
              />
            </div>

            {errors.email && (
              <p className="mt-1.5 text-xs text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-5">
            <label
              htmlFor="phone"
              className="
                mb-1.5
                block
                text-sm
                font-medium
                text-gray-700
                dark:text-gray-300
              "
            >
              Phone number (optional)
            </label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInputField
                  //   label="Alternate Phone"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.phone?.message}
                />
              )}
            />
          </div>

          {/* API Error */}
          {apiError && (
            <div
              className="
                mb-4
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-3.5
                py-2.5
                text-xs
                text-red-600
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
              "
            >
              {apiError}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              flex h-11 w-full
              items-center justify-center
              gap-2
              rounded-xl
              bg-blue-600
              px-4
              text-sm
              font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-blue-600
              dark:hover:bg-blue-500
            "
          >
            {isSubmitting ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                Starting...
              </>
            ) : (
              <>
                Start Chat
                <ArrowRight size={17} />
              </>
            )}
          </button>

          <p
            className="
              mt-3
              text-center
              text-[11px]
              text-gray-400
              dark:text-gray-500
            "
          >
            Your information will only be used to provide support.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WelcomeUserModal;
