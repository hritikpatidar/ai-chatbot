import {
  User,
  ChevronRight,
  Shield,
  Bell,
  Palette,
  MessageSquare,
  SlidersHorizontal,
  Moon,
  LogOut,
  Lock,
  Camera,
  Mail,
} from "lucide-react";

import { useSelector } from "react-redux";
import profile from "../assets/profile1.jpg";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "../utils/validation";
import { motion, AnimatePresence } from "framer-motion";

const settingsSections = [
  {
    title: "Account",
    items: [
      {
        title: "Profile",
        description: "Manage your profile information",
        icon: User,
      },
      {
        title: "Security",
        description: "Manage your password and account security",
        icon: Shield,
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        title: "Notifications",
        description: "Manage your notification preferences",
        icon: Bell,
      },
      {
        title: "Appearance",
        description: "Customize the look and feel of the application",
        icon: Palette,
      },
    ],
  },
  {
    title: "Chat",
    items: [
      {
        title: "Chat Preferences",
        description: "Manage your AI chat preferences",
        icon: MessageSquare,
      },
      {
        title: "Advanced Settings",
        description: "Manage advanced chatbot settings",
        icon: SlidersHorizontal,
      },
    ],
  },
];

export default function Settings() {
  const { profileDetails } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    profileDetails?.profileImage || profile,
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      fullName: profileDetails?.fullName || "",
      email: profileDetails?.email || "",
      profileImage: undefined,
    },
  });

  const handleOpenProfileModal = () => {
    reset({
      fullName: profileDetails?.fullName || "",
      email: profileDetails?.email || "",
      profileImage: undefined,
    });

    setImagePreview(profileDetails?.profileImage || profile);
    setIsProfileModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("profileImage", file, {
      shouldValidate: false,
      shouldDirty: true,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancelProfile = () => {
    reset({
      fullName: profileDetails?.fullName || "",
      email: profileDetails?.email || "",
      profileImage: undefined,
    });

    setImagePreview(profileDetails?.profileImage || profile);

    setIsProfileModalOpen(false);
  };

  const handleSaveProfile = async (data) => {
    console.log("Profile Data:", data);
    const formData = new FormData();

    formData.append("fullName", data.fullName);
    formData.append("email", data.email);

    if (data.profileImage) {
      formData.append("profileImage", data.profileImage);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("FormData ready for API");
    setIsProfileModalOpen(false);
  };

  return (
    <div className="box-border min-h-full w-full max-w-full min-w-0 overflow-x-hidden text-white pt-10">
      <div className="box-border mx-auto w-full max-w-5xl min-w-0 px-3 py-3 min-[375px]:px-4 sm:px-5 sm:py-5 md:px-5 lg:px-5">
        <div className="w-full min-w-0">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold leading-tight text-white sm:text-2xl">
              Settings
            </h1>

            <p className="mt-1 max-w-full text-xs leading-5 text-gray-400">
              Manage your account and application preferences.
            </p>
          </div>
        </div>

        <div className="mt-4 box-border w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#171b23] p-3 transition hover:border-blue-500 sm:mt-5 sm:p-4">
          <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full min-w-0 items-center gap-3">
              <div className="relative h-10 w-10 shrink-0">
                <img
                  src={profileDetails?.profileImage || profile}
                  alt="User"
                  className="h-10 w-10 rounded-full object-cover"
                />

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#171b23] bg-green-500" />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium leading-5 text-white break-words">
                  {profileDetails?.fullName || "User"}

                  {profileDetails?.email && (
                    <span className="text-gray-400">
                      {" "}
                      ({profileDetails.email})
                    </span>
                  )}
                </h3>

                <p className="mt-1 text-[11px] leading-4 text-gray-400">
                  Manage your profile information
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenProfileModal}
              className="box-border w-full shrink-0 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/10 sm:w-auto"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-5 w-full max-w-full min-w-0 space-y-5 sm:mt-6 sm:space-y-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="w-full max-w-full min-w-0">
              <h2 className="mb-3 text-base font-semibold leading-5 text-white sm:mb-4 sm:text-lg">
                {section.title}
              </h2>

              <div className="flex w-full max-w-full min-w-0 flex-col gap-3">
                {section.items.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      className="group box-border flex w-full max-w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#171b23] p-3 text-left transition hover:border-blue-500 sm:gap-4 sm:p-4"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 transition group-hover:bg-blue-500/15">
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="overflow-hidden text-sm font-medium leading-5 text-white">
                          {item.title}
                        </h3>

                        <p className="mt-1 text-[11px] leading-4 text-gray-400 break-words">
                          {item.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={16}
                        className="shrink-0 text-gray-500 transition group-hover:translate-x-1 group-hover:text-blue-400"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 w-full max-w-full min-w-0 sm:mt-6">
          <h2 className="mb-3 text-base font-semibold leading-5 text-white sm:mb-4 sm:text-lg">
            Appearance
          </h2>

          <div className="box-border w-full max-w-full min-w-0 overflow-hidden rounded-xl border border-white/10 bg-[#171b23] p-3 transition hover:border-blue-500 sm:p-4">
            <div className="flex w-full min-w-0 items-center gap-3 sm:gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Moon size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium leading-5 text-white">
                  Dark Mode
                </h3>

                <p className="mt-1 text-[11px] leading-4 text-gray-400 break-words">
                  Use dark theme throughout the application
                </p>
              </div>

              <button
                type="button"
                aria-label="Toggle dark mode"
                className="relative h-5 w-9 shrink-0 rounded-full bg-blue-500"
              >
                <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-white" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 w-full max-w-full min-w-0 sm:mt-6">
          <h2 className="mb-3 text-base font-semibold leading-5 text-white sm:mb-4 sm:text-lg">
            Privacy
          </h2>

          <button
            type="button"
            className="group box-border flex w-full max-w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#171b23] p-3 text-left transition hover:border-blue-500 sm:gap-4 sm:p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
              <Lock size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium leading-5 text-white">
                Privacy & Data
              </h3>

              <p className="mt-1 text-[11px] leading-4 text-gray-400 break-words">
                Manage your data and privacy preferences
              </p>
            </div>

            <ChevronRight
              size={16}
              className="shrink-0 text-gray-500 transition group-hover:translate-x-1 group-hover:text-blue-400"
            />
          </button>
        </div>

        <div className="mt-5 w-full max-w-full min-w-0 sm:mt-6">
          <h2 className="mb-3 text-base font-semibold leading-5 text-white sm:mb-4 sm:text-lg">
            Account
          </h2>

          <button
            type="button"
            className="group box-border flex w-full max-w-full min-w-0 items-center gap-3 overflow-hidden rounded-xl border border-red-500/10 bg-[#171b23] p-3 text-left transition hover:border-red-500/40 sm:gap-4 sm:p-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
              <LogOut size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-medium leading-5 text-red-400">
                Log Out
              </h3>

              <p className="mt-1 text-[11px] leading-4 text-gray-500">
                Sign out from your account
              </p>
            </div>

            <ChevronRight
              size={16}
              className="shrink-0 text-gray-600 transition group-hover:translate-x-1 group-hover:text-red-400"
            />
          </button>
        </div>

        <div className="py-5 text-center sm:py-6">
          <p className="text-[10px] leading-4 text-gray-600 sm:text-[11px]">
            Saviesa Infotech • AI Chatbot
          </p>
        </div>
      </div>
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm sm:p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleCancelProfile}
          >
            {/* Modal Card */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.92,
                y: 30,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.92,
                y: 20,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border border-white/10 bg-[#171b23]/95 shadow-[0_0_60px_rgba(59,130,246,0.15)] backdrop-blur-xl"
            >
              {/* Top Glow */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-linear-to-r from-transparent via-blue-500 to-transparent"
              />

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.35 }}
                className="border-b border-white/10 px-4 py-4 sm:px-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white sm:text-lg">
                      Edit Profile ✨
                    </h2>

                    <p className="mt-1 text-[11px] text-gray-400">
                      Update your profile information
                    </p>
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleCancelProfile}
                    whileHover={{
                      scale: 1.08,
                      rotate: 90,
                    }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <span className="text-xl leading-none">×</span>
                  </motion.button>
                </div>
              </motion.div>

              <form onSubmit={handleSubmit(handleSaveProfile)}>
                {/* Body */}
                <div className="px-4 py-5 sm:px-5">
                  {/* Profile Image */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.45,
                      ease: "easeOut",
                    }}
                    className="flex flex-col items-center"
                  >
                    {/* Image Glow */}
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.08, 1],
                          opacity: [0.25, 0.5, 0.25],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600 blur-xl"
                      />

                      <motion.img
                        key={imagePreview}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        src={imagePreview}
                        alt="Profile Preview"
                        className="relative h-20 w-20 rounded-full border-2 border-white/10 object-cover shadow-[0_0_30px_rgba(59,130,246,0.35)] sm:h-24 sm:w-24"
                      />

                      {/* Camera Button */}
                      <motion.label
                        whileHover={{
                          scale: 1.1,
                          rotate: 5,
                        }}
                        whileTap={{ scale: 0.9 }}
                        className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-[#171b23] bg-linear-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      >
                        <Camera size={15} />

                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          className="hidden"
                          onChange={handleImageChange}
                        />
                      </motion.label>
                    </div>

                    <p className="mt-3 text-center text-[11px] text-gray-500">
                      JPG, PNG or WEBP · Maximum 2MB
                    </p>

                    {errors.profileImage && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-center text-[11px] text-red-400"
                      >
                        {errors.profileImage.message}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Form Fields */}
                  <div className="mt-6 space-y-4">
                    {/* Full Name */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.25,
                        duration: 0.4,
                      }}
                    >
                      <label className="mb-1.5 block text-xs font-medium text-gray-300">
                        Full Name
                      </label>

                      <div
                        className={`flex items-center rounded-xl border bg-[#222938] px-3 transition-all duration-200 ${
                          errors.fullName
                            ? "border-red-500/60"
                            : "border-white/10 focus-within:border-blue-500 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
                        }`}
                      >
                        <User size={16} className="shrink-0 text-gray-400" />

                        <input
                          type="text"
                          {...register("fullName")}
                          placeholder="Enter your name"
                          className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500"
                        />
                      </div>

                      {errors.fullName && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-[11px] text-red-400"
                        >
                          {errors.fullName.message}
                        </motion.p>
                      )}
                    </motion.div>

                    {/* Email */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.32,
                        duration: 0.4,
                      }}
                    >
                      <label className="mb-1.5 block text-xs font-medium text-gray-300">
                        Email
                      </label>

                      <div
                        className={`flex items-center rounded-xl border bg-[#222938] px-3 transition-all duration-200 ${
                          errors.email
                            ? "border-red-500/60"
                            : "border-white/10 focus-within:border-blue-500 focus-within:shadow-[0_0_20px_rgba(59,130,246,0.08)]"
                        }`}
                      >
                        <Mail size={16} className="shrink-0 text-gray-400" />

                        <input
                          type="email"
                          {...register("email")}
                          placeholder="Enter your email"
                          className="w-full bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-gray-500"
                        />
                      </div>

                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 text-[11px] text-red-400"
                        >
                          {errors.email.message}
                        </motion.p>
                      )}
                    </motion.div>
                  </div>
                </div>

                {/* Footer */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.4,
                    duration: 0.35,
                  }}
                  className="flex flex-col-reverse gap-2 border-t border-white/10 px-4 py-4 sm:flex-row sm:justify-end sm:px-5"
                >
                  {/* Cancel */}
                  <motion.button
                    type="button"
                    onClick={handleCancelProfile}
                    disabled={isSubmitting}
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-gray-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    Cancel
                  </motion.button>

                  {/* Save */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{
                      scale: isSubmitting ? 1 : 1.03,
                      boxShadow: isSubmitting
                        ? "none"
                        : "0 0 30px rgba(59,130,246,.35)",
                    }}
                    whileTap={{
                      scale: isSubmitting ? 1 : 0.97,
                    }}
                    className="w-full rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
