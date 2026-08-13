import { motion } from "framer-motion";
import { Mail, ChevronLeft, Sparkles, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { forgotPasswordSchema } from "../utils/validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordService } from "../service/Auth/AuthServices";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await forgotPasswordService({
        email: data.email,
        purpose: "forgot_password",
      });

      if (response?.data?.success) {
        toast.success(response?.data?.message);

        navigate("/otp-verification", {
          state: {
            email: data.email,
            purpose: "forgot_password",
          },
        });
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);

      toast.error("An error occurred while processing your request.");
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

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-0
            top-0
            h-80
            w-80
            rounded-full
            bg-purple-500/5
            blur-[150px]
            dark:bg-purple-500/10
          "
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [15, -15, 15],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
          className="
            absolute
            bottom-0
            right-0
            h-80
            w-80
            rounded-full
            bg-cyan-500/5
            blur-[150px]
            dark:bg-cyan-500/10
          "
        />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-162.5
            w-162.5
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/5
            blur-[180px]
            dark:bg-blue-500/10
          "
        />

        {[...Array(58)].map((_, i) => (
          <motion.div
            key={i}
            className="
              absolute
              rounded-full
              bg-cyan-600/20
              dark:bg-cyan-400/30
            "
            style={{
              width: `${4 + Math.random() * 6}px`,
              height: `${4 + Math.random() * 6}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.4, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="
          relative
          z-10
          flex
          min-h-screen
          items-center
          justify-center
          px-5
          py-10
        "
      >
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.9,
            y: 40,
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            w-full
            max-w-md
            rounded-3xl
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
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mb-6
              flex
              items-center
              gap-2
              text-sm
              text-gray-500
              transition
              hover:text-gray-900
              dark:text-gray-400
              dark:hover:text-white
            "
          >
            <ChevronLeft size={18} />
            Back
          </button>

          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
            }}
            className="
              mx-auto
              flex
              h-20
              w-20
              items-center
              justify-center
              rounded-full
              bg-linear-to-br
              from-cyan-500
              to-blue-600
              text-white
              shadow-[0_0_40px_rgba(59,130,246,.5)]
            "
          >
            <Sparkles size={34} />
          </motion.div>

          <h1
            className="
              mt-6
              text-center
              text-3xl
              font-bold
              text-gray-900
              dark:text-white
            "
          >
            Forgot Password
          </h1>

          <p
            className="
              mt-3
              text-center
              leading-7
              text-gray-600
              dark:text-gray-400
            "
          >
            Enter your registered email address and we'll send you a password
            reset link.
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}

            <div>
              <label
                className="
                  mb-2
                  block
                  text-sm
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
                  px-4
                  transition
                  focus-within:border-blue-500
                  dark:border-white/10
                  dark:bg-[#222938]
                "
              >
                <Mail size={18} className="text-gray-400" />

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="
                    w-full
                    bg-transparent
                    px-3
                    py-4
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
                <p
                  className="
                    mt-2
                    text-sm
                    text-red-500
                    dark:text-red-400
                  "
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.03,
              }}
              whileTap={{
                scale: 0.97,
              }}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-linear-to-r
                from-blue-500
                to-purple-600
                py-3
                font-semibold
                text-white
                transition
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
              disabled={isSubmitting}
            >
              <Send size={18} />

              {isSubmitting ? "Sending..." : "Send OTP"}
            </motion.button>
          </form>

          <p
            className="
              mt-8
              text-center
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            Remember your password?
            <button
              type="button"
              onClick={() => navigate("/login")}
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
      </motion.div>
    </div>
  );
}
