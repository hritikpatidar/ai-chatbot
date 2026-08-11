import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  CalendarDays,
  ShieldCheck,
  Lock,
  Edit3,
  CheckCircle2,
  Camera,
  ArrowLeft,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import profile from "../assets/profile1.jpg";
import EditProfileModal from "../components/EditProfileModal";
import { setIsProfileModalOpen } from "../redux/features/Auth/authSlice";
import ChangePasswordModal from "../components/ChangePasswordModal";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../utils/imageUrl";

export default function Profile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profileDetails, isProfileModalOpen } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );

  const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);

  // ==========================================
  // Open Edit Profile
  // ==========================================

  const handleOpenProfileModal = () => {
    dispatch(setIsProfileModalOpen(true));
  };

  // ==========================================
  // Close Change Password Modal
  // ==========================================

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
        {/* ==========================================
            Page Header
        ========================================== */}

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

          {/* Page Title */}

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
              Profile
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
              Manage your personal information and account.
            </p>
          </div>
        </motion.div>

        {/* ==========================================
            Main Grid
        ========================================== */}

        <div
          className="
            grid
            min-w-0
            grid-cols-1
            gap-4
            sm:gap-5
            lg:grid-cols-[300px_minmax(0,1fr)]
            xl:grid-cols-[320px_minmax(0,1fr)]
          "
        >
          {/* ==========================================
              Profile Card
          ========================================== */}

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
            {/* Avatar Section */}

            <div className="flex min-w-0 flex-col items-center text-center">
              <div className="relative shrink-0">
                {/* Profile Image */}

                <div
                  className="
                    h-24
                    w-24
                    overflow-hidden
                    rounded-full
                    border-4
                    border-blue-500/20
                    bg-gray-100
                    shadow-lg
                    dark:bg-[#222938]
                    sm:h-28
                    sm:w-28
                  "
                >
                  <img
                    src={getImageUrl(profileDetails?.profileImage, profile)}
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = profile;
                    }}
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Online Status */}

                <span
                  className="
                    absolute
                    bottom-0
                    right-0
                    flex
                    h-6
                    w-6
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-white
                    bg-green-500
                    dark:border-[#171b23]
                    sm:h-7
                    sm:w-7
                  "
                >
                  <CheckCircle2
                    size={12}
                    className="text-white sm:h-3.25 sm:w-3.25"
                  />
                </span>

                {/* Camera */}

                {/* <button
                  type="button"
                  className="
                    absolute
                    bottom-0
                    left-0
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    text-gray-600
                    shadow-md
                    transition
                    hover:border-blue-400
                    hover:text-blue-500
                    dark:border-white/10
                    dark:bg-[#222938]
                    dark:text-gray-300
                    dark:hover:border-blue-500
                    dark:hover:text-blue-400
                    sm:h-8
                    sm:w-8
                  "
                  title="Change profile image"
                >
                  <Camera size={13} />
                </button> */}
              </div>

              {/* Name */}

              <h2
                className="
                  mt-4
                  w-full
                  max-w-full
                  truncate
                  px-2
                  text-lg
                  font-semibold
                  sm:mt-5
                  sm:text-xl
                "
                title={profileDetails?.fullName || "User"}
              >
                {profileDetails?.fullName || "User"}
              </h2>

              {/* Email */}

              <p
                className="
                  mt-1
                  w-full
                  max-w-full
                  truncate
                  px-2
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                  sm:text-sm
                "
                title={profileDetails?.email || "No email available"}
              >
                {profileDetails?.email || "No email available"}
              </p>

              {/* Status */}

              <div
                className="
                  mt-4
                  inline-flex
                  max-w-full
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-green-500/20
                  bg-green-500/10
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  text-green-600
                  dark:text-green-400
                  sm:text-xs
                "
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-green-500" />
                <span>Active Account</span>
              </div>
            </div>

            {/* Divider */}

            <div className="my-5 border-t border-gray-200 dark:border-white/10 sm:my-6" />

            {/* Edit Profile */}

            <button
              type="button"
              onClick={handleOpenProfileModal}
              className="
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-linear-to-r
                from-blue-500
                to-cyan-500
                px-4
                py-2.5
                text-xs
                font-semibold
                text-white
                shadow-md
                shadow-blue-500/20
                transition
                duration-200
                hover:scale-[1.01]
                hover:shadow-lg
                active:scale-[0.99]
                sm:text-sm
              "
            >
              <Edit3 size={15} />
              Edit Profile
            </button>
          </motion.div>

          {/* ==========================================
              Account Information
          ========================================== */}

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
            {/* Section Header */}

            <div
              className="
                flex
                min-w-0
                items-center
                justify-between
                gap-3
              "
            >
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold sm:text-lg">
                  Account Information
                </h2>

                <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 sm:text-xs">
                  Your basic account details.
                </p>
              </div>

              <div
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-500/10
                  text-blue-600
                  dark:text-blue-400
                  sm:h-10
                  sm:w-10
                "
              >
                <User size={18} />
              </div>
            </div>

            {/* Account Details */}

            <div
              className="
                mt-5
                grid
                min-w-0
                grid-cols-1
                gap-3
                sm:mt-6
                sm:grid-cols-2
                sm:gap-4
              "
            >
              {/* Full Name */}

              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                  sm:p-4
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-blue-500/10
                      text-blue-500
                    "
                  >
                    <User size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-[11px]">
                      Full Name
                    </p>

                    <p
                      className="mt-1 truncate text-xs font-medium sm:text-sm"
                      title={profileDetails?.fullName}
                    >
                      {profileDetails?.fullName || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}

              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                  sm:p-4
                "
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-cyan-500/10
                      text-cyan-500
                    "
                  >
                    <Mail size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-[11px]">
                      Email Address
                    </p>

                    <p
                      className="mt-1 truncate text-xs font-medium sm:text-sm"
                      title={profileDetails?.email}
                    >
                      {profileDetails?.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Status */}

              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                  sm:p-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-green-500/10
                      text-green-500
                    "
                  >
                    <ShieldCheck size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-[11px]">
                      Account Status
                    </p>

                    <p className="mt-1 text-xs font-medium text-green-600 dark:text-green-400 sm:text-sm">
                      Verified
                    </p>
                  </div>
                </div>
              </div>

              {/* Member Since */}

              <div
                className="
                  min-w-0
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                  sm:p-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-purple-500/10
                      text-purple-500
                    "
                  >
                    <CalendarDays size={16} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 sm:text-[11px]">
                      Member Since
                    </p>

                    <p className="mt-1 text-xs font-medium sm:text-sm">
                      {profileDetails?.createdAt
                        ? new Date(profileDetails.createdAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ==========================================
                Security
            ========================================== */}

            <div className="mt-6 sm:mt-8">
              <h3 className="text-sm font-semibold sm:text-base">Security</h3>

              <div
                className="
                  mt-3
                  flex
                  min-w-0
                  flex-col
                  gap-4
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-3
                  dark:border-white/10
                  dark:bg-[#11161f]
                  sm:mt-4
                  sm:flex-row
                  sm:items-center
                  sm:justify-between
                  sm:p-4
                "
              >
                {/* Password Info */}

                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-orange-500/10
                      text-orange-500
                    "
                  >
                    <Lock size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-medium sm:text-sm">Password</p>

                    <p className="mt-1 truncate text-[10px] text-gray-500 dark:text-gray-400 sm:text-xs">
                      Keep your account secure.
                    </p>
                  </div>
                </div>

                {/* Change Password */}

                <button
                  type="button"
                  onClick={() => setOpenChangePasswordModal(true)}
                  className="
                    w-full
                    shrink-0
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-gray-700
                    transition
                    hover:border-blue-400
                    hover:text-blue-600
                    active:scale-[0.98]
                    dark:border-white/10
                    dark:bg-[#171b23]
                    dark:text-gray-300
                    dark:hover:border-blue-500
                    dark:hover:text-blue-400
                    sm:w-auto
                  "
                >
                  Change Password
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <EditProfileModal isOpen={isProfileModalOpen} />

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
