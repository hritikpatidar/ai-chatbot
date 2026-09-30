import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
  User,
  Mail,
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
      fixed inset-0
      z-999999
      flex
      items-center
      justify-center
      overflow-hidden
      bg-black/50
      px-3
      py-4
      sm:px-4
      sm:py-6
      backdrop-blur-sm
    "
    >
      {/* Modal */}
      <div
        className="
        relative
        w-full
        max-w-[calc(100vw-24px)]
        xs:max-w-sm
        sm:max-w-md
        mt-18
        max-h-[calc(85dvh-32px)]
        sm:max-h-[calc(100dvh-28px)]

        overflow-x-hidden
        overflow-y-auto

        rounded-xl
        sm:rounded-2xl

        border
        border-gray-200
        bg-white
        shadow-2xl

        dark:border-white/10
        dark:bg-[#11151d]

        overscroll-contain
      "
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="
          absolute
          right-3
          top-3
          sm:right-4
          sm:top-4
          z-20

          flex
          h-8
          w-8
          items-center
          justify-center

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
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div
          className="
          px-4
          pb-4
          pt-6

          sm:px-6
          sm:pb-5
          sm:pt-7

          md:px-7
        "
        >
          <div
            className="
            mb-4

            flex
            h-10
            w-10

            sm:h-12
            sm:w-12

            items-center
            justify-center

            rounded-xl

            bg-blue-100
            text-blue-600

            dark:bg-blue-500/10
            dark:text-blue-400
          "
          >
            <MessageCircle size={21} className="sm:hidden" />

            <MessageCircle size={24} className="hidden sm:block" />
          </div>

          <h2
            className="
            pr-8

            text-lg
            sm:text-xl

            font-semibold
            leading-tight

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

            text-xs
            sm:text-sm

            leading-5
            sm:leading-6

            text-gray-500
            dark:text-gray-400
          "
          >
            Before we get started, please share your details so we can provide
            you with better support.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
          px-4
          pb-5

          sm:px-6
          sm:pb-7

          md:px-7
        "
        >
          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="
              mb-1.5
              block

              text-xs
              sm:text-sm

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
                size={16}
                className="
                pointer-events-none
                absolute

                left-3
                sm:left-3.5

                top-1/2
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
                className="
                h-10
                sm:h-11

                w-full

                rounded-lg
                sm:rounded-xl

                border
                border-gray-300

                bg-white

                pl-9
                sm:pl-10
                pr-3

                text-xs
                sm:text-sm

                text-gray-900

                outline-none
                transition

                placeholder:text-gray-400

                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10

                dark:border-gray-700
                dark:bg-[#0d1117]
                dark:text-white
                dark:placeholder:text-gray-500
              "
              />
            </div>

            {errors.name && (
              <p className="mt-1.5 text-[11px] sm:text-xs text-red-500">
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

              text-xs
              sm:text-sm

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
                size={16}
                className="
                pointer-events-none
                absolute

                left-3
                sm:left-3.5

                top-1/2
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
                className="
                h-10
                sm:h-11

                w-full

                rounded-lg
                sm:rounded-xl

                border
                border-gray-300

                bg-white

                pl-9
                sm:pl-10
                pr-3

                text-xs
                sm:text-sm

                text-gray-900

                outline-none
                transition

                placeholder:text-gray-400

                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/10

                dark:border-gray-700
                dark:bg-[#0d1117]
                dark:text-white
                dark:placeholder:text-gray-500
              "
              />
            </div>

            {errors.email && (
              <p className="mt-1.5 text-[11px] sm:text-xs text-red-500">
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

              text-xs
              sm:text-sm

              font-medium

              text-gray-700
              dark:text-gray-300
            "
            >
              Phone number (optional)
            </label>

            <div className="w-full min-w-0 overflow-hidden">
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <PhoneInputField
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.phone?.message}
                  />
                )}
              />
            </div>
          </div>

          {/* API Error */}
          {apiError && (
            <div
              className="
              mb-4

              max-h-24
              overflow-y-auto
              overscroll-contain

              rounded-lg
              border
              border-red-200
              bg-red-50

              px-3
              py-2.5

              text-[11px]
              sm:text-xs

              leading-5
              break-words

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
            flex
            h-10
            sm:h-11

            w-full

            items-center
            justify-center
            gap-2

            rounded-lg
            sm:rounded-xl

            bg-blue-600

            px-3
            sm:px-4

            text-xs
            sm:text-sm

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
                <Loader2 size={16} className="animate-spin" />
                <span>Starting...</span>
              </>
            ) : (
              <>
                <span>Start Chat</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          <p
            className="
            mt-3
            px-2

            text-center

            text-[10px]
            sm:text-[11px]

            leading-4

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
