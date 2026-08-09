import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const { email, purpose } = state;
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(59);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleOTPChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
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

  const validate = () => {
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter complete OTP.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const code = otp.join("");
    const toastId = toast.loading("Verifying OTP...");
    try {
      setLoading(true);
      const payload = {
        otp: code,
        email,
        purpose: purpose || "register",
      };
      const response = await dispatch(verifyOtp(payload)).unwrap();
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
          setItemLocalStorage("token", response?.accessToken);
          setItemLocalStorage("refreshToken", response?.refreshToken);
          setItemLocalStorage("userRole", response?.user?.role);
          navigate("/");
        }
      } else {
        toast.error(response.message || "Invalid OTP", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error);
      toast.error(error.response?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (timer > 0) return;
    try {
      setResending(true);
      const toastId = toast.loading("Sending OTP...");
      const response = await resendOtpService({
        email,
        purpose: purpose || "register",
      });
      if (response.data.success) {
        toast.success(response.data.message, {
          id: toastId,
        });
      } else {
        toast.error(response.data.message || "Failed to resend OTP.", {
          id: toastId,
        });
      }
      setTimer(59);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0B1120] px-6">
      {/* Background Glow */}
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/20 blur-[130px]" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-[130px]" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
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
        <h2 className="mt-8 text-center text-3xl font-bold text-white">
          Verify OTP
        </h2>
        <p className="mt-3 text-center text-gray-400">
          We've sent a 6-digit verification code to
        </p>
        <p className="mt-1 text-center font-medium text-cyan-400">{email}</p>

        {/* OTP */}
        <div className="mt-8 flex justify-center gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOTPChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="h-14 w-14 rounded-xl border border-white/10 bg-[#151C2E] text-center text-xl font-semibold text-white outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30"
            />
          ))}
        </div>

        {/* Timer */}
        <p className="mt-6 text-center text-sm text-gray-400">
          {timer > 0 ? (
            <>
              Resend OTP in{" "}
              <span className="font-semibold text-cyan-400">
                {formatTime(timer)}
              </span>
            </>
          ) : (
            <span className="font-medium text-green-400">
              You can now resend the OTP.
            </span>
          )}
        </p>

        {/* Verify Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          onClick={handleSubmit}
          className="mt-8 w-full rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 py-3 font-semibold text-white transition-all"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </motion.button>

        {/* Resend */}
        <button
          type="button"
          disabled={timer > 0 || resending}
          onClick={handleResendOTP}
          className={`mt-5 w-full text-sm font-medium transition ${
            timer > 0
              ? "cursor-not-allowed text-gray-500"
              : "text-cyan-400 hover:text-cyan-300"
          }`}
        >
          {resending ? "Sending..." : timer > 0 ? "Resend OTP" : "Resend OTP"}
        </button>

        {/* Back */}
        {/* <button
          onClick={() => {
            navigate(-1);
          }}
          className="mt-6 flex w-full items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Login
        </button> */}
      </motion.div>
    </div>
  );
}
