import {
  User,
  Mail,
  Shield,
  Palette,
  LogOut,
  Settings,
  Lock,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/features/Auth/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ConfirmModal from "../../components/ClientComponent/ConfirmModal";

export default function ClientSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice || {},
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await deleteAccountService();
      if (response?.data?.success) {
        dispatch(logoutSuccess());
        clearLocalStorage();
        setDeleteModalOpen(false);
        navigate("/login", {
          replace: true,
        });
      }
    } catch (error) {
      console.error("Delete account failed:", error);

      alert(
        error?.response?.data?.message ||
          "Unable to delete account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const adminName = profileDetails?.fullName || "Admin";
  const adminEmail = profileDetails?.email || "No email available";
  const adminRole = profileDetails?.role || "client";

  return (
    <div
      className="
        min-h-full
        w-full
        bg-transparent
        px-4
        py-5
        text-gray-900
        transition-colors
        duration-300
        sm:px-6
        sm:py-6
        dark:text-white
      "
    >
      <div className="mx-auto w-full max-w-6xl">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-600
                dark:text-blue-400
              "
            >
              <Settings size={20} />
            </div>
            <div>
              <h1
                className="
                  text-2xl
                  font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                Admin Settings
              </h1>
              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Manage your administrator account and preferences.
              </p>
            </div>
          </div>
        </div>
        <div
          className="
            mt-6
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div
            className="
              border-b
              border-gray-200
              px-5
              py-4
              dark:border-white/10
            "
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Administrator Profile
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Your administrator account information.
            </p>
          </div>
          <div className="p-5">
            <div
              className="
                flex
                flex-col
                gap-5
                sm:flex-row
                sm:items-center
              "
            >
              <div
                className="
                  flex
                  h-16
                  w-16
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-blue-600
                  text-xl
                  font-semibold
                  text-white
                "
              >
                {adminName?.charAt(0)?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className="
                    truncate
                    text-lg
                    font-semibold
                    text-gray-900
                    dark:text-white
                  "
                  title={adminName}
                >
                  {adminName}
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Administrator
                </p>
              </div>
              <div
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
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
                Active
              </div>
            </div>
            <div
              className="
                mt-6
                grid
                grid-cols-1
                gap-4
                md:grid-cols-2
              "
            >
              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  dark:border-white/10
                  dark:bg-white/3
                "
              >
                <div className="flex items-center gap-3">
                  <User
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Full Name
                    </p>
                    <p
                      className="
                        mt-1
                        truncate
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-white
                      "
                      title={adminName}
                    >
                      {adminName}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  dark:border-white/10
                  dark:bg-white/3
                "
              >
                <div className="flex items-center gap-3">
                  <Mail
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email
                    </p>
                    <p
                      className="
                        mt-1
                        truncate
                        text-sm
                        font-medium
                        text-gray-900
                        dark:text-white
                      "
                      title={adminEmail}
                    >
                      {adminEmail}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  dark:border-white/10
                  dark:bg-white/3
                "
              >
                <div className="flex items-center gap-3">
                  <Shield
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Account Role
                    </p>

                    <p className="mt-1 text-sm font-medium capitalize text-gray-900 dark:text-white">
                      {adminRole}
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="
                  rounded-xl
                  border
                  border-gray-200
                  bg-gray-50
                  p-4
                  dark:border-white/10
                  dark:bg-white/3
                "
              >
                <div className="flex items-center gap-3">
                  <Lock
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Account Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                      Active
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
            dark:border-white/10
            dark:bg-[#171b23]
          "
        >
          <div
            className="
              border-b
              border-gray-200
              px-5
              py-4
              dark:border-white/10
            "
          >
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">
              Preferences
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Application preferences and appearance settings.
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-white/10">
            <div
              className="
                flex
                flex-col
                gap-3
                px-5
                py-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-blue-500/10
                    text-blue-600
                    dark:text-blue-400
                  "
                >
                  <Palette size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Appearance
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Manage your dashboard theme from the application theme
                    control.
                  </p>
                </div>
              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  bg-gray-100
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-gray-600
                  dark:bg-white/10
                  dark:text-gray-300
                "
              >
                Theme enabled
              </span>
            </div>
            <div
              className="
                flex
                flex-col
                gap-3
                px-5
                py-5
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    bg-green-500/10
                    text-green-600
                    dark:text-green-400
                  "
                >
                  <Shield size={19} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Account Security
                  </p>

                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Your administrator account is protected by authentication.
                  </p>
                </div>
              </div>

              <span
                className="
                  w-fit
                  rounded-full
                  bg-green-500/10
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-green-600
                  dark:text-green-400
                "
              >
                Protected
              </span>
            </div>
          </div>
        </div>
        <div
          className="
            mt-5
            rounded-2xl
            border
            border-red-200
            bg-white
            shadow-sm
            dark:border-red-500/20
            dark:bg-[#171b23]
          "
        >
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-red-500/10
                  text-red-600
                  dark:text-red-400
                "
              >
                <Trash2 size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Delete Account
                </h2>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                  Permanently delete your administrator account. This action
                  cannot be undone.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              disabled={loading}
              className="
                mt-5
                inline-flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-lg
                border
                border-red-200
                bg-red-50
                px-4
                py-2.5
                text-sm
                font-medium
                text-red-600
                transition
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-auto
                dark:border-red-500/20
                dark:bg-red-500/10
                dark:text-red-400
                dark:hover:bg-red-500/20
              "
            >
              <Trash2 size={16} />
              Delete Account
            </button>
          </div>
        </div>
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => {
            if (!loading) {
              setDeleteModalOpen(false);
            }
          }}
          onConfirm={handleDeleteAccount}
          loading={loading}
          title="Delete Account?"
          message="Are you sure you want to permanently delete your administrator account? This action cannot be undone."
          confirmText={loading ? "Deleting..." : "Delete Account"}
          cancelText="Cancel"
          danger
        />

        <div className="py-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            AI Chatbot Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}
