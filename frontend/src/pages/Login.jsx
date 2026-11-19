import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  Check,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getItemLocalStorage, setItemLocalStorage } from "../utils/browserServices";
import AnimatedBackground from "../components/AnimatedBackground";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  loginUser,
  verifyAdminLoginOtp,
} from "../redux/features/Auth/authSlice";
import toast from "react-hot-toast";
import { loginSchema } from "../utils/validation";
import { generateToken } from "../firebase";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import { useLanguage } from "../context/LanguageContext";

export default function Login() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [challengeId, setChallengeId] = useState("");
  const [otp, setOtp] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      if (challengeId) {
        const response = await dispatch(
          verifyAdminLoginOtp({ challengeId, otp }),
        ).unwrap();
        finishLogin(response);
        return;
      }

      const fcmToken =
        getItemLocalStorage("fcm_token") || (await generateToken());
      const payload = {
        ...data,
        ...(typeof fcmToken === "string" && fcmToken ? { fcmToken } : {}),
      };
      const response = await dispatch(loginUser(payload)).unwrap();
      if (response?.requiresTwoFactor && response?.challengeId) {
        setChallengeId(response.challengeId);
        toast.success(response.message);
        return;
      }
      if (response?.success) {
        finishLogin(response);
      } else {
        toast.error(response?.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage =
        error?.message || "An error occurred while logging in.";
      if (challengeId && /expired|log in again/i.test(errorMessage)) {
        setChallengeId("");
        setOtp("");
      }
      toast.error(errorMessage);
    }
  };

  const handleLoginSubmit = challengeId
    ? (event) => {
        event.preventDefault();
        onSubmit();
      }
    : handleSubmit(onSubmit);

  const finishLogin = (response) => {
    toast.success(response?.message || t("Login successful"));
    setItemLocalStorage("token", response?.accessToken);
    setItemLocalStorage("refreshToken", response?.refreshToken);
    setItemLocalStorage("userRole", response?.user?.role);
    if (response?.user?.role === "client") {
      navigate("/client");
    } else if (response?.user?.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-gray-50
        text-gray-900
        transition-colors
        duration-500
        dark:bg-[#0b0f17]
        dark:text-white
      "
    >
      <div className="absolute right-4 top-4 z-20">
        <LanguageSwitcher />
      </div>
      {/* Background */}
      {/* <AnimatedBackground /> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="
          relative
          z-10
          mx-auto
          flex
          min-h-screen
          max-w-7xl
        "
      >
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          className="
            hidden
            flex-1
            items-center
            justify-center
            px-8
            lg:flex
          "
        >
          <div className="max-w-xl text-center">
            <div className="relative flex justify-center">
              {/* Animated Glow */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.25, 0.6, 0.25],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  h-28
                  w-28
                  rounded-full
                  bg-linear-to-r
                  from-blue-500
                  via-cyan-400
                  to-purple-600
                  blur-3xl
                "
              />

              {/* Orbit Particles */}
              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8 + index,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute h-40 w-40"
                >
                  <div
                    className="
                      absolute
                      h-2
                      w-2
                      rounded-full
                      bg-cyan-400
                      shadow-[0_0_12px_#22d3ee]
                    "
                    style={{
                      top: "0%",
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{
                  scale: 0.3,
                  rotate: -180,
                  opacity: 0,
                }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 360],
                  y: [0, -12, 0],
                  opacity: 1,
                }}
                transition={{
                  opacity: {
                    duration: 1,
                  },
                  scale: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  },
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  scale: 1.12,
                }}
                className="
                  relative
                  flex
                  h-28
                  w-28
                  items-center
                  justify-center
                  rounded-full
                  bg-linear-to-br
                  from-cyan-400
                  via-blue-500
                  to-purple-600
                  shadow-[0_0_80px_rgba(59,130,246,.8)]
                "
              >
                {/* Inner Glow */}
                <motion.div
                  animate={{
                    scale: [1, 1.25, 1],
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                  className="
                    absolute
                    inset-5
                    rounded-full
                    bg-white/20
                    blur-xl
                  "
                />

                {/* Sparkles */}

                <motion.div
                  animate={{
                    rotate: [0, -15, 15, 0],
                    scale: [1, 1.15, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles size={34} className="relative z-10 text-white" />
                </motion.div>
              </motion.div>
            </div>

            <motion.h1
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mt-8
                text-3xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              {t("AI Assistant")}
            </motion.h1>

            <motion.p
              animate={{
                opacity: [0.65, 1, 0.65],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="
                mt-3
                text-sm
                leading-6
                text-gray-600
                dark:text-gray-400
              "
            >
              {t("Experience next-generation AI conversations with a clean, fast and intelligent assistant.")}
            </motion.p>
          </div>
        </motion.div>

        <div
          className="
            flex
            w-full
            items-center
            justify-center
            px-5
            py-6
            lg:w-120
            xl:w-175
          "
        >
          <motion.div
            initial={{
              x: 120,
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              x: 0,
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="
              w-full
              rounded-2xl
              border
              border-gray-200
              bg-white/85
              p-8
              shadow-2xl
              backdrop-blur-xl
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#171b23]/80
            "
          >
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.6,
              }}
              className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              {challengeId
                ? t("Verify your login")
                : t("Welcome Back 👋")}
            </motion.h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {challengeId
                ? t("Enter the 6-digit code sent to your admin email")
                : t("Sign in to continue")}
            </p>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                staggerChildren: 0.12,
              }}
              className="mt-6 space-y-4"
              autoComplete="off"
              onSubmit={handleLoginSubmit}
            >
              {!challengeId && (
              <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
              >
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  {t("Email")}{" "}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </label>

                <div
                  className="
                    flex
                    items-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-100
                    px-4
                    transition
                    focus-within:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                  "
                >
                  <Mail size={16} className="text-gray-400" />

                  <input
                    type="email"
                    placeholder={t("Enter your email")}
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-3
                      text-gray-900
                      outline-none
                      placeholder:text-gray-400
                      dark:text-white
                      dark:placeholder:text-gray-500
                    "
                    {...register("email")}
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>
              )}

              {!challengeId && (
              <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
              >
                <label
                  className="
                    mb-2
                    block
                    text-sm
                    text-gray-700
                    dark:text-gray-300
                  "
                >
                  {t("Password")}{" "}
                  <span className="text-red-500 dark:text-red-400">*</span>
                </label>

                <div
                  className="
                    flex
                    items-center
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-100
                    px-4
                    transition
                    focus-within:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                  "
                >
                  <Lock size={18} className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("Enter your password")}
                    className="
                      w-full
                      bg-transparent
                      px-3
                      py-3
                      text-gray-900
                      outline-none
                      placeholder:text-gray-400
                      dark:text-white
                      dark:placeholder:text-gray-500
                    "
                    {...register("password")}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    ) : (
                      <Eye
                        size={16}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>
              )}

              {challengeId ? (
                <motion.div
                  initial={{ y: 25, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.45 }}
                >
                  <label
                    className="
                      mb-2
                      block
                      text-sm
                      text-gray-700
                      dark:text-gray-300
                    "
                  >
                    {t("Verification code")}
                    <span className="text-red-500 dark:text-red-400"> *</span>
                  </label>
                  <div
                    className="
                      flex
                      items-center
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-100
                      px-4
                      transition
                      focus-within:border-blue-500
                      dark:border-white/10
                      dark:bg-[#222938]
                    "
                  >
                    <ShieldCheck size={18} className="text-gray-400" />
                    <input
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      placeholder={t("Enter 6-digit code")}
                      value={otp}
                      onChange={(event) =>
                        setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      className="
                        w-full
                        bg-transparent
                        px-3
                        py-3
                        text-gray-900
                        tracking-[0.3em]
                        outline-none
                        placeholder:tracking-normal
                        placeholder:text-gray-400
                        dark:text-white
                        dark:placeholder:text-gray-500
                      "
                    />
                  </div>
                </motion.div>
              ) : (
              <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.45 }}
                className="
                  flex
                  items-center
                  justify-between
                  text-sm
                "
              >
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    className="
                      h-4
                      w-4
                      cursor-pointer
                      rounded
                      accent-blue-600
                    "
                    {...register("remember")}
                  />

                  <span
                    className="
                      text-sm
                      text-gray-600
                      dark:text-gray-400
                    "
                  >
                    {t("Remember me")}
                  </span>
                </label>

                <button
                  type="button"
                  className="
                    text-blue-600
                    hover:text-blue-700
                    dark:text-blue-400
                    dark:hover:text-blue-300
                  "
                  onClick={() => navigate("/forgot-password")}
                >
                  {t("Forgot Password?")}
                </button>
              </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting || (challengeId && otp.length !== 6)}
                whileHover={{
                  scale: 1.03,
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  w-full
                  rounded-xl
                  bg-linear-to-r
                  from-blue-500
                  to-purple-600
                  py-2.5
                  text-sm
                  font-semibold
                  text-white
                "
              >
                {isSubmitting
                  ? challengeId
                    ? t("Verifying...")
                    : t("Logging in...")
                  : challengeId
                    ? t("Verify and sign in")
                    : t("Login")}
              </motion.button>

              {challengeId && (
                <button
                  type="button"
                  onClick={() => {
                    setChallengeId("");
                    setOtp("");
                  }}
                  className="w-full text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                >
                  {t("Back to sign in")}
                </button>
              )}

              {!challengeId && (
              <>
              <div className="flex items-center gap-3">
                <div
                  className="
                    h-px
                    flex-1
                    bg-gray-200
                    dark:bg-white/10
                  "
                />

                <span className="text-sm text-gray-500">{t("OR")}</span>

                <div
                  className="
                    h-px
                    flex-1
                    bg-gray-200
                    dark:bg-white/10
                  "
                />
              </div>

              <button
                type="button"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-100
                  py-2.5
                  text-sm
                  text-gray-800
                  transition
                  hover:bg-gray-200
                  dark:border-white/10
                  dark:bg-[#222938]
                  dark:text-white
                  dark:hover:bg-[#2c3547]
                "
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                {t("Continue with Google")}
              </button>
              </>
              )}
            </motion.form>

            <p
              className="
                mt-6
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              {!challengeId && t("Don't have an account?")}
              {!challengeId && (
              <button
                onClick={() => navigate("/signup")}
                className="
                  ml-2
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                  dark:text-blue-400
                  dark:hover:text-blue-300
                "
              >
                Sign Up
              </button>
              )}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
