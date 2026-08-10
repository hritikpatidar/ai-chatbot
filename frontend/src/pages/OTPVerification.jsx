import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { setItemLocalStorage } from "../utils/browserServices";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { resendOtpService } from "../service/Auth/AuthServices";
import { useDispatch } from "react-redux";
import { verifyOtp } from "../redux/features/Auth/authSlice";

export default function OTPVerification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { state } = useLocation();
  const { email, purpose } = state || {};

  const [otp, setOtp] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(59);

  const inputRefs = useRef([]);

  // ==========================================
  // Timer
  // ==========================================

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ==========================================
  // Format Timer
  // ==========================================

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;

    return `${String(min).padStart(2, "0")}:${String(
      sec,
    ).padStart(2, "0")}`;
  };

  // ==========================================
  // OTP Change
  // ==========================================

  const handleOTPChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOTP = [...otp];

    newOTP[index] = value;

    setOtp(newOTP);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ==========================================
  // Backspace
  // ==========================================

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      otp[index] === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // ==========================================
  // Paste OTP
  // ==========================================

  const handlePaste = (e) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .trim()
      .slice(0, 6);

    if (!/^\d+$/.test(pasted)) return;

    const values = pasted.split("");

    const newOTP = [...otp];

    values.forEach((digit, index) => {
      newOTP[index] = digit;
    });

    setOtp(newOTP);

    const nextIndex = Math.min(values.length, 5);

    inputRefs.current[nextIndex]?.focus();
  };

  // ==========================================
  // Validate OTP
  // ==========================================

  const validate = () => {
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter complete OTP.");
      return false;
    }

    return true;
  };

  // ==========================================
  // Verify OTP
  // ==========================================

  const handleSubmit = async () => {
    if (!validate()) return;

    const code = otp.join("");

    const toastId = toast.loading(
      "Verifying OTP...",
    );

    try {
      setLoading(true);

      const payload = {
        otp: code,
        email,
        purpose: purpose || "register",
      };

      const response = await dispatch(
        verifyOtp(payload),
      ).unwrap();

      if (response?.success) {
        toast.success(response.message, {
          id: toastId,
        });

        if (response?.forgotPassword) {
          navigate("/reset-password", {
            state: {
              email,
              resetToken: response?.resetToken,
              purpose: "forgot_password",
            },
          });
        } else {
          setItemLocalStorage(
            "token",
            response?.accessToken,
          );

          setItemLocalStorage(
            "refreshToken",
            response?.refreshToken,
          );

          setItemLocalStorage(
            "userRole",
            response?.user?.role,
          );

          navigate("/");
        }
      } else {
        toast.error(
          response?.message || "Invalid OTP",
          {
            id: toastId,
          },
        );
      }
    } catch (error) {
      console.error(
        "OTP Verification Error:",
        error,
      );

      toast.error(
        error?.response?.message ||
          "Something went wrong",
        {
          id: toastId,
        },
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // Resend OTP
  // ==========================================

  const handleResendOTP = async () => {
    if (timer > 0) return;

    try {
      setResending(true);

      const toastId = toast.loading(
        "Sending OTP...",
      );

      const response = await resendOtpService({
        email,
        purpose: purpose || "register",
      });

      if (response?.data?.success) {
        toast.success(
          response.data.message,
          {
            id: toastId,
          },
        );
      } else {
        toast.error(
          response?.data?.message ||
            "Failed to resend OTP.",
          {
            id: toastId,
          },
        );
      }

      setTimer(59);

      setOtp([
        "",
        "",
        "",
        "",
        "",
        "",
      ]);

      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to resend OTP.",
      );
    } finally {
      setResending(false);
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
      {/* ==========================================
          Background Glow
      =========================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Left Glow */}

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

        {/* Bottom Right Glow */}

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

        {/* Center Glow */}

        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="
            absolute
            left-1/2
            top-1/2
            h-130
            w-130
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-blue-500/5
            blur-[180px]
            dark:bg-blue-500/10
          "
        />

        {/* Floating Particles */}

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

      {/* ==========================================
          Main Content
      =========================================== */}

      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
        }}
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
        {/* ==========================================
            OTP Card
        =========================================== */}

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
          {/* ==========================================
              Icon
          =========================================== */}

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
              from-cyan-400
              via-blue-500
              to-purple-600
              text-white
              shadow-[0_0_50px_rgba(59,130,246,.7)]
            "
          >
            <ShieldCheck size={34} />
          </motion.div>

          {/* ==========================================
              Heading
          =========================================== */}

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
            Verify OTP
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
            We've sent a 6-digit verification code to
          </p>

          <p
            className="
              mt-1
              truncate
              text-center
              text-sm
              font-semibold
              text-blue-600
              dark:text-cyan-400
            "
          >
            {email}
          </p>

          {/* ==========================================
              OTP Inputs
          =========================================== */}

          <div className="mt-8 flex justify-center gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) =>
                  (inputRefs.current[index] = el)
                }
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleOTPChange(
                    e.target.value,
                    index,
                  )
                }
                onKeyDown={(e) =>
                  handleKeyDown(e, index)
                }
                onPaste={handlePaste}
                whileFocus={{
                  scale: 1.05,
                }}
                className="
                  h-12
                  w-10
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-100
                  text-center
                  text-lg
                  font-semibold
                  text-gray-900
                  outline-none
                  transition-all
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-500/20
                  sm:h-14
                  sm:w-14
                  sm:text-xl
                  dark:border-white/10
                  dark:bg-[#151C2E]
                  dark:text-white
                  dark:focus:border-blue-400
                  dark:focus:ring-blue-500/30
                "
              />
            ))}
          </div>

          {/* ==========================================
              Timer
          =========================================== */}

          <p
            className="
              mt-6
              text-center
              text-sm
              text-gray-500
              dark:text-gray-400
            "
          >
            {timer > 0 ? (
              <>
                Resend OTP in{" "}
                <span
                  className="
                    font-semibold
                    text-cyan-600
                    dark:text-cyan-400
                  "
                >
                  {formatTime(timer)}
                </span>
              </>
            ) : (
              <span
                className="
                  font-medium
                  text-green-600
                  dark:text-green-400
                "
              >
                You can now resend the OTP.
              </span>
            )}
          </p>

          {/* ==========================================
              Verify Button
          =========================================== */}

          <motion.button
            type="button"
            whileHover={{
              scale: 1.02,
            }}
            whileTap={{
              scale: 0.97,
            }}
            disabled={loading}
            onClick={handleSubmit}
            className="
              mt-8
              w-full
              rounded-xl
              bg-linear-to-r
              from-cyan-500
              to-blue-600
              py-3
              font-semibold
              text-white
              transition-all
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </motion.button>

          {/* ==========================================
              Resend
          =========================================== */}

          <button
            type="button"
            disabled={
              timer > 0 || resending
            }
            onClick={handleResendOTP}
            className={`
              mt-5
              w-full
              text-sm
              font-medium
              transition
              ${
                timer > 0 || resending
                  ? "cursor-not-allowed text-gray-400 dark:text-gray-500"
                  : "text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
              }
            `}
          >
            {resending
              ? "Sending..."
              : "Resend OTP"}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}