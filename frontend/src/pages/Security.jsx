import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  KeyRound,
  Smartphone,
  Monitor,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Laptop,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangePasswordModal from "../components/ChangePasswordModal";

export default function Security() {
  const navigate = useNavigate();

  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  const handleCloseChangePassword = () => {
    setOpenChangePasswordModal(false);
  };

  return (
    <div
      className="
        min-h-full
        w-full
        max-w-full
        overflow-x-hidden
        bg-transparent
        px-2
        py-4
        text-gray-900
        transition-colors
        duration-300
        dark:text-white
        sm:px-4
        sm:py-5
        md:px-6
        md:py-6
        lg:px-8
      "
    >
      <div className="mx-auto w-full max-w-6xl min-w-0">
        {/* Header */}

        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="
            mb-5
            flex
            min-w-0
            items-center
            gap-3
            sm:mb-6
          "
        >
          {/* Back Button */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Go Back"
            className="
              group
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-gray-200
              bg-white
              text-gray-600
              shadow-sm
              transition-all
              duration-200
              hover:border-blue-400
              hover:bg-blue-50
              hover:text-blue-600
              hover:shadow-md

              dark:border-white/10
              dark:bg-[#171b23]
              dark:text-gray-300
              dark:hover:border-blue-500/60
              dark:hover:bg-[#1d2432]
              dark:hover:text-blue-400

              sm:h-10
              sm:w-10
            "
          >
            <ArrowLeft
              size={18}
              className="
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
              "
            />
          </button>

          <div className="min-w-0">
            <h1
              className="
                truncate
                text-xl
                font-semibold
                text-gray-900
                dark:text-white
                sm:text-2xl
                md:text-3xl
              "
            >
              Security
            </h1>

            <p
              className="
                mt-1
                max-w-xl
                text-xs
                leading-5
                text-gray-500
                dark:text-gray-400
                sm:text-sm
              "
            >
              Manage your password, security settings and active sessions.
            </p>
          </div>
        </motion.div>

        {/* Security Overview */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="
            mb-5
            rounded-2xl
            border
            border-gray-200
            bg-white
            p-4
            shadow-sm
            transition-colors
            duration-300
            dark:border-white/10
            dark:bg-[#171b23]
            sm:p-5
            md:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="flex min-w-0 items-center gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-green-500/10
                  text-green-600
                  dark:text-green-400
                  sm:h-14
                  sm:w-14
                "
              >
                <ShieldCheck size={26} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold sm:text-lg">
                  Account Security
                </h2>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-gray-500
                    dark:text-gray-400
                    sm:text-sm
                  "
                >
                  Your account security is currently in good condition.
                </p>
              </div>
            </div>

            <div
              className="
                inline-flex
                w-fit
                shrink-0
                items-center
                gap-2
                rounded-full
                border
                border-green-500/20
                bg-green-500/10
                px-3
                py-1.5
                text-xs
                font-medium
                text-green-600
                dark:text-green-400
              "
            >
              <CheckCircle2 size={14} />
              Secure
            </div>
          </div>
        </motion.div>

        {/* Main Grid */}

        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          {/* Password */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="
              min-w-0
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#171b23]
              sm:p-5
              md:p-6
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-orange-500/10
                    text-orange-500
                  "
                >
                  <Lock size={19} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-base font-semibold sm:text-lg">
                    Password
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Manage your account password.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="
                mt-5
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-4
                dark:border-white/10
                dark:bg-[#11161f]
              "
            >
              <div className="flex items-start gap-3">
                <KeyRound size={18} className="mt-0.5 shrink-0 text-blue-500" />

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Keep your password secure
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Use a strong password and avoid sharing it with anyone.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpenChangePasswordModal(true)}
              className="
                mt-4
                w-full
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-gray-700
                transition-all
                hover:border-blue-400
                hover:bg-blue-50
                hover:text-blue-600
                active:scale-[0.98]

                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-gray-300
                dark:hover:border-blue-500
                dark:hover:bg-[#1d2432]
                dark:hover:text-blue-400
              "
            >
              Change Password
            </button>
          </motion.div>

          {/* Two Factor Authentication */}

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="
              min-w-0
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#171b23]
              sm:p-5
              md:p-6
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-purple-500/10
                  text-purple-500
                "
              >
                <Smartphone size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold sm:text-lg">
                  Two-Factor Authentication
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Add an extra layer of protection.
                </p>
              </div>
            </div>

            <div
              className="
                mt-5
                rounded-xl
                border
                border-yellow-500/20
                bg-yellow-500/10
                p-4
              "
            >
              <div className="flex items-start gap-3">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-yellow-500"
                />

                <div>
                  <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    Not enabled
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-yellow-700/80
                      dark:text-yellow-400/70
                    "
                  >
                    Enable two-factor authentication to improve account
                    protection.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="
                mt-4
                w-full
                rounded-xl
                bg-linear-to-r
                from-blue-500
                to-cyan-500
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                shadow-md
                shadow-blue-500/20
                transition
                hover:scale-[1.01]
                active:scale-[0.98]
              "
            >
              Enable 2FA
            </button>
          </motion.div>

          {/* Active Sessions */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              min-w-0
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#171b23]
              sm:p-5
              md:p-6
            "
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-500
                  "
                >
                  <Monitor size={19} />
                </div>

                <div>
                  <h2 className="text-base font-semibold sm:text-lg">
                    Active Sessions
                  </h2>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Devices currently signed in.
                  </p>
                </div>
              </div>

              <span
                className="
                  rounded-full
                  bg-green-500/10
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-green-600
                  dark:text-green-400
                "
              >
                1 Active
              </span>
            </div>

            <div
              className="
                mt-5
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                p-4
                dark:border-white/10
                dark:bg-[#11161f]
              "
            >
              <div className="flex items-start gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-blue-500/10
                    text-blue-500
                  "
                >
                  <Laptop size={18} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">Current Device</p>

                    <span
                      className="
                        rounded-full
                        bg-green-500/10
                        px-2
                        py-0.5
                        text-[10px]
                        font-medium
                        text-green-600
                        dark:text-green-400
                      "
                    >
                      Active
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Chrome · Windows
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-[11px] text-gray-400">
                    <Clock size={12} />
                    Active now
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-white
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-500
                transition
                hover:border-red-300
                hover:bg-red-50
                dark:border-white/10
                dark:bg-[#171b23]
                dark:text-red-400
                dark:hover:border-red-500/40
                dark:hover:bg-red-500/10
              "
            >
              <LogOut size={16} />
              Sign Out Other Devices
            </button>
          </motion.div>

          {/* Security Recommendations */}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="
              min-w-0
              rounded-2xl
              border
              border-gray-200
              bg-white
              p-4
              shadow-sm
              transition-colors
              duration-300
              dark:border-white/10
              dark:bg-[#171b23]
              sm:p-5
              md:p-6
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-cyan-500/10
                  text-cyan-500
                "
              >
                <UserCheck size={19} />
              </div>

              <div>
                <h2 className="text-base font-semibold sm:text-lg">
                  Security Recommendations
                </h2>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Keep your account protected.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                "
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-green-500"
                />

                <div>
                  <p className="text-sm font-medium">Use a strong password</p>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Avoid common passwords and reuse across multiple services.
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                "
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-green-500"
                />

                <div>
                  <p className="text-sm font-medium">
                    Keep your sessions secure
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Sign out from devices you no longer use.
                  </p>
                </div>
              </div>

              <div
                className="
                  flex
                  items-start
                  gap-3
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                "
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-green-500"
                />

                <div>
                  <p className="text-sm font-medium">
                    Enable two-factor authentication
                  </p>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                    Add another verification step when signing in.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Change Password Modal */}

      <AnimatePresence>
        {openChangePasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
              fixed
              inset-0
              z-9999
              flex
              items-center
              justify-center
              overflow-y-auto
              bg-black/50
              p-2
              backdrop-blur-sm
              dark:bg-black/70
              sm:p-4
            "
            onClick={handleCloseChangePassword}
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              transition={{
                duration: 0.3,
                ease: "easeOut",
              }}
              onClick={(e) => e.stopPropagation()}
              className="
                relative
                w-full
                max-w-md
                min-w-0
              "
            >
              <ChangePasswordModal
                setOpenChangePasswordModal={setOpenChangePasswordModal}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
