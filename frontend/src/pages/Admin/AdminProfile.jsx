import React, { useState } from "react";
import { User, Mail, Shield, Camera, Save, Lock } from "lucide-react";

import { useSelector } from "react-redux";

export default function AdminProfile() {
  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice,
  );

  const [fullName, setFullName] = useState(profileDetails?.fullName || "");

  const [email] = useState(profileDetails?.email || "");

  const [profileImage, setProfileImage] = useState(
    profileDetails?.profileImage || "",
  );

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setProfileImage(imageUrl);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setSuccessMessage("");

      // API call yaha lagegi
      // const formData = new FormData();
      // formData.append("fullName", fullName);
      // formData.append("profileImage", file);

      await new Promise((resolve) => setTimeout(resolve, 700));

      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const initials = fullName?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1
          className="
            text-xl
            font-bold
            text-gray-900
            dark:text-white
          "
        >
          Admin Profile
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-gray-500
            dark:text-gray-400
          "
        >
          Manage your administrator profile information.
        </p>
      </div>

      {successMessage && (
        <div
          className="
            rounded-lg
            border
            border-emerald-200
            bg-emerald-50
            px-4
            py-3
            text-xs
            font-medium
            text-emerald-600
            dark:border-emerald-500/20
            dark:bg-emerald-500/10
            dark:text-emerald-400
          "
        >
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Profile card */}
        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-white/10
            dark:bg-[#11151d]
          "
        >
          <div className="mb-5">
            <h2
              className="
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Profile Information
            </h2>

            <p
              className="
                mt-1
                text-xs
                text-gray-500
                dark:text-gray-400
              "
            >
              Update your personal information and profile picture.
            </p>
          </div>

          <div
            className="
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-center
            "
          >
            {/* Image */}
            <div className="relative shrink-0">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt={fullName}
                  className="
                    h-24
                    w-24
                    rounded-2xl
                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-2xl
                    bg-blue-100
                    text-2xl
                    font-bold
                    text-blue-600
                    dark:bg-blue-500/10
                    dark:text-blue-400
                  "
                >
                  {initials}
                </div>
              )}

              <label
                className="
                  absolute
                  -bottom-2
                  -right-2
                  flex
                  h-9
                  w-9
                  cursor-pointer
                  items-center
                  justify-center
                  rounded-lg
                  border-2
                  border-white
                  bg-blue-600
                  text-white
                  shadow
                  dark:border-[#11151d]
                "
              >
                <Camera size={15} />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {fullName || "Administrator"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-gray-500
                  dark:text-gray-400
                "
              >
                JPG, PNG or WEBP. Maximum recommended size 2MB.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-white/10
            dark:bg-[#11151d]
          "
        >
          <div className="mb-5">
            <h2
              className="
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Basic Information
            </h2>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            {/* Full Name */}
            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Full Name
              </label>

              <div className="relative">
                <User
                  size={16}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter full name"
                  className="
                    h-11
                    w-full
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-50
                    pl-10
                    pr-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-blue-500
                    dark:border-white/10
                    dark:bg-white/3
                    dark:text-white
                    dark:focus:border-blue-500
                  "
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-600
                  dark:text-gray-400
                "
              >
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="email"
                  value={email}
                  readOnly
                  className="
                    h-11
                    w-full
                    cursor-not-allowed
                    rounded-lg
                    border
                    border-gray-200
                    bg-gray-100
                    pl-10
                    pr-3
                    text-sm
                    text-gray-500
                    outline-none
                    dark:border-white/10
                    dark:bg-white/5
                    dark:text-gray-400
                  "
                />
              </div>

              <p
                className="
                  mt-1.5
                  text-[10px]
                  text-gray-400
                "
              >
                Email address cannot be changed here.
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div
          className="
            rounded-xl
            border
            border-gray-200
            bg-white
            p-5
            dark:border-white/10
            dark:bg-[#11151d]
          "
        >
          <div className="mb-5">
            <h2
              className="
                text-sm
                font-semibold
                text-gray-900
                dark:text-white
              "
            >
              Account Information
            </h2>
          </div>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
                rounded-lg
                bg-gray-50
                p-4
                dark:bg-white/3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                  dark:bg-blue-500/10
                  dark:text-blue-400
                "
              >
                <Shield size={17} />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Role
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                >
                  Administrator
                </p>
              </div>
            </div>

            <div
              className="
                flex
                items-center
                gap-3
                rounded-lg
                bg-gray-50
                p-4
                dark:bg-white/3
              "
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-emerald-50
                  text-emerald-600
                  dark:bg-emerald-500/10
                  dark:text-emerald-400
                "
              >
                <Lock size={17} />
              </div>

              <div>
                <p
                  className="
                    text-[10px]
                    text-gray-500
                    dark:text-gray-400
                  "
                >
                  Account Status
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    font-semibold
                    text-emerald-600
                    dark:text-emerald-400
                  "
                >
                  Active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="
              flex
              h-10
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-5
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <Save size={15} />

            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
