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
import { getImageUrl } from "../../utils/imageUrl";
import profile from "../../assets/profile1.jpg";
import PaymentMethods from "../../components/ClientComponent/PaymentMethods";
import { useCurrentSubscription } from "../../hooks/Subscription/useSubscription";
import StripeProvider from "../../components/Subscription/StripeProvider";
import { useLanguage } from "../../context/LanguageContext";
import clientScreens from "../../context/translations/clientScreens";

export default function ClientSettings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const translate = (key) => {
    const translated = t(key);
    return translated === key && language === "hi"
      ? clientScreens[key] || key
      : translated;
  };

  const { profileDetails } = useSelector(
    (state) => state?.authReducer?.AuthSlice || {},
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, refetch, isFetching } = useCurrentSubscription();

  const subscription = data?.data?.data || data?.data || null;

  const subscriptionId = subscription?._id || subscription?.id || null;

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
          translate("Unable to delete account. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  const adminName = profileDetails?.fullName || translate("Client");
  const adminEmail = profileDetails?.email || translate("No email available");
  const adminRole = profileDetails?.role || translate("Client");

  return (
    <div
      className="
        min-h-full
        w-full
        bg-transparent
        text-gray-900
        transition-colors
        duration-300
        dark:text-white
      "
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-xl
                bg-blue-500/10
                text-blue-500
              "
            >
              <Settings size={21} />
            </div>

            <div>
              <h1
                className="
                  text-xl font-semibold
                  text-gray-900
                  dark:text-white
                "
              >
                {translate("Settings")}
              </h1>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                {translate("Manage your administrator account and preferences.")}
              </p>
            </div>
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
            {translate("Administrator Profile")}
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {translate("Your administrator account information.")}
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
              {profileDetails?.profileImage ? (
                <img
                  src={getImageUrl(profileDetails?.profileImage, profile)}
                  alt={translate("Profile")}
                  className="h-full w-full rounded-xl object-cover"
                />
              ) : (
                adminName?.charAt(0)?.toUpperCase() || "A"
              )}
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
                {translate("Administrator")}
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
              {translate("Active")}
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
                <User size={18} className="text-blue-600 dark:text-blue-400" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {translate("Full Name")}
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
                <Mail size={18} className="text-blue-600 dark:text-blue-400" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {translate("Email")}
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
                    {translate("Account Role")}
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
                <Lock size={18} className="text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {translate("Account Status")}
                  </p>
                  <p className="mt-1 text-sm font-medium text-green-600 dark:text-green-400">
                    {translate("Active")}
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
            {translate("Preferences")}
          </h2>

          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {translate("Application preferences and appearance settings.")}
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
                  {translate("Appearance")}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {translate(
                    "Manage your dashboard theme from the application theme control.",
                  )}
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
              {translate("Theme enabled")}
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
                  {translate("Account Security")}
                </p>

                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  {translate(
                    "Your administrator account is protected by authentication.",
                  )}
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
              {translate("Protected")}
            </span>
          </div>
        </div>
      </div>
      <StripeProvider>
        <PaymentMethods subscriptionId={subscriptionId} />
      </StripeProvider>
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
                {translate("Delete Account")}
              </h2>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {translate(
                  "Permanently delete your administrator account. This action cannot be undone.",
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setDeleteModalOpen(true)}
            disabled={deleteModalOpen}
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
            {translate("Delete Account")}
          </button>
        </div>
      </div>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onCancel={() => {
          if (!loading) {
            setDeleteModalOpen(false);
          }
        }}
        onConfirm={handleDeleteAccount}
        loading={loading}
        title={translate("Delete Account?")}
        message={translate(
          "Are you sure you want to permanently delete your administrator account? This action cannot be undone.",
        )}
        confirmText={
          loading ? translate("Deleting...") : translate("Delete Account")
        }
        cancelText={translate("Cancel")}
        danger
      />

      <div className="py-6 text-center">
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {translate("AI Chatbot Client Panel")}
        </p>
      </div>
    </div>
  );
}
