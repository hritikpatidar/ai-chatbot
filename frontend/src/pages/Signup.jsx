import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";
import { signupSchema } from "../utils/validation";
import { useDispatch } from "react-redux";
import { signupService } from "../service/Auth/AuthServices";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await signupService({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        terms: data.terms,
      });

      if (response.data.success) {
        toast.success(response.data.message || "Account created successfully.");

        navigate("/otp-verification", {
          state: {
            email: data.email,
            purpose: "register",
          },
        });
      } else {
        toast.error(response.data.message || "Failed to create account.");
      }
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to create account.");
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
      {/* Background */}
      {/* <AnimatedBackground /> */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="
          relative
          z-10
          flex
          min-h-screen
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
            {/* AI Orb */}

            <div className="relative flex justify-center">
              {/* Background Glow */}

              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.25, 0.55, 0.25],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="
                  absolute
                  h-40
                  w-40
                  rounded-full
                  bg-linear-to-r
                  from-cyan-400
                  via-blue-500
                  to-purple-600
                  blur-3xl
                "
              />

              {/* Orbit Particles */}

              {[...Array(8)].map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 8 + index,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="
                    absolute
                    h-40
                    w-40
                  "
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

              {/* Main Orb */}

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
                  shadow-[0_0_60px_rgba(59,130,246,.8)]
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
                  <Sparkles
                    size={34}
                    className="
                      relative
                      z-10
                      text-white
                    "
                  />
                </motion.div>
              </motion.div>
            </div>

            {/* Heading */}

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
              Join AI Assistant
            </motion.h1>

            {/* Description */}

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
              Create your account and unlock powerful AI tools, conversations,
              image generation and much more.
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
              opacity: 0,
              x: 120,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              x: 0,
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
              p-6
              shadow-2xl
              backdrop-blur-xl
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#171b23]/80
            "
          >
            <motion.h2
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              transition={{
                delay: 0.3,
                duration: 0.5,
              }}
              className="
                text-2xl
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              Create Account 🚀
            </motion.h2>

            <p
              className="
                mt-1
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Fill your details to get started.
            </p>

            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 0.5,
                staggerChildren: 0.12,
              }}
              className="mt-5 space-y-3.5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
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
                  Full Name{" "}
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
                    px-3
                    transition
                    focus-within:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                  "
                >
                  <User size={16} className="text-gray-400" />

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    {...register("fullName")}
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
                  />
                </div>

                {errors.fullName && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.fullName.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
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
                  Email Address{" "}
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
                    px-3
                    transition
                    focus-within:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                  "
                >
                  <Mail size={16} className="text-gray-400" />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
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
                  />
                </div>

                {errors.email && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.email.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
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
                  Password{" "}
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
                    px-3
                    transition
                    focus-within:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                  "
                >
                  <Lock size={16} className="text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    {...register("password")}
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
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.password.message}
                  </p>
                )}
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
              >
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
                  Confirm Password{" "}
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
                    px-3
                    transition
                    focus-within:border-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                  "
                >
                  <Lock size={16} className="text-gray-400" />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    {...register("confirmPassword")}
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
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="shrink-0"
                  >
                    {showConfirmPassword ? (
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

                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </motion.div>

              <label className="group flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  {...register("terms")}
                  className="
                    mt-1
                    h-4
                    w-4
                    shrink-0
                    cursor-pointer
                    rounded-md
                    border
                    border-gray-300
                    bg-gray-100
                    accent-blue-600
                    transition-all
                    duration-200
                    hover:scale-105
                    dark:border-gray-600
                    dark:bg-[#1f2430]
                    dark:accent-gray-500
                  "
                />

                <span
                  className="
                    text-xs
                    leading-5
                    text-gray-600
                    dark:text-gray-400
                  "
                >
                  I agree to{" "}
                  <button
                    type="button"
                    className="
                      font-medium
                      text-blue-600
                      transition-colors
                      hover:text-blue-700
                      dark:text-blue-400
                      dark:hover:text-blue-300
                    "
                    onClick={() => navigate("/terms-and-conditions")}
                  >
                    Terms & Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="
                      font-medium
                      text-blue-600
                      transition-colors
                      hover:text-blue-700
                      dark:text-blue-400
                      dark:hover:text-blue-300
                    "
                    onClick={() => navigate("/privacy-policy")}
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>

              {errors.terms && (
                <p className="text-xs text-red-500 dark:text-red-400">
                  {errors.terms.message}
                </p>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 0 30px rgba(59,130,246,.35)",
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
                  transition
                  hover:scale-[1.02]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </motion.button>

              <div className="flex items-center gap-3">
                <div
                  className="
                    h-px
                    flex-1
                    bg-gray-200
                    dark:bg-white/10
                  "
                />

                <span className="text-sm text-gray-500">OR</span>

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
                  dark:hover:bg-[#2b3447]
                "
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                Continue with Google
              </button>
            </motion.form>

            {/* Login */}

            <p
              className="
                mt-5
                text-center
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Already have an account?
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
                className="
                  ml-2
                  font-semibold
                  text-blue-600
                  hover:text-blue-700
                  dark:text-blue-400
                  dark:hover:text-blue-300
                "
              >
                Login
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
