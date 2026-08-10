import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "../utils/validation";
import { resetPasswordService } from "../service/Auth/AuthServices";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { email = "", purpose = "", resetToken = "" } = state || {};

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        resetToken: resetToken,
        password: data.password,
      };

      const response = await resetPasswordService(payload);
      if (response?.data?.success) {
        toast.success(response?.data?.message);
        navigate("/login");
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Reset Password Error:", error);
      toast.error("An error occurred while resetting your password.");
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1120] px-5">
      <AnimatedBackground />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#171b23]/80 p-7 backdrop-blur-xl shadow-2xl"
      >
        {/* Icon */}

        <motion.div
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 via-blue-500 to-purple-600 shadow-[0_0_50px_rgba(59,130,246,.7)]"
        >
          <ShieldCheck size={38} className="text-white" />
        </motion.div>

        {/* Heading */}

        <h2 className="mt-6 text-center text-2xl font-bold text-white">
          Reset Password
        </h2>

        <p className="mt-2 text-center text-sm text-gray-400">
          Create a strong password for your account.
        </p>

        {/* Form */}

        <form className="mt-7 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Password */}

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              New Password <span className={"text-red-400"}>*</span>
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-[#222938] px-3 focus-within:border-blue-500">
              <Lock size={16} className="text-gray-400" />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500"
                {...register("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={17} className="text-gray-400" />
                ) : (
                  <Eye size={17} className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-xs text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              Confirm Password <span className={"text-red-400"}>*</span>
            </label>

            <div className="flex items-center rounded-xl border border-white/10 bg-[#222938] px-3 focus-within:border-blue-500">
              <Lock size={16} className="text-gray-400" />

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full bg-transparent px-3 py-3 text-sm text-white outline-none placeholder:text-gray-500"
                {...register("confirmPassword")}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} className="text-gray-400" />
                ) : (
                  <Eye size={17} className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit */}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        {/* Back */}

        <button
          onClick={() => navigate("/login")}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </motion.div>
    </div>
  );
}
