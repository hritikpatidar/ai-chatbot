import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { changePasswordSchema } from "../utils/validation";
import { ChangePasswordService } from "../service/Auth/AuthServices";
import { useNavigate } from "react-router-dom";
import { handleLogout } from "../utils/logout";

const PasswordInput = ({
  label,
  placeholder,
  registerName,
  error,
  showPassword,
  setShowPassword,
}) => {
  return (
    <div>
      {/* Label */}
      <label
        className="
          mb-1.5
          block
          text-xs
          font-medium
          text-gray-700
          dark:text-gray-300
        "
      >
        {label}

        <span className="ml-1 text-red-500">*</span>
      </label>

      {/* Input Wrapper */}
      <div
        className={`
          flex
          items-center
          rounded-xl
          border
          px-3
          transition-all
          duration-200

          ${
            error
              ? `
                border-red-400
                bg-red-50
                dark:border-red-500/50
                dark:bg-red-500/5
              `
              : `
                border-gray-200
                bg-gray-100
                focus-within:border-blue-500
                focus-within:ring-2
                focus-within:ring-blue-500/10

                dark:border-white/10
                dark:bg-[#222938]
                dark:focus-within:border-blue-500
                dark:focus-within:ring-blue-500/20
              `
          }
        `}
      >
        <Lock size={15} className="shrink-0 text-gray-400" />

        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          className="
            w-full
            bg-transparent
            px-3
            py-2.5
            text-sm
            text-gray-900
            outline-none
            placeholder:text-gray-400
            dark:text-white
            dark:placeholder:text-gray-500
          "
          {...registerName}
        />

        {/* Show / Hide Password */}
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="
            shrink-0
            text-gray-500
            transition
            hover:text-gray-900
            dark:text-gray-400
            dark:hover:text-white
          "
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Validation Error */}
      {error && (
        <p
          className="
            mt-1
            text-[11px]
            leading-4
            text-red-500
            dark:text-red-400
          "
        >
          {error.message}
        </p>
      )}
    </div>
  );
};

const ChangePasswordModal = ({ setOpenChangePasswordModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { refreshToken } = useSelector((store) => store.authReducer.AuthSlice);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });

  /* =========================================================
     Close Modal
  ========================================================= */

  const handleClose = () => {
    if (isSubmitting) return;

    reset();

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setOpenChangePasswordModal(false);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        currentPassword: data.currentPassword,
        newPassword: data.password,
      };

      const response = await ChangePasswordService(payload);

      if (response?.data?.success) {
        toast.success(
          response?.data?.message || "Password changed successfully.",
        );

        reset();
        await handleLogout({
          dispatch,
          navigate,
          refreshToken,
        });
      } else {
        toast.error(response?.data?.message || "Unable to change password.");
      }
    } catch (error) {
      console.error("Change Password Error:", error);

      toast.error(
        error?.response?.data?.message || "Current password is incorrect.",
      );
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      transition={{
        duration: 0.35,
      }}
      className="
        relative
        z-10
        flex
        items-center
        justify-center
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 25,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}
        transition={{
          duration: 0.3,
          ease: "easeOut",
        }}
        className="
          relative
          w-full
          max-w-md
          rounded-2xl
          border
          border-gray-200
          bg-white/90
          p-5
          shadow-2xl
          backdrop-blur-xl
          transition-colors
          duration-300

          dark:border-white/10
          dark:bg-[#171b23]/90

          sm:rounded-3xl
          sm:p-6
        "
      >
        <motion.div
          animate={{
            scale: [1, 1.06, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.2,
            ease: "easeInOut",
          }}
          className="
            mx-auto
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-full
            bg-linear-to-br
            from-cyan-400
            via-blue-500
            to-purple-600
            text-white
            shadow-[0_0_40px_rgba(59,130,246,.55)]
            sm:h-17
            sm:w-17
          "
        >
          <ShieldCheck size={30} className="text-white sm:size-8" />
        </motion.div>

        <h2
          className="
            mt-4
            text-center
            text-xl
            font-bold
            text-gray-900
            dark:text-white
            sm:text-2xl
          "
        >
          Change Password
        </h2>

        <p
          className="
            mt-1
            text-center
            text-xs
            text-gray-600
            dark:text-gray-400
          "
        >
          Update your account password securely.
        </p>

        <form
          className="
            mt-5
            space-y-3.5
          "
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Current Password */}

          <PasswordInput
            label="Current Password"
            placeholder="Enter current password"
            registerName={register("currentPassword")}
            error={errors.currentPassword}
            showPassword={showCurrentPassword}
            setShowPassword={setShowCurrentPassword}
          />

          {/* New Password */}

          <PasswordInput
            label="New Password"
            placeholder="Enter new password"
            registerName={register("password")}
            error={errors.password}
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
          />

          {/* Confirm Password */}

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm new password"
            registerName={register("confirmPassword")}
            error={errors.confirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
          />
          <div
            className="
              rounded-xl
              border
              border-blue-500/20
              bg-blue-500/5
              px-3
              py-2.5
            "
          >
            <p
              className="
                text-[10px]
                leading-4
                text-blue-600
                dark:text-blue-300
              "
            >
              Your current password is required to verify your identity before
              changing your password.
            </p>
          </div>

          <motion.button
            whileHover={{
              scale: isSubmitting ? 1 : 1.015,
            }}
            whileTap={{
              scale: isSubmitting ? 1 : 0.98,
            }}
            type="submit"
            disabled={isSubmitting}
            className="
              w-full
              rounded-xl
              bg-linear-to-r
              from-cyan-500
              to-blue-600
              py-2.5
              text-sm
              font-semibold
              text-white
              shadow-lg
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting ? "Changing Password..." : "Change Password"}
          </motion.button>
        </form>

        <button
          type="button"
          onClick={handleClose}
          disabled={isSubmitting}
          className="
            mt-3
            flex
            w-full
            items-center
            justify-center
            gap-2
            text-xs
            text-gray-500
            transition-colors
            hover:text-gray-900
            dark:text-gray-400
            dark:hover:text-white
          "
        >
          <ArrowLeft size={14} />
          Back
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ChangePasswordModal;
