import { motion, AnimatePresence } from "framer-motion";
import { Camera, User, Mail, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import profile from "../assets/profile1.jpg";
import { useDispatch, useSelector } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "../utils/validation";
import { setIsProfileModalOpen } from "../redux/features/Auth/authSlice";

export default function EditProfileModal() {
  const dispatch = useDispatch();
  const { profileDetails, refreshToken, isProfileModalOpen } = useSelector(
    (store) => store.authReducer.AuthSlice,
  );
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

  useEffect(() => {
    if (profileDetails) {
      reset({
        fullName: profileDetails?.fullName || "",
        email: profileDetails?.email || "",
      });

      setImagePreview(profileDetails?.profileImage || profile);
    }
  }, [isProfileModalOpen, profileDetails, reset]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setValue("profileImage", file, {
      shouldValidate: false,
      shouldDirty: true,
    });

    setImagePreview(URL.createObjectURL(file));
  };

  const handleCancel = () => {
    reset({
      fullName: profileDetails?.fullName || "",
      email: profileDetails?.email || "",
      profileImage: undefined,
    });

    setImagePreview(profileDetails?.profileImage || profile);
    dispatch(setIsProfileModalOpen(false));
  };

  const submitProfile = async (data) => {
    try {
      const formData = new FormData();

      formData.append("fullName", data.fullName);
      formData.append("email", data.email);

      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }
      console.log("data.profileImage", data.profileImage);

      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log("Profile Data:", data);

      // API yaha call karo
      //
      // data.fullName
      // data.email
      // data.profileImage -> File

      // await updateProfileService(data);

      dispatch(setIsProfileModalOpen(false));
    } catch (error) {
      console.error("Update Profile Error:", error);
    }
  };

  return (
    <AnimatePresence>
      {isProfileModalOpen && (
        <motion.div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
            backdrop-blur-sm
            dark:bg-black/70
          "
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={handleCancel}
        >
          {/* ==========================================
              Modal
          =========================================== */}

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
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-md
              overflow-y-auto
              rounded-2xl
              border
              border-gray-200
              bg-white
              shadow-2xl
              dark:border-white/10
              dark:bg-[#171b23]
            "
          >
            {/* ==========================================
                Top Glow
            =========================================== */}

            <motion.div
              initial={{
                opacity: 0,
                scaleX: 0,
              }}
              animate={{
                opacity: 1,
                scaleX: 1,
              }}
              transition={{
                delay: 0.15,
                duration: 0.5,
              }}
              className="
                absolute
                left-1/2
                top-0
                h-px
                w-2/3
                -translate-x-1/2
                bg-linear-to-r
                from-transparent
                via-blue-500
                to-transparent
              "
            />

            {/* ==========================================
                Header
            =========================================== */}

            <div
              className="
                border-b
                border-gray-200
                px-5
                py-4
                dark:border-white/10
              "
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2
                    className="
                      text-lg
                      font-semibold
                      text-gray-900
                      dark:text-white
                    "
                  >
                    Edit Profile ✨
                  </h2>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-gray-500
                      dark:text-gray-400
                    "
                  >
                    Update your profile information
                  </p>
                </div>

                <motion.button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  whileHover={{
                    scale: 1.08,
                    rotate: 90,
                  }}
                  whileTap={{
                    scale: 0.9,
                  }}
                  className="
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-100
                    text-gray-500
                    transition
                    hover:bg-gray-200
                    hover:text-gray-900
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-gray-400
                    dark:hover:bg-white/10
                    dark:hover:text-white
                  "
                >
                  <X size={17} />
                </motion.button>
              </div>
            </div>

            {/* ==========================================
                Form
            =========================================== */}

            <form onSubmit={handleSubmit(submitProfile)}>
              {/* ==========================================
                  Body
              =========================================== */}

              <div className="px-5 py-6">
                {/* ==========================================
                    Profile Image
                =========================================== */}

                <div className="flex flex-col items-center">
                  <div className="relative">
                    {/* Animated Glow */}

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
                      className="
                        absolute
                        inset-0
                        rounded-full
                        bg-linear-to-r
                        from-cyan-400
                        via-blue-500
                        to-purple-600
                        blur-xl
                      "
                    />

                    {/* Preview */}

                    <motion.img
                      key={imagePreview}
                      initial={{
                        opacity: 0,
                        scale: 0.85,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                      src={imagePreview}
                      alt="Profile Preview"
                      className="
                        relative
                        h-24
                        w-24
                        rounded-full
                        border-2
                        border-gray-200
                        object-cover
                        shadow-[0_0_30px_rgba(59,130,246,0.35)]
                        dark:border-white/10
                      "
                    />

                    {/* Camera */}

                    <motion.label
                      whileHover={{
                        scale: 1.1,
                        rotate: 5,
                      }}
                      whileTap={{
                        scale: 0.9,
                      }}
                      className="
                        absolute
                        bottom-0
                        right-0
                        flex
                        h-8
                        w-8
                        cursor-pointer
                        items-center
                        justify-center
                        rounded-full
                        border-2
                        border-white
                        bg-linear-to-r
                        from-blue-500
                        to-purple-600
                        text-white
                        shadow-lg
                        dark:border-[#171b23]
                      "
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

                  <p
                    className="
                      mt-3
                      text-center
                      text-[11px]
                      text-gray-500
                    "
                  >
                    JPG, PNG or WEBP · Maximum 2MB
                  </p>

                  {errors.profileImage?.message && (
                    <p
                      className="
                        mt-2
                        text-center
                        text-[11px]
                        text-red-500
                        dark:text-red-400
                      "
                    >
                      {errors.profileImage.message}
                    </p>
                  )}
                </div>

                {/* ==========================================
                    Form Fields
                =========================================== */}

                <div className="mt-6 space-y-4">
                  {/* Full Name */}

                  <div>
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
                      Full Name
                    </label>

                    <div
                      className={`
                        flex
                        items-center
                        rounded-xl
                        border
                        bg-gray-50
                        px-3
                        transition
                        dark:bg-[#222938]
                        ${
                          errors.fullName
                            ? "border-red-500/60"
                            : "border-gray-200 dark:border-white/10 focus-within:border-blue-500"
                        }
                      `}
                    >
                      <User size={16} className="shrink-0 text-gray-400" />

                      <input
                        type="text"
                        {...register("fullName", {
                          required: "Full name is required.",
                        })}
                        placeholder="Enter your name"
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
                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          text-red-500
                          dark:text-red-400
                        "
                      >
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>

                  {/* Email */}

                  <div>
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
                      Email
                    </label>

                    <div
                      className={`
                        flex
                        items-center
                        rounded-xl
                        border
                        bg-gray-50
                        px-3
                        transition
                        dark:bg-[#222938]
                        ${
                          errors.email
                            ? "border-red-500/60"
                            : "border-gray-200 dark:border-white/10 focus-within:border-blue-500"
                        }
                      `}
                    >
                      <Mail size={16} className="shrink-0 text-gray-400" />

                      <input
                        type="email"
                        {...register("email", {
                          required: "Email is required.",
                        })}
                        placeholder="Enter your email"
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
                      <p
                        className="
                          mt-1.5
                          text-[11px]
                          text-red-500
                          dark:text-red-400
                        "
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* ==========================================
                  Footer
              =========================================== */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-2
                  border-t
                  border-gray-200
                  px-5
                  py-4
                  sm:flex-row
                  sm:justify-end
                  dark:border-white/10
                "
              >
                {/* Cancel */}

                <motion.button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-gray-200
                    bg-gray-100
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-gray-700
                    transition
                    hover:bg-gray-200
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                    sm:w-auto
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-gray-300
                    dark:hover:bg-white/10
                  "
                >
                  Cancel
                </motion.button>

                {/* Save */}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{
                    scale: isSubmitting ? 1 : 1.03,
                  }}
                  whileTap={{
                    scale: isSubmitting ? 1 : 0.97,
                  }}
                  className="
                    w-full
                    rounded-xl
                    bg-linear-to-r
                    from-blue-500
                    to-purple-600
                    px-4
                    py-2.5
                    text-xs
                    font-semibold
                    text-white
                    transition
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    sm:w-auto
                  "
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
